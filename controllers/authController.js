let getLoginRegister = (req,res) => {
	return res.render("auth/master");
};

let postRegister = (req, res) => {
	console.log(req.body);
}

module.exports = {
	getLoginRegister: getLoginRegister,
	postRegister: postRegister
};
