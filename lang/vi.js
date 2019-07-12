export const transValidation = {
    email_incorrect: "Email phải có dạng example@gmail.com",
    gender_incorrect: "Sai giới tính ",
    password_incorrect: "Mật khẩu phải có ít nhất 8 kí tự, ba gồm chữ hoa chữ thường",
    password_confirmation_incorrect: "Nhập lại mật khẩu chưa đúng"
};

export const transErrors = {
    account_in_use: "Email đã tồn tại",
    account_removed: "Tài khoản đã bị gỡ khỏi hệ thống",
    account_not_active: "Tài khoản chưa được kích hoạt",
    token_undefined: "Token khong ton tai!!!"
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo thành công`;
    },
    account_actived: "Kich hoat tai khoan thanh cong"
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
