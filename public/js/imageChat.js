function bufferToBase64(buffer) {
	return btoa(
		new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
};


function imageChat(divId) {
  $(`#image-chat-${divId}`).unbind("change").on("change", function() {
		let fileData = $(this).prop("files")[0];
		let math = ["image/png", "image/jpg", "image/jpeg"];
		let limit = 1048576; // byte = 1mb

		if($.inArray(fileData.type, math) === -1 ) {
				alertify.notify("Type File Error (Only accept png,jpg,jpeg)", "error", 7);
				$(this).val(null);
				return false;
		}

		if(fileData.size > limit ) {
				alertify.notify("upload img max stogare is 1MB ", "error", 7);
				$(this).val(null);
				return false;
		}

		let targetId = $(this).data("chat");
		let isChatGroup = false;

		let messageformData = new FormData();
		messageformData.append("my-image-chat", fileData);
		messageformData.append("uid", targetId);

		if ($(this).hasClass("chat-in-group")) {
			messageformData.append("isChatGroup", true);
			isChatGroup = true;
		}

		$.ajax({
			url: "/message/add-new-image",
			type: "post",
			cache: false,
			contentType: false,
			processData: false,
			data: messageformData,
			success: function(data) {
				
				let dataToEmit = {
					message: data.message
				};

				// step 01: handle message data to before show
				let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
				let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;

				if (isChatGroup) {
					let senderAvatar= `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
					messageOfMe.html(`${senderAvatar} ${imageChat}`);
					
					increaseNumberMessageGroup(divId);
					dataToEmit.groupId = targetId;
				} else {
					messageOfMe.html(imageChat);

					dataToEmit.contactId = targetId;
				}

				// step 02: append message data to screen
				$(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
				nineScrollRight(divId);

				// step 03: remove all data at input: khong lam

				// step 04: change data preview & time in left-side
				$(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$(`.person[data-chat=${divId}]`).find("span.preview").html("Hinh ảnh...");

				// step 05: Move conversation to the top
				$(`.person[data-chat=${divId}]`).on("events.moveConversationToTheTop", function() {
					let dataToMove = $(this).parent();
					$(this).closest("ul").prepend(dataToMove);
					$(this).off("events.moveConversationToTheTop");
				});
				$(`.person[data-chat=${divId}]`).trigger("events.moveConversationToTheTop"); 

				// step 06: Emit real-time
				socket.emit("chat-image", dataToEmit);

				// Step 07: Emit remove typing real-time: ko lam
				// Step 08: If this has typing, remove that immediate: ko lam

				// Step 09: Add to modal image 
				let imageChatToAddModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">`
				$(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
			},
			error: function(error) {
				alertify.notify(error.responseText, "error", 7);
			},
			
	});
  });
}

$(document).ready(function () {
	socket.on("response-chat-image", function(response) {
		let divId = "";

		// step 01: handle message data to before show
		let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
		let imageChat = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat">`;

		if (response.currentGroupId) {
			let senderAvatar= `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
			messageOfYou.html(`${senderAvatar} ${imageChat}`);

			divId = response.currentGroupId;

			if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
			increaseNumberMessageGroup(divId);
			}
			
		} else {
			messageOfYou.html(imageChat);

			divId = response.currentUserId;
		}

		// step 02: append message data to screen
		if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
			$(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
			nineScrollRight(divId);
			$(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
		}

		// step 03: remove all data at input: ko the lam 

		// step 04: change data preview & time in left-side
		$(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
		$(`.person[data-chat=${divId}]`).find("span.preview").html("Hinh anh...");
	
		// step 05: Move conversation to the top
		$(`.person[data-chat=${divId}]`).on("events.moveConversationToTheTop", function() {
			let dataToMove = $(this).parent();
			$(this).closest("ul").prepend(dataToMove);
			$(this).off("events.moveConversationToTheTop");
		});
		$(`.person[data-chat=${divId}]`).trigger("events.moveConversationToTheTop");
	
		// Step 07: Emit remove typing real-time: ko lam
		// Step 08: If this has typing, remove that immediate: ko lam

		// Step 09: Add to modal image 
		if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
			let imageChatToAddModal = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}">`
			$(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
		}
	});
});