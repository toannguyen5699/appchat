
function removeRequestContactReceived() {
    $(".user-remove-request-contact-received").unbind("click").on("click", function() {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: "delete",
            data: {uid: targetId},
            success: function(data) {
                if (data.success) {
                    // chuc nang nay chua lam
                   // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); // popup notification
                   // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); //
                   // decreaseNumberNotification("noti_counter", 1); // js/caculateNotification.js
                   
                    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
                    
                    decreaseNumberNotifContact("count-request-contact-received"); // js/caculateNotifContact.js

                    // Xoa o modal tab yeu cau ket ban
                    $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact-received", {contactId: targetId});
                }
            }
        });
    });
}


socket.on("response-remove-request-contact-received", function(user) {
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");
    
    // Xoa o modal tab dang cho xac nhan
    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifContact("count-request-contact-sent"); // js/caculateNotifContact.js

    decreaseNumberNotification("noti_contact_counter", 1); // js/caculateNotification.js
    
});

$(document).ready(function() {
    removeRequestContactReceived();
})
