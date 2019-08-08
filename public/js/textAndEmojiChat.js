
function textAndEmojiChat(divId) {
  $(".emojionearea").unbind("keyup").on("keyup", function(element) {
	  	let currentEmojioneArea = $(this)
		if (element.which === 13) {
			let targetId = $(`#write-chat-${divId}`).data("chat");
			let messageVal = $(`#write-chat-${divId}`).val();

			if (!targetId.length || !messageVal.length) {
				return false;
			}

			let dataTextEmojiForSend = {
				uid: targetId,
				messageVal: messageVal
			};

			if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
				dataTextEmojiForSend.isChatGroup = true;
			}

			// call send message
			$.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data) {
				let dataToEmit = {
					message: data.message
				};
				// step 01: handle message data to before show
				let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
				messageOfMe.text(data.message.text);
				let convertEmojiMessage = emojione.toImage(messageOfMe.html());

				if (dataTextEmojiForSend.isChatGroup) {
					let senderAvatar= `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
					messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
					
					increaseNumberMessageGroup(divId);
					dataToEmit.groupId = targetId;
				} else {
					messageOfMe.html(convertEmojiMessage);
					dataToEmit.contactId = targetId;
				}
				

				// step 02: append message data to screen
				$(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
				nineScrollRight(divId);

				// step 03: remove all data at input
				$(`#write-chat-${divId}`).val("");
				currentEmojioneArea.find(".emojionearea-editor").text("");

				// step 04: change data preview & time in left-side
				$(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

				// step 05: Move conversation to the top
				$(`.person[data-chat=${divId}]`).on("events.moveConversationToTheTop", function() {
					let dataToMove = $(this).parent();
					$(this).closest("ul").prepend(dataToMove);
					$(this).off("events.moveConversationToTheTop");
				});
				$(`.person[data-chat=${divId}]`).trigger("events.moveConversationToTheTop"); 

				// step 06: Emit real-time
				socket.emit("chat-text-emoji", dataToEmit);

			}).fail(function (response) {
				alertify.notify(response.responseText, "error", 7);
			});
		}
	});
}

$(document).ready(function () {
	socket.on("response-chat-text-emoji", function(response) {
		console.log(response);
		let divId = "";
		// step 01: handle message data to before show
		let messageOfYou = $(`<div class="bubble you data-mess-id="${response.message._id}"></div>`);
		messageOfYou.text(response.message.text);
		let convertEmojiMessage = emojione.toImage(messageOfYou.html());

		if (response.currentGroupId) {
			let senderAvatar= `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
			messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

			divId = response.currentGroupId;
			if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
			increaseNumberMessageGroup(divId);
			}
			
		} else {
			messageOfYou.html(convertEmojiMessage);

			divId = response.currentUserId;
		}

		console.log(response.currentUserId);
		console.log($("#dropdown-navbar-user").data("uid"));
		// step 02: append message data to screen
		if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
			$(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
			nineScrollRight(divId);
			$(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
		}
		

		// step 03: remove all data at input: ko the lam 

		// step 04: change data preview & time in left-side
		$(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
		$(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));
	
		// step 05: Move conversation to the top
		$(`.person[data-chat=${divId}]`).on("events.moveConversationToTheTop", function() {
			let dataToMove = $(this).parent();
			$(this).closest("ul").prepend(dataToMove);
			$(this).off("events.moveConversationToTheTop");
		});
		$(`.person[data-chat=${divId}]`).trigger("events.moveConversationToTheTop"); 

		// step 06: Emit real-time : ko lam duoc 
	});
});