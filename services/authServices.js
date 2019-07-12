import userModel from "./../models/userModel";
import bcrypt from "bcryptjs"; // create pass stronger
import uuidv4  from "uuid/v4";
import {transErrors, transSuccess, transMail} from "./../lang/vi";
import sendMail from "./../config/mailer";
//import { rejects } from "assert";

let saltRounds = 7;


let register = (email, gender, password, protocol, host) => {
    return new Promise(async (resolve, rejects) => {
        let userByEmail = await userModel.findByEmail(email);
    if (userByEmail) {
        if (userByEmail.deleteAt != null) {
            return rejects(transErrors.account_removed);
        }
        if (!userByEmail.local.isActive) {
            return rejects(transErrors.account_not_active);
        }
        return rejects(transErrors.account_in_use);
    }
    let salt = bcrypt.genSaltSync(saltRounds);
    let userItem = {
        username: email.split("@")[0],
        gender: gender,
        local: {
            email: email,
            password: bcrypt.hashSync(password, salt),
            verifyToken: uuidv4()
        }
    };
    let user = await userModel.createNew(userItem);
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    // send email
    sendMail(email, transMail.subject, transMail.template(linkVerify))
        .then(success => {
            resolve(transSuccess.userCreated(user.local.email));
        })
        .catch(async (error) => {
            // remove user
            await userModel.removeById(user._id);
            console.log(error);
            rejects(transMail.send_failed);
        })
    resolve(transSuccess.userCreated(user.local.email));
    });
};

let verifyAccount = (token) => {
    return new Promise(async (resolve, rejects) => {
        let userByToken = await userModel.findByToken(token);
        if (!userByToken) {
            return rejects(transErrors.token_undefined);
        }
        await userModel.verify(token);
        resolve(transSuccess.account_actived);
    });
}

module.exports = {
    register: register,
    verifyAccount: verifyAccount
};
