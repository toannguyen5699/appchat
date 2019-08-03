import mongoose from "mongoose";

var messageSchema = new mongoose.Schema({
	senderId: String,
	receiverId: String,
	conversationType: String,
	messageType: String,
	sender: {
		id: String,
		name: String,
		avatar: String
	},
	receiver: {
		id: String,
		name: String,
		avatar: String	
	},
	text: String, 
	file: { data: Buffer, contentType: String, fileName: String},
	createdAt: { type: Number, default: Date.now }, 
	updatedAt: { type: Number, default: null },
	deletedAt: { type: Number, default: null }
});

messageSchema.statics = {
	/**
	 * create new message
	 * @param {object} item 
	 */
	createNew(item) {
		return this.create(item);
	},
	/**
	 * get message in personal
	 * @param {string} senderId currentUserId
	 * @param {string} receiverId id of contact
	 * @param {number} limit 
	 */
	getMessagesInPersonal(senderId, receiverId, limit) {
		return this.find({
			$or: [
				{$and:[
					{"senderId": senderId},
					{"receiverId": receiverId}
				]},
				{$and:[
					{"senderId": receiverId},
					{"receiverId": senderId}
				]}
			]
		}).sort({"createdAt": 1}).limit(limit).exec();
	},
	
	/**
	 * get message in group
	 * @param {string} receiverId if of group chat
	 * @param {number} limit 
	 */
	getMessagesInGroup(receiverId, limit) {
		return this.find({"receiverId": receiverId}).sort({"createdAt": 1}).limit(limit).exec();
	}
};

const MESSAGE_CONVERSATION_TYPES = {
	PERSONAL: "personal",
	GROUP: "group"
};

const MESSAGE_TYPES = {
	TEXT: "text",
	IMAGE: "image",
	FILE: "file"
};

var Message = mongoose.model('Message', messageSchema, 'messages');

module.exports = {
	model: Message,
	conversationTypes: MESSAGE_CONVERSATION_TYPES,
	messageTypes: MESSAGE_TYPES
}