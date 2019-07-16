let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;


function updateUserInfo() {
    $("#input-change-avatar").bind("change", function() {
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

        if(typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();

            let fileReader = new FileReader();
            fileReader.onload = function(element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar" 
                }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);
            userAvatar = formData;
        } else {
            alertify.notify("Error FileReader ", "error", 7);
        }
    });

    $("#input-change-username").bind("change", function() {
        userInfo.username = $(this).val();
    });
    $("#input-change-gender-male").bind("click", function() {
        userInfo.gender = $(this).val();
    });
    $("#input-change-gender-female").bind("click", function() {
        userInfo.gender = $(this).val();
    });
    $("#input-change-address").bind("change", function() {
        userInfo.address = $(this).val();
    });
    $("#input-change-address").bind("change", function() {
        userInfo.phone = $(this).val();
    });
}

$(document).ready(function() {
    updateUserInfo();

    originAvatarSrc = $("#user-modal-avatar").attr("src");

    $("#input-btn-update-user").bind("click", function() {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("You must update profile before submit", "error", 7);
            return false;
        }
        console.log(userAvatar);
        console.log(userInfo);
    });

    $("#input-btn-cancel-update-user").bind("click", function() {
        userAvatar = null;
        userInfo = {};
        $("#user-modal-avatar").attr("src", originAvatarSrc);
    });
});
