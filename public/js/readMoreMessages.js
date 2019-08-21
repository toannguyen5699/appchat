function readMoreMessages() {
  $(".right .chat").scroll(function() {

	// Get the first message
	let firstMessage = $(this).find(".bubble:first");

	// Get position of first message
	let currentOffSet = firstMessage.offset().top - $(this).scrollTop();

	if ($(this).scrollTop() === 0 ) {
		let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
		$(this).prepend(messageLoading);

		let targetId = $(this).data("chat");
		let skipMessage = $(this).find("div.bubble").length;
		let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

		let thisDom =$(this);

		$.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
			if (data.rightSideData.trim() === "") {
				alertify.notify("Ban khong con tin nhan nao ", "error", 4);
				thisDom.find("img.message-loading").remove();

				return false;
				}

				// Step 01: handle rightSide
				$(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);

				// Step 02: prevent Scroll
				$(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffSet);

				// Step 03: convert emoji
				convertEmoji();

				// Step 04: handle imageModal
				$(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

				// Step 05: 
				gridPhotos(5);

				// Step 06: handle attachmentModal
				$(`attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);
		
				// Step 07: remove message loading
				thisDom.find("img.message-loading").remove();
			});
		}	
	});
}

$(document).ready(function() {
	readMoreMessages();
})