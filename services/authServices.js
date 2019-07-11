import userModel from "./../models/userModel";
import bcrypt from "bcryptjs"; // create pass stronger
import uuidv4  from "uuid/v4";
import {transErrors} from "./../lang/vi";
//import { rejects } from "assert";

let saltRounds = 7;


let register = (email, gender, password) => {
    return new Promise(async (resolve, rejects) => {
        let userByEmail = await userModel.findByEmail(email);
    if (userByEmail) {
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
    resolve(user);
    });
};

module.exports = {
    register: register
};