import mongoose from "mongoose";

var chatGroupSchema = new mongoose.Schema({
	name: String,
	userAmount: { type: Number, min: 3, max: 100},
	messageAmount: { type: Number, default: 0},
	userId: String,
	members: [
		{ userId: String }
	],
	createdAt: { type: Number, default: Date.now }, 
	updatedAt: { type: Number, default: Date.now },
	deletedAt: { type: Number, default: null }
});

chatGroupSchema.statics = {
	createNew(item) {
		return this.create(item);
	},

	/**
	 * get chat group items by userId and limit
	 * @param {string} userId current userId
	 * @param {number} limit 
	 */
	getChatGroups(userId, limit) {
		return this.find({
			"members": {$elemMatch: {"userId": userId}}
		}).sort({"updatedAt": -1}).limit(limit).exec();
	},

	getChatGroupById(id) {
		return this.findById(id).exec();
	},

	/**
	 * Update group chat when has new message
	 * @param {string} id of group chat
	 * @param {number} newMessageAmount 
	 */
	updateWhenHasNewMessage(id, newMessageAmount) {
		return this.findByIdAndUpdate(id, {
			"messageAmount": newMessageAmount,
			"updatedAt": Date.now()
		}).exec();
	},

	getChatGroupIdsByUser(userId) {
		return this.find({
			"members": {$elemMatch: {"userId": userId}}
		}, {_id: 1}).exec();
	},

	readMoreChatGroups(userId, skip, limit) {
		return this.find({
			"members": {$elemMatch: {"userId": userId}}
		}).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
	}
}

var ChatGroup = mongoose.model('ChatGroup', chatGroupSchema, 'chat-groups');

module.exports = ChatGroup