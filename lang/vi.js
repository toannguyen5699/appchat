export const transValidation = {
    email_incorrect: "Email phải có dạng example@gmail.com",
    gender_incorrect: "Sai giới tính ",
    password_incorrect: "Mật khẩu phải có ít nhất 8 kí tự, ba gồm chữ hoa chữ thường",
    password_confirmation_incorrect: "Nhập lại mật khẩu chưa đúng", 
    update_username: "User name gioi han 3-17 ki tu, khong chua ki tu dac biet.",
    update_gender: "Sai gioi tinh",
    update_address: "Dia chi gioi han trong khonag 2-30 ki tu",
    update_phone: "so dien  thoai viet nam bat dau tu so 0 gioi han trong khoang 10-11 ki tu",
    keyword_find_user: "Lỗi kí tự tìm kiếm chỉ cho phép ký tự chữ cái, số và khoảng trống.",
    message_text_emoji_incorrect: "Tin nhan khong hop le. Dam bao toi thieu 1 ki tu, toi da 500 ki tu.",
    add_new_group_users_incorrect: "Vui long chon them ban be de them vao nhom",
    add_new_group_name_incorrect: "Vui long nhap ten cuoc tro chuyen ( tu 5 den 30 ki tu), va khong chua ki tu dac biet"
};

export const transErrors = {
    account_in_use: "Email đã tồn tại",
    account_removed: "Tài khoản đã bị gỡ khỏi hệ thống",
    account_not_active: "Tài khoản chưa được kích hoạt",
    account_undefined: "Tai khoan khong ton tai",
    token_undefined: "Token khong ton tai!!!",
    login_failed: "sai tai khoan hoac mat khau",
    server_error: "Server Error",
    avatar_type: "file type error",
    avatar_size: "upload img max stogare is 1MB",
    user_current_password_failed: "Mat khau hien tai khong chinh xac",
    conversation_no_found: "Cuoc tro chuyen khong ton tai",
    image_message_type: "file type error",
    image_message_size: "upload img max stogare is 1MB",
    attachment_message_size : "upload file max stogare is 1MB",
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo thành công`;
    },
    account_actived: "Kich hoat tai khoan thanh cong",
    loginSuccess: (username) => {
        return `xin chao ${username}, chao mung ban quy tro lai`;
    },
    logout_success: "dang xuat tai khoan thanh cong.",
    user_info_updated: "cap nhat thong tin nguoi dung thanh cong.",
    user_password_updated: " Cap nhat mat khau thanh cong"
};

export const transMail = {
    subject: "App Chat: Xác nhận kích hoạt tài khoản",
    template: (linkVerify) => {
        return `
            <h2> Bạn nhận được Email này vì đã đăng kí tài khoản trên App Chat</h2>
            <h3> Vui lòng Click vào liên kết bên dưới để xác nhận kích hoạt tài khoản </h3>
            <h3><a href= "${linkVerify}" target= "blank">${linkVerify}</a></h3>
            <h4> cảm ơn bạn đã sử dụng App Chat </h4>
        `;
    },
    send_failed: "Co loi trong qua trinh gui email, vui long lien he App Chat"
};
