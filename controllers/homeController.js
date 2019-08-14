import {notification, contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper";
import request from "request";

let getICETurnServer = () => {
	return new Promise(async (resolve, reject) => {
		// Node Get ICE STUN and TURN list
		let o = {
			format: "urls"
		};

		let bodyString = JSON.stringify(o);

		let options = {
			url: "https://global.xirsys.net/_turn/app-chat",
			// host: "global.xirsys.net",
			// path: "/_turn/app-chat",
			method: "PUT",
			headers: {
				"Authorization": "Basic " + Buffer.from("toannguyen050699:548ff586-bd6a-11e9-b43a-0242ac110007").toString("base64"),
				"Content-Type": "application/json",
				"Content-Length": bodyString.length
			}
		};

		// Call a request to get ICE list of turn server
		request(options, (error, response, body) => {
			if (error) {
				console.log("error when get ICR list: " + error);
				return reject(error);
			}
			let bodyJson = JSON.parse(body);
			resolve(bodyJson.v.iceServers);		
		});	
	});
}

let getHome = async (req, res) => {
	// only (10 items one time)
	let notifications = await notification.getNotifications(req.user._id);
	// get amount notifications unread
	let countNotifUnread = await notification.countNotifUnread(req.user._id);

	// get contacts (10 item one time)
	let contacts = await contact.getContacts(req.user._id);
	// get contacts sent (10 item one time)
	let contactsSent = await contact.getContactsSent(req.user._id);
	// get contacts received (10 item one time)
	let contactsReceived = await contact.getContactsReceived(req.user._id);

	// count contacts
	let countAllContacts = await contact.countAllContacts(req.user._id);
	let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
	let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);


	let getAllConversationItems = await message.getAllConversationItems(req.user._id);
	// all messages with conversation, max 30 item 
	let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

	// get ICE list from xirsys turn server
	let iceServerList = await getICETurnServer();

	return res.render("main/home/home", {
		errors: req.flash("errors"),
		success: req.flash("success"),
		user: req.user,
		notifications: notifications,
		countNotifUnread: countNotifUnread,
		contacts: contacts,
		contactsSent: contactsSent,
		contactsReceived: contactsReceived,
		countAllContacts: countAllContacts,
		countAllContactsSent: countAllContactsSent,
		countAllContactsReceived: countAllContactsReceived,
		allConversationWithMessages: allConversationWithMessages,
		bufferToBase64: bufferToBase64,
		lastItemOfArray: lastItemOfArray,
		convertTimestampToHumanTime: convertTimestampToHumanTime,
		iceServerList: JSON.stringify(iceServerList)
	});
};

module.exports = { 
	getHome: getHome
};