import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";

/**
 * @param io from socket.io library
 */

let chatAttachment= (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
	socket.request.user.chatGroupIds.forEach(group => {
		clients = pushSocketIdToArray(clients, group._id, socket.id);
	});

    socket.on("chat-attachment", (data) => {
      if (data.groupId) {
				let response = {
					currentGroupId: data.groupId,
					currentUserId: socket.request.user._id,
					message: data.message
				};
				// emit notification (chi gui thong bao ve user nhan duoc loi moi ket ban)
				if (clients[data.groupId]) {
					// Khi mo 2 tab trinh duyet socketio se gui thong bao ve ca 2
				emitNotifyToArray(clients, data.groupId, io, "response-chat-attachment", response);
				}
			}
			if (data.contactId) {
				let response = {
					currentUserId: socket.request.user._id,
					message: data.message
				};
				// emit notification (chi gui thong bao ve user nhan duoc loi moi ket ban)
				if (clients[data.contactId]) {
					// Khi mo 2 tab trinh duyet socketio se gui thong bao ve ca 2
				emitNotifyToArray(clients, data.contactId, io, "response-chat-attachment", response);
				}
			}
    });

    socket.on("disconnect", () => {
      // Remove socketId when socket disconnect 
	  clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
	  socket.request.user.chatGroupIds.forEach(group => {
		clients = removeSocketIdFromArray(clients, group._id, socket);
	});
    });
  });
};

module.exports = chatAttachment;
