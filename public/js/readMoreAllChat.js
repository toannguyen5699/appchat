$(document).ready(function() {
    $("#link-read-more-all-chat").bind("click", function() {
          let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
          let skipGroup = $("#all-chat").find("li.group-chat").length;

          $("#link-read-more-all-chat").css("display", "none");
          $(".read-more-all-chat-loader").css("display", "inline-block");
  
          $.get(`/message/read-more-all-chat/?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
              if (data.leftSideData.trim() === "") {
                alertify.notify("Ban khong con cuoc tro chuyen nao ", "error", 7);
                  $("#link-read-more-all-chat").css("display", "inline-block");
                  $(".read-more-all-chat-loader").css("display", "none");

                  return false;
              }

              // Step 01: handle leftSide
              $("#all-chat").find("ul").append(data.leftSideData);

              // Step 02: handel scroll left
              resizeNineScrollLeft();
              nineScrollLeft();

              // Step 03: handle rightSide
              $("#screen-chat").append(data.rightSideData);

              // Step 04: call function Screenchat
              changeScreenChat();

              // Step 05: convert emoij
              convertEmoji();

              // Step 06: handle imageModal
              $("body").append(data.imageModalData);

              // Step 07: call gridPhotos
              gridPhotos(5);

              // Step 08: handle attachmentMdal
              $("body").append(data.attachmentModalData);

              // Step 09: update online
              socket.emit("check-status");
  
              // Step 10: Remove loading
              $("#link-read-more-all-chat").css("display", "inline-block");
              $(".read-more-all-chat-loader").css("display", "none");

              // Step 11: read more message
              readMoreMessages();
          });
      });
  });