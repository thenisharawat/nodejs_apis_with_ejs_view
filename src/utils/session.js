const isAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    }
    else {
        console.log("User not logged in");
        res.redirect('/user/login');
    }
};

const isAuthAdmin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    }
    else {
        console.log("User not logged in");
        res.redirect('/admin/login');
    }
};

module.exports = { isAuth, isAuthAdmin };