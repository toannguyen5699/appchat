import passport from "passport";
import passportGoogle from "passport-google-oauth";
import userModel from "./../../models/userModel";
import chatGroupModel from "./../../models/chatGroupModel";
import {transErrors, transSuccess} from "./../../lang/vi";

let googleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;


/**
 * Valid user account type: Google
 */

let initPassportGoogle = () => {
    passport.use(new googleStrategy({
        clientID: ggAppId,
        clientSecret: ggAppSecret,
        callbackURL: ggCallbackUrl,
        passReqToCallback: true,
       // profileFields: ["email", "gender", "displayName"]
    },async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findByGoogleUid(profile.id);
            if (user) {
                return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
            }

            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {
                    isActive: true
                },
                google: {
                    uid: profile.id,
		            token: accessToken,
		            email: profile.emails[0].value
                }
            };
            let newUser = await userModel.createNew(newUserItem)
            return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)));
        } catch (error) {
            console.log(error);
            return done(null,false, req.flash("errors", transErrors.server_error));
        }
    }));

    // Save userId to session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // this is called by passport.session()
    // return userInfo to req user
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findUserByIdForSessionToUse(id);
            let getChatGroupIds = await chatGroupModel.getChatGroupIdsByUser(user._id);

            user = user.toObject();
            user.chatGroupIds = getChatGroupIds;
            return done(null, user);

        } catch (error) {
            return done(error, null);
        }
    })
};

module.exports = initPassportGoogle;