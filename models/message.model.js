import mongoose from "mongoose";

var messageSchema = new mongoose.Schema({
	sender: {
		id: String,
		username: String,
		avatar: String
	},
	receiver: {
		id: String,
		username: String,
		avatar: String	
	},
	text: String, 
	file: { data: Buffer, contentType: String, fileName: String},
	createdAt: { type: Number, default: Date.now }, 
	updatedAt: { type: Number, default: null },
	deletedAt: { type: Number, default: null }
});

var Message = mongoose.model('Message', messageSchema, 'messages');

module.exports = Message