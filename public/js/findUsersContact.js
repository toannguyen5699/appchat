function callFindUsers(element) {
    if (element.which === 13 || element.type === "click") {
        let keyword = $("#input-find-users-contact").val();
        let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);


        if (!keyword.length) {
            alertify.notify("Chua nhap noi dung tim kiem", "error", 3);
            return false;
        }

        if (!regexKeyword.test(keyword)) {
            alertify.notify("Loi tu khoa tim kiem khong cho phep ki tu dac biet", "error", 3);
            return false;
        }

        $.get(`/contact/find-users/${keyword}`, function(data) {
            $("#find-user ul").html(data);
            addContact(); // js/addContact.js
            removeRequestContactSent(); // js/removeRequestContact.js
        });
    }
}

$(document).ready(function() {
    $("#input-find-users-contact").bind("keypress", callFindUsers);

    $("#btn-find-users-contact").bind("click", callFindUsers);
});