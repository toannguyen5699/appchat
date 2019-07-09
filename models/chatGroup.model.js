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

var ChatGroup = mongoose.model('ChatGroup', chatGroupSchema, 'chat-groups');

module.exports = ChatGroup