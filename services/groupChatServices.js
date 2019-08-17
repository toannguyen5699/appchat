import _ from "lodash";
import chatGroupModel from "./../models/chatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
	return new Promise(async(resolve, reject) => {
		try {
			// add current userId to array members
			arrayMemberIds.unshift({userId: `${currentUserId}`});

			arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");

			let newGroupItem = {
				groupChatName: String,
				userAmount: arrayMemberIds.length,
				userId: `${currentUserId}`,
				members: arrayMemberIds
			};

			let newGroup = await chatGroupModel.createNew(newGroupItem);
			resolve(newGroup);
		} catch (error) {
			reject(error);
		}
	});
}
module.exports = {
	addNewGroup: addNewGroup
}