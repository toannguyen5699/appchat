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

		let messageformData = new FormData();
		messageformData.append("my-image-chat", fileData);
		messageformData.append("uid", targetId);

		if ($(this).hasClass("chat-in-group")) {
			messageformData.append("isChatGroup", targetId);
		}

		$.ajax({
			url: "/message/add-new-image",
			type: "post",
			cache: false,
			contentType: false,
			processData: false,
			data: messageformData,
			success: function(data) {
				console.log(data)
			},
			error: function(error) {
				alertify.notify(error.responseText, "error", 7);
			},
			
	});
  });
}