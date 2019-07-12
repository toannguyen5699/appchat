import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
	username: String,
	gender: { type: String, default: "male" },
	phone: { type: Number, default: null },
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
	}
};

var User = mongoose.model('User', userSchema, 'users');

module.exports = User
