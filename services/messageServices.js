import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import messageModel from "./../models/messageModel";
import _ from "lodash"; // lib sap xep
import {transErrors} from "./../lang/vi";
import {app} from "./../config/app";
import fsExtra from "fs-extra";

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

/**
 * get all conversations
 * @param {string} currentUserId 
 */
let getAllConversationItems  = (currentUserId) => {
	return new Promise(async (resolve, reject) => {
		try {
				let contacts = await contactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
				let userConversationsPromise = contacts.map(async (contact) => {
					if (contact.contactId == currentUserId) {
						let getUserContact = await userModel.getNormalUserDataById(contact.userId);
						getUserContact.updatedAt = contact.updatedAt;

						return getUserContact;
					} else {
						let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
						getUserContact.updatedAt = contact.updatedAt;

						return getUserContact;
					}					
				});
				let userConversations = await Promise.all(userConversationsPromise);						
				let groupConversations = await chatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
				let allConversations = userConversations.concat(groupConversations);

				allConversations = _.sortBy(allConversations, (item) => {
					return -item.updatedAt;
				});

				// get messages to aplly in screen chat
				let allConversationWithMessagesPromise = allConversations.map( async (conversation) => {
					conversation = conversation.toObject();

					if (conversation.members) {
						let getMessages = await messageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
						conversation.messages = _.reverse(getMessages);

						//conversation.membersInfo = []
						//for (let member of conversation.members) {
						//	let userInfo = await userModel.getNormalUserDataById(member.userId);
						//	conversation.membersInfo.oush(userInfo);
						//}
						
					} else {
						let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
						conversation.messages = _.reverse(getMessages);
						
					}
					return conversation;
				});
				
				let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
				// sort by updateAt 
				allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
					return -item.updatedAt;
				});

				resolve({
					allConversationWithMessages: allConversationWithMessages
				});

			} catch (error) {
			reject(error);
		}
	});
};

/**
 * add new message text and emoji
 * @param {object} sender current User
 * @param {string} receiverId if of an user or group
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isChatGroup) {
				let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
				if (!getChatGroupReceiver) {
					return reject(transErrors.conversation_no_found);
				}
				let receiver = {
					id: getChatGroupReceiver._id,
					name: getChatGroupReceiver.name,
					avatar: app.general_avatar_group_chat
				};

				let  newMessageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					conversationType: messageModel.conversationTypes.GROUP,
					messageType: messageModel.messageTypes.TEXT,
					sender: sender,
					receiver: receiver,
					text: messageVal, 
					createdAt: Date.now()
				};

				// create new message
				let newMessage = await messageModel.model.createNew(newMessageItem);
				// update group chat
				await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
				resolve(newMessage);
			} else {
				let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
				if (!getUserReceiver) {
					return reject(transErrors.conversation_no_found);
				}

				let receiver = {
					id: getUserReceiver._id,
					name: getUserReceiver.username,
					avatar: getUserReceiver.avatar
				};

				let  newMessageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					conversationType: messageModel.conversationTypes.PERSONAL,
					messageType: messageModel.messageTypes.TEXT,
					sender: sender,
					receiver: receiver,
					text: messageVal, 
					createdAt: Date.now()
				};
				// create new message
				let newMessage = await messageModel.model.createNew(newMessageItem);
				// update contact
				await contactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

				resolve(newMessage);
			}
		} catch (error) {
			reject(error);
		}
	});
};

/**
 * add new message image
 * @param {object} sender current User
 * @param {string} receiverId if of an user or group
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isChatGroup) {
				let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
				if (!getChatGroupReceiver) {
					return reject(transErrors.conversation_no_found);
				}
				let receiver = {
					id: getChatGroupReceiver._id,
					name: getChatGroupReceiver.name,
					avatar: app.general_avatar_group_chat
				};

				let imageBuffer = await fsExtra.readFile(messageVal.path);
				let imageContentType = messageVal.mimeType;
				let imageName = messageVal.originalname;

				let  newMessageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					conversationType: messageModel.conversationTypes.GROUP,
					messageType: messageModel.messageTypes.IMAGE,
					sender: sender,
					receiver: receiver,
					file: { data: imageBuffer, contentType: imageContentType, fileName: imageName},
					createdAt: Date.now()
				};

				// create new message
				let newMessage = await messageModel.model.createNew(newMessageItem);
				// update group chat
				await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
				resolve(newMessage);
			} else {
				let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
				if (!getUserReceiver) {
					return reject(transErrors.conversation_no_found);
				}

				let receiver = {
					id: getUserReceiver._id,
					name: getUserReceiver.username,
					avatar: getUserReceiver.avatar
				};

				let imageBuffer = await fsExtra.readFile(messageVal.path);
				let imageContentType = messageVal.mimeType;
				let imageName = messageVal.originalname;

				let  newMessageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					conversationType: messageModel.conversationTypes.PERSONAL,
					messageType: messageModel.messageTypes.IMAGE,
					sender: sender,
					receiver: receiver,
					file: { data: imageBuffer, contentType: imageContentType, fileName: imageName},
					createdAt: Date.now()
				};

				// create new message
				let newMessage = await messageModel.model.createNew(newMessageItem);
				// update contact
				await contactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

				resolve(newMessage);
			}
		} catch (error) {
			reject(error);
		}
	});
};

/**
 * add new message attachment
 * @param {object} sender current User
 * @param {string} receiverId if of an user or group
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isChatGroup) {
				let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
				if (!getChatGroupReceiver) {
					return reject(transErrors.conversation_no_found);
				}
				let receiver = {
					id: getChatGroupReceiver._id,
					name: getChatGroupReceiver.name,
					avatar: app.general_avatar_group_chat
				};

				let attachmentBuffer = await fsExtra.readFile(messageVal.path);
				let attachmentContentType = messageVal.mimeType;
				let attachmentName = messageVal.originalname;

				let  newMessageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					conversationType: messageModel.conversationTypes.GROUP,
					messageType: messageModel.messageTypes.FILE,
					sender: sender,
					receiver: receiver,
					file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},
					createdAt: Date.now()
				};

				// create new message
				let newMessage = await messageModel.model.createNew(newMessageItem);
				// update group chat
				await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
				resolve(newMessage);
			} else {
				let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
				if (!getUserReceiver) {
					return reject(transErrors.conversation_no_found);
				}

				let receiver = {
					id: getUserReceiver._id,
					name: getUserReceiver.username,
					avatar: getUserReceiver.avatar
				};

				let attachmentBuffer = await fsExtra.readFile(messageVal.path);
				let attachmentContentType = messageVal.mimeType;
				let attachmentName = messageVal.originalname;

				let  newMessageItem = {
					senderId: sender.id,
					receiverId: receiver.id,
					conversationType: messageModel.conversationTypes.PERSONAL,
					messageType: messageModel.messageTypes.FILE,
					sender: sender,
					receiver: receiver,
					file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName},
					createdAt: Date.now()
				};

				// create new message
				let newMessage = await messageModel.model.createNew(newMessageItem);
				// update contact
				await contactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

				resolve(newMessage);
			}
		} catch (error) {
			reject(error);
		}
	});
};

/**
 * Read more personal and group chat
 * @param {string} currentUserId 
 * @param {number} skipPersonal 
 * @param {number} skipGroup 
 */
