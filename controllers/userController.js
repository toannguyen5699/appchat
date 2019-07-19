import multer from "multer";
import {app} from "./../config/app";
import {transErrors, transSuccess} from "./../lang/vi";
import uuidv4 from "uuid/v4";
import {user} from "./../services/index";
import fsExtra from "fs-extra";
import {validationResult} from "express-validator/check";

// noi luu tru file anh

let storageAvatar = multer.diskStorage({ 
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory);
    },
    filename: (req, file, callback) => {
        let math = app.avatar_type;
        if (math.indexOf(file.mimetype) === -1) {
            return callback(transErrors.avatar_type, null)
        }
        
        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        callback(null, avatarName);
    }
});

// upload avatar
let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: {fileSize: app.avatar_limit_size}
}).single("avatar");

// ghi avatar user vao du lieu
let updateAvatar = (req,res) => {
    avatarUploadFile(req, res, async (error) => {
        if (error) {
            if(error.message) {
                return res.status(500).send(transErrors.avatar_size);
            }
            return res.status(500).send(error);
        }
        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now()
            };

            // update user 
            let userUpdate = await user.updateUser(req.user._id, updateUserItem);

            // remove old user avatar
           // await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);

            let result = {
                message: transSuccess.user_info_updated,
                imageSrc: `/images/users/${req.file.filename}`
            }
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send(result);
        }
    });
}

// ghi info user vao du lieu
let updateInfo = async (req,res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);
    
	if(!validationErrors.isEmpty()) {
		let errors = Object.values(validationErrors.mapped());
		errors.forEach(item => {
			errorArr.push(item.msg);
		});
		return res.status(500).send(errorArr);
	}
 try {
     let updateUserItem = req.body;
     await user.updateUser(req.user._id, updateUserItem);
     let result = {
        message: transSuccess.user_info_updated,
    }
    return res.status(200).send(result);

 } catch (error) {
    console.log(error);
    return res.status(500).send(result);
 }
}

module.exports = {
    updateAvatar: updateAvatar,
    updateInfo: updateInfo
};
