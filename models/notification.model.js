import mongoose from "mongoose";

var notificationSchema = new mongoose.Schema({
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
	type: String, 
	content: String,
	isRead: {typr: Boolean, default: false},
	createdAt: { type: Number, default: Date.now } 

});

var Notification = mongoose.model('Notification', notificationSchema, 'notifications');

module.exports = Notification