let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await contactModel.readMoreContacts(currentUserId, skipPersonal, LIMIT_CONVERSATIONS_TAKEN);
			let userConversationsPromise = contacts.map(async (contact) => {
				if (contact.contactId == currentUserId) {
					let getUserContact = await userModel.getNormalUserDataById(contact.userId);
					getUserContact.updatedAt = contact.updatedAt;

					return getUserContact;
				} else {
					let getUserContact = await userModel.getNormalUserDataById(contact.contactId);
					getUserContact.updatedAt = contact.updatedAt;

					return getUserContact;
				}					
			});
			let userConversations = await Promise.all(userConversationsPromise);						
			let groupConversations = await chatGroupModel.readMoreChatGroups(currentUserId, skipGroup, LIMIT_CONVERSATIONS_TAKEN);
			let allConversations = userConversations.concat(groupConversations);

			allConversations = _.sortBy(allConversations, (item) => {
				return -item.updatedAt;
			});

			// get messages to aplly in screen chat
			let allConversationWithMessagesPromise = allConversations.map( async (conversation) => {
				conversation = conversation.toObject();

				if (conversation.members) {
					let getMessages = await messageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
					conversation.messages = _.reverse(getMessages);
				} else {
					let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
					conversation.messages = _.reverse(getMessages);
					
				}
				return conversation;
			});
			
			let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
			// sort by updateAt 
			allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
				return -item.updatedAt;
			});

			resolve(allConversationWithMessages);

		} catch (error) {
		reject(error);
		}
	});
};

/**
 * 
 * @param {string} currentUserId 
 * @param {number} skipMessage 
 * @param {string} targetId 
 * @param {boolean} chatInGroup 
 */
let readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			// message in group
			if (chatInGroup) {
				let getMessages = await messageModel.model.readMoreMessagesInGroup(targetId, skipMessage, LIMIT_MESSAGES_TAKEN); 

				getMessages = _.reverse(getMessages);

				return resolve(getMessages);
			} 
			// message in personal
			let getMessages = await messageModel.model.readMoreMessagesInPersonal(currentUserId, targetId, skipMessage, LIMIT_MESSAGES_TAKEN);	

			getMessages = _.reverse(getMessages);	
						
			return resolve(getMessages);
			
		} catch (error) {
		reject(error);
		}
	});
}


module.exports = {
	getAllConversationItems: getAllConversationItems,
	addNewTextEmoji: addNewTextEmoji,
	addNewImage: addNewImage,
	addNewAttachment: addNewAttachment,
	readMoreAllChat: readMoreAllChat,
	readMore: readMore
}