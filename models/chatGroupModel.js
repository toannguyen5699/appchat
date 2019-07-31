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
	updatedAt: { type: Number, default: null },
	deletedAt: { type: Number, default: null }
});

chatGroupSchema.statics = {
	/**
	 * get chat group items by userId and limit
	 * @param {string} userId current userId
	 * @param {number} limit 
	 */
	getChatGroups(userId, limit) {
		return this.find({
			"members": {$elemMatch: {"userId": userId}}
		}).sort({"createdAt": -1}).limit(limit).exec();
	}
}

var ChatGroup = mongoose.model('ChatGroup', chatGroupSchema, 'chat-groups');

module.exports = ChatGroup