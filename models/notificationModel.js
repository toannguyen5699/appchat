import mongoose from "mongoose";

var notificationSchema = new mongoose.Schema({
	senderId: String,
	receiverId: String,
	type: String,
	isRead: {type: Boolean, default: false},
	createdAt: { type: Number, default: Date.now } 

});

notificationSchema.statics = {
	createNew(item) {
		return this.create(item);
	},

	removeRequestContactNotification(senderId, receiverId, type) {
		return this.deleteOne({
			$and: [
				{"senderId": senderId},
				{"receiverId": receiverId},
				{"type": type}
			]
		}).exec();
	},

	/**
	 * Get by userId and limit
	 * @param {string} userId 
	 * @param {number} limit 
	 */
	getByUserIdAndLimit(userId, limit) {
		return this.find({
			"receiverId": userId
		}).sort({"createAt": -1}).limit(limit).exec();
	},

	/**
	 * Count all notifications unread
	 * @param {string} userId 
	 */
	countNotifUnread(userId) {
		return this.countDocuments({
			$and: [
				{"receiverId": userId},
				{"isRead": false}
			]
		}).exec();
	}
}

const NOTIFICATION_TYPES = {
	ADD_CONTACT: "add_contact"
};

const NOTIFICATION_CONTENTS = {
	getContent: (notificationType, isRead, userId, username, userAvatar) => {
		if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
			if (!isRead) {
				return `<div class="notif-readed-false" data-uid="${userId}">
							<img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
							<strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
						</div>`;		
			}
			return `<div data-uid="${userId}">
						<img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
						<strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
					</div>`;
			}
			return "No matching with any notification type";
		}
}

var Notification = mongoose.model('Notification', notificationSchema, 'notifications');

module.exports = {
	model: Notification,
	types: NOTIFICATION_TYPES,
	contents: NOTIFICATION_CONTENTS
}