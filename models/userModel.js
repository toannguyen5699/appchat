import mongoose from "mongoose";
import bcrypt from "bcryptjs";

var userSchema = new mongoose.Schema({
	username: String,
	gender: { type: String, default: "male" },
	phone: { type: String, default: null },
	address: { type: String, default: null },
	avatar:{ type: String, default: "avatar-default.jpg" },
	role: { type: String, default: "user" },
	local: {
		email: { type: String, trim:true },
		password: String,
		isActive: { type: Boolean, default: false},
		verifyToken: String
	},
	facebook: {
		uid: String,
		token: String,
		email: { type: String, trim:true }
	},
	google: {
		uid: String,
		token: String,
		email: { type: String, trim:true }
	},
	createdAt: { type: Number, default: Date.now }, 
	updatedAt: { type: Number, default: null },
	deletedAt: { type: Number, default: null }
});

userSchema.statics = {
	createNew(item) {
		return this.create(item);
	},

	findByEmail(email) {
		return this.findOne({"local.email": email}).exec();
	},

	removeById(id) {
		return this.findByIdAndRemove(id).exec();
	},

	findByToken(token) {
		return this.findOne({"local.verifyToken": token}).exec();
	},

	verify(token) {
		return this.findOneAndUpdate(
			{"local.verifyToken": token},
			{"local.isActive": true, "local.verifyToken": null}
			).exec();
	},
	
	findUserByIdToUpdatePassword(id) {
		return this.findById(id).exec();
	},

	findUserByIdForSessionToUse(id) {
		return this.findById(id, {"local.password": 0}).exec();
	},

	findByFacebookUid(uid) {
		return this.findOne({"facebook.uid": uid}).exec();
	},

	findByGoogleUid(uid) {
		return this.findOne({"google.uid": uid}).exec();
	},

	updateUser(id, item) {
		return this.findByIdAndUpdate(id, item).exec();
	},

	updatePassword(id, hashesPassword) {
		return this.findByIdAndUpdate(id, {"local.password": hashesPassword}).exec();
	},

	/**
	 * Find all users for add contact
	 * @param {array: deprecated userIds} deprecatedUserIds 
	 * @param {string: keyword search} keyword 
	 */
	findAllForAddContact(deprecatedUserIds, keyword) {
		return this.find({
			$and: [
				{"_id": {$nin: deprecatedUserIds}}, // tim nhung id khong thuoc mang deprecatedUserIds
				{"local.isActive": true}, // tim nhuwng tai khoan da kich hoat bang gmail
				{$or: [
					{"username": {"$regex": new RegExp(keyword, "i") }}, // timf phan tu gan giong nhat voi keyword minh nhap (ko phan biet chu hoa chu thuong bang RegExp)
					{"local.email": {"$regex": new RegExp(keyword, "i")  }},
					{"facebook.email": {"$regex": new RegExp(keyword, "i")  }},
					{"google.email": {"$regex": new RegExp(keyword, "i")  }}
				]}
			]
		}, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
	},

	getNormalUserDataById(id) {
		return this.findById(id, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
	},
};

userSchema.methods = {
	comparePassword(password) {
		return bcrypt.compare(password, this.local.password); // return a promise has result is true or false

	}
}

var User = mongoose.model('User', userSchema, 'users');

module.exports = User
