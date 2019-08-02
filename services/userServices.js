import userModel from "./../models/userModel";
//import { resolve } from "url";
//import { rejects } from "assert";
import { transErrors } from "./../lang/vi";
import bcrypt from "bcryptjs";

const saltRounds = 7;

/**
 * Update userInfo
 * @param {userId} id 
 * @param {data update} item 
 */

let updateUser = (id , item) => {
    return userModel.updateUser(id, item);
};

/**
 * Update password for user
 * @param {userId} id 
 * @param {data update} dataUpdate
 */
let updatePassword = (id, dataUpdate) => {
    return new Promise( async (resolve, rejects) => {
        let currentUser = await userModel.findUserByIdToUpdatePassword(id);
        if (!currentUser) {
            return rejects(transErrors.account_undefined);
        }

        let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
        if (!checkCurrentPassword) {
            return rejects(transErrors.user_current_password_failed);
        }

        let salt = bcrypt.genSaltSync(saltRounds);
        await userModel.updatePassword(id, bcrypt.hashSync(dataUpdate.newPassword, salt));
        resolve(true);
    });
}

module.exports = {
    updateUser: updateUser,
    updatePassword: updatePassword
};
