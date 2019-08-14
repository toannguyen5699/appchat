
function videoChat(divId) {
	$(`#video-chat-${divId}`).unbind("click").on("click", function() {
		let targetId = $(this).data("chat");
		let callerName = $("#navbar-username").text();

		let dataToEmit = {
			callerName: callerName,
			listenerId: targetId			
		};

		// Step 01: of caller
		socket.emit("caller-check-listener-online-or-not", dataToEmit);
	});
}

function playVideoStream(videoTagId, stream) {
	let video = document.getElementById(videoTagId);
	video.srcObject = stream;
	video.onloadeddata = function () {
		video.play();
	};
}

function closeVideoStream(stream) {
	return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function() {
	// Step 02 of caller
	socket.on("server-send-listener-is-offline", function() {
		alertify.notify("Nguoi dung dang vang mat vui long lien he lai sau", "error", 7);
	});

	let iceServerList = $("#ice-server-list").val();
	console.log(iceServerList);
	console.log(typeof iceServerList);

	let getPeerId = "";
	const peer = new Peer({
		key: "peerjs",
		host: "peerjs-server-trungquandev.herokuapp.com",
		secure: true,
		port: 443,
		config: {"iceServers": JSON.parse(iceServerList)}
		//debug: 3
	});
	console.log(peer);
	peer.on("open", function(peerId) {
		getPeerId = peerId;
	})
	// Step 03 of listener
	socket.on("server-request-peer-id-of-listener", function(response) {
		let listenerName = $("#navbar-username").text();
		let dataToEmit = {
			callerId: response.callerId,
			listenerId: response.listenerId,
			callerName: response.callerName,
			listenerName: listenerName,
			listenerPeerId: getPeerId
		};

		// Step 04 of listener
		socket.emit("listener-emit-peer-id-to-server",dataToEmit);
	});
	let timerInterval;
	// Step 05 of caller
	socket.on("server-send-peer-id-of-listener-to-caller", function(response) {
		let dataToEmit = {
			callerId: response.callerId,
			listenerId: response.listenerId,
			callerName: response.callerName,
			listenerName: response.listenerName,
			listenerPeerId: response.listenerPeerId
		};

	// Step 06 of caller
	socket.emit("caller-request-call-to-server", dataToEmit);

    Swal.fire({
        title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone><i>`,
		html: `
			Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/> <br/>
			<button id="btn-cancel-call" class="btn btn-danger">
				Hủy cuộc gọi
			</button>
		`,
		backdrop: "rgba(85, 85, 85, 0.4)",
		width: "52rem",
		allowOutsideClick: false,
        timer: 30000, // 30 giay
        onBeforeOpen: () => {
			$("#btn-cancel-call").unbind("click").on("click", function() {
				// Step 07 of caller
				socket.emit("caller-cancel-request-call-to-server", dataToEmit);				
				Swal.close();
				clearInterval(timerInterval);
			});

			if (Swal.getContent().querySelector !== null) {
				Swal.showLoading();
            	timerInterval = setInterval(() => {
                	Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            	},1000);
			}
		},
		onOpen: () => {
			// Step 12 of caller
			socket.on("server-send-reject-call-to-caller", function(response) {
				Swal.close();
				clearInterval(timerInterval);

				Swal.fire({
					type: "info",
					title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; Hiện tại không thể nghe máy`,
					backdrop: "rgba(85, 85, 85, 0.4)",
					width: "52rem",
					allowOutsideClick: false,
					confirmButtonColor: "#2ECC71",
					confirmButtonText: "Xác nhận",
				});
			});
		},
        onClose: () => {
            clearInterval(timerInterval);
        }
      }).then((result) => {
			return false;
        });
	  });
	  
	// Step 08 of listener
	socket.on("server-send-request-call-to-listener", function(response) {
		let dataToEmit = {
			callerId: response.callerId,
			listenerId: response.listenerId,
			callerName: response.callerName,
			listenerName: response.listenerName,
			listenerPeerId: response.listenerPeerId
		};
		Swal.fire({
			title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; Cuộc gọi đến <i class="fa fa-volume-control-phone><i>`,
			html: `
				Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/> <br/>
				<button id="btn-accept-call" class="btn btn-success">
					Đồng ý
				</button>
				<button id="btn-reject-call" class="btn btn-danger">
					Từ chối 
				</button>
			`,
			backdrop: "rgba(85, 85, 85, 0.4)",
			width: "52rem",
			allowOutsideClick: false,
			timer: 30000, // 30 giay
			onBeforeOpen: () => {
				$("#btn-reject-call").unbind("click").on("click", function() {
					Swal.close();
					clearInterval(timerInterval);

					// Step 10 of listener
					socket.emit("listener-reject-request-call-to-server", dataToEmit);
				});

				$("#btn-accept-call").unbind("click").on("click", function() {
					Swal.close();
					clearInterval(timerInterval);

					// Step 11 of listener
					socket.emit("listener-accept-request-call-to-server", dataToEmit);
				});

				if (Swal.getContent().querySelector !== null) {
					Swal.showLoading();
					timerInterval = setInterval(() => {
						Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
					},1000);
				}
			},
			onOpen: () => {
				// Step 09 of listener
				socket.on("server-send-cancel-request-call-to-listener", function(response) {
					Swal.close();
					clearInterval(timerInterval);
				});
			},
			onClose: () => {
				clearInterval(timerInterval);
			}
		}).then((result) => {
				return false;
		});
	});
	// Step 13 of caller
	socket.on("server-send-accept-call-to-caller", function(response) {
		Swal.close();
		clearInterval(timerInterval);

		let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
		
		getUserMedia({video: true, audio: true}, function(stream) {
			// Show modal streaming
			$("#streamModal").modal("show");

			// Play my stream in local (of caller)
			playVideoStream("local-stream", stream);

			// call to listener
			let call = peer.call(response.listenerPeerId, stream);

			// listen & play stream of listener
			call.on("stream", function(remoteStream) {
			  
			// Play stream of listener
			playVideoStream("remote-stream", remoteStream);
				
			});

			// Close modal: remove stream
			$("#streamModal").on("hidden.bs.modal", function() {
				closeVideoStream(stream);
				Swal.fire({
					type: "info",
					title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> `,
					backdrop: "rgba(85, 85, 85, 0.4)",
					width: "52rem",
					allowOutsideClick: false,
					confirmButtonColor: "#2ECC71",
					confirmButtonText: "Xác nhận",
				});
			});
		  }, function(err) {
			console.log("Failed to get local stream" ,err.toString());
			if (err.toString() === "NotAllowedError: Permission denied") {
				alertify.notify("Xin loi thiet bi cua ban khong ho tro camera","error",7);
			}
			if (err.toString() === "NotFoundError: Requested device not found") {
				alertify.notify("Xin loi thiet bi cua ban khong ho tro camera","error",7);
			}
		  });
	});

	// Step 14 of listener
	socket.on("server-send-accept-call-to-listener", function(response) {
		Swal.close();
		clearInterval(timerInterval);

		let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

		peer.on("call", function(call) {
			getUserMedia({video: true, audio: true}, function(stream) {
				// Show modal streaming
				$("#streamModal").modal("show");

				// Play my stream in local (of listener)
				playVideoStream("local-stream", stream);

				call.answer(stream); // Answer the call with an A/V stream.
				  
			  	call.on("stream", function(remoteStream) {
				
				// Play stream of caller
				playVideoStream("remote-stream", remoteStream)
				});
				// Close modal: remove stream
				$("#streamModal").on("hidden.bs.modal", function() {
					closeVideoStream(stream);
					Swal.fire({
						type: "info",
						title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.callerName}</span> `,
						backdrop: "rgba(85, 85, 85, 0.4)",
						width: "52rem",
						allowOutsideClick: false,
						confirmButtonColor: "#2ECC71",
						confirmButtonText: "Xác nhận",
					});
				}); 
			}, function(err) {
				console.log("Failed to get local stream" ,err.toString());
				if (err.toString() === "NotAllowedError: Permission denied") {
					alertify.notify("Xin loi thiet bi cua ban khong ho tro camera","error",7);
				}
				if (err.toString() === "NotFoundError: Requested device not found") {
					alertify.notify("Xin loi thiet bi cua ban khong ho tro camera","error",7);
				}
			});
		});
	});
});