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
	}
}

var Contact = mongoose.model('Contact', contactSchema, 'contacts');

module.exports = Contact;