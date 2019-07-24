import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";

/**
 * @param io from socket.io library
 */

let addNewContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on("add-new-contact", (data) => {
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
      };

      // emit notification (chi gui thong bao ve user nhan duoc loi moi ket ban)
      if (clients[data.contactId]) {
        // Khi mo 2 tab trinh duyet socketio se gui thong bao ve ca 2
      emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);
      }
      
    });

    socket.on("disconnect", () => {
      // Remove socketId when socket disconnect 
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });
  });
}

module.exports = addNewContact
