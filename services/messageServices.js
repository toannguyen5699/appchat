import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import _ from "lodash"; // lib sap xep

const LIMIT_CONVERSATIONS_TAKEN = 15;

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
				

				resolve({
					userConversations: userConversations,
					groupConversations: groupConversations,
					allConversations: allConversations
				});

			} catch (error) {
			reject(error);
		}
	});
};


module.exports = {
	getAllConversationItems: getAllConversationItems
}