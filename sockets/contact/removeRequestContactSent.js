import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";

/**
 * @param io from socket.io library
 */

let removeRequestContactSent = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        // push socket id to array
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on("remove-request-contact-sent", (data) => {
        let currentUser = {
          id: socket.request.user._id
        };
        // emit notification (chi gui thong bao ve user nhan duoc loi moi ket ban)
        if (clients[data.contactId]) {
          // Khi mo 2 tab trinh duyet socketio se gui thong bao ve ca 2
        emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact-sent", currentUser);
        }
        
    });
  
    socket.on("disconnect", () => {
        // Remove socketId when socket disconnect 
        clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
    });
}
  
  module.exports = removeRequestContactSent;
  