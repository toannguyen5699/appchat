export const transValidation = {
    email_incorrect: "Email phải có dạng example@gmail.com",
    gender_incorrect: "Sai giới tính ",
    password_incorrect: "Mật khẩu phải có ít nhất 8 kí tự, ba gồm chữ hoa chữ thường",
    password_confirmation_incorrect: "Nhập lại mật khẩu chưa đúng"
};

export const transErrors = {
    account_in_use: "Email đã tồn tại",
    account_removed: "Tài khoản đã bị gỡ khỏi hệ thống",
    account_not_active: "Tài khoản chưa được kích hoạt"
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo thành công`;
    } 
}