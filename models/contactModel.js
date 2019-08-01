import mongoose from "mongoose";

var contactSchema = new mongoose.Schema({
	userId: String,
	contactId: String,
	status: {type: Boolean, default: false},
	createdAt: { type: Number, default: Date.now }, 
	updatedAt: { type: Number, default: null },
	deletedAt: { type: Number, default: null }
});

contactSchema.statics = {
	createNew(item) {
		return this.create(item);
	},

	/**
	 * Find all items that related with user
	 * @param {string} userId 
	 */
	findAllByUser(userId) {
		return this.find({
			$or: [
				{"userId": userId},
				{"contactId": userId}
			]
		}).exec();
	},

	/**
	 * Kiem tra su ton tai cua user co trong contact hay chua
	 * @param {string} userId 
	 * @param {string} contactId 
	 */
	checkExists(userId, contactId) {
		return this.findOne({
			$or: [
				{$and: [
					{"userId": userId},
					{"contactId": contactId}
				]},
				{$and: [
					{"userId": contactId},
					{"contactId": userId}
				]}
			]
		}).exec();
	},

	/**
	 * 
	 * @param {string} userId 
	 * @param {string} contactId 
	 */
	removeContact(userId, contactId) {
		return this.deleteOne({
			$or: [
				{$and: [
					{"userId": userId},
					{"contactId": contactId},
					{"status": true}
				]},
				{$and: [
					{"userId": contactId},
					{"contactId": userId},
					{"status": true}
				]}
			]
		}).exec();
	},

	/**
	 * xoa di loi gui ket ban
	 * @param {string} userId 
	 * @param {string} contactId 
	 */
	removeRequestContactSent(userId, contactId) {
		return this.deleteOne({
			$and: [
				{"userId": userId},
				{"contactId": contactId},
				{"status": false}
			]
		}).exec();
	},

	/**
	* xoa di loi moi ket ban
	* @param {string} userId 
	* @param {string} contactId 
	*/
	removeRequestContactReceived(userId, contactId) {
		return this.deleteOne({
			$and: [
				{"contactId": userId},
				{"userId": contactId},
				{"status": false}
			]
		}).exec();
	},

	/**
	* chap nhan loi moi ket ban
	* @param {string} userId 
	* @param {string} contactId 
	*/
	approveRequestContactReceived(userId, contactId) {
		return this.updateOne({
			$and: [
				{"contactId": userId},
				{"userId": contactId},
				{"status": false}
			]
		}, {
			"status": true,
			"updatedAt": Date.now()
		}).exec();
	},

	/**
	 * Get contacts by userId and limit
	 * @param {string} userId 
	 * @param {number} limit 
	 */
	getContacts(userId, limit) {
		return this.find({
			$and: [
				{$or: [
					{"userId": userId},
					{"contactId": userId}
				]},
				{"status": true}
			]
		}).sort({"updatedAt": -1}).limit(limit).exec();
	},

	/**
	 * Get contacts sent by userId and limit
	 * @param {string} userId 
	 * @param {number} limit 
	 */
	getContactsSent(userId, limit) {
		return this.find({
			$and: [
				{"userId": userId},
				{"status": false}
			]
		}).sort({"createdAt": -1}).limit(limit).exec();
	},

	/**
	 * Get contacts received by userId and limit
	 * @param {string} userId 
	 * @param {number} limit 
	 */
	getContactsReceived(userId, limit) {
		return this.find({
			$and: [
				{"contactId": userId},
				{"status": false}
			]
		}).sort({"createdAt": -1}).limit(limit).exec();
	},

	/**
	 * Count all contacts by userId and limit
	 * @param {string} userId 
	 */
	countAllContacts(userId) {
		return this.countDocuments({
			$and: [
				{$or: [
					{"userId": userId},
					{"contactId": userId}
				]},
				{"status": true}
			]
		}).exec();
	},

	/**
	 * Count all contacts sent by userId and limit
	 * @param {string} userId  
	 */
	countAllContactsSent(userId) {
		return this.countDocuments({
			$and: [
				{"userId": userId},
				{"status": false}
			]
		}).exec();
	},

	/**
	 * Count all contacts received by userId and limit
	 * @param {string} userId 
	 */
	countAllContactsReceived(userId) {
		return this.countDocuments({
			$and: [
				{"contactId": userId},
				{"status": false}
			]
		}).exec();
	},

	readMoreContacts(userId, skip, limit) {
		return this.find({
			$and: [
				{$or: [
					{"userId": userId},
					{"contactId": userId}
				]},
				{"status": true}
			]
		}).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
	},

	readMoreContactsSent(userId, skip, limit) {
		return this.find({
			$and: [
				{"userId": userId},
				{"status": false}
			]
		}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
	},

	readMoreContactsReceived(userId, skip, limit) {
		return this.find({
			$and: [
				{"contactId": userId},
				{"status": false}
			]
		}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
	},
};

var Contact = mongoose.model('Contact', contactSchema, 'contacts');

module.exports = Contact;