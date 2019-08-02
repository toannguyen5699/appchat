import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import messageModel from "./../models/messageModel";
import _ from "lodash"; // lib sap xep

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
						conversation.messages = getMessages;
					} else {
						let getMessages = await messageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
						conversation.messages = getMessages;
						
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


module.exports = {
	getAllConversationItems: getAllConversationItems
}