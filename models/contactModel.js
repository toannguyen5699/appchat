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
	 * xoa di loi gui ket ban
	 * @param {string} userId 
	 * @param {string} contactId 
	 */
	removeRequestContact(userId, contactId) {
		return this.deleteOne({
			$and: [
				{"userId": userId},
				{"contactId": contactId}
			]
		}).exec();
	}
};

var Contact = mongoose.model('Contact', contactSchema, 'contacts');

module.exports = Contact;