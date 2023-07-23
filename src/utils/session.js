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

// Custom middleware to prevent access to the login page if the user is already logged in
const authentication = (req, res, next) => {
    console.log("req.isAuthenticated()....", req.isAuthenticated());
    if (req.isAuthenticated()) {
        console.log("req.isAuthenticated() Inside IF....");
        return res.redirect('/'); // Redirect to a suitable URL for logged-in users
    }
    console.log("req.originalUrl....", req.originalUrl);
    // if (req.originalUrl === '/user/login') {
    //     console.log("req.originalUrl Inside IF....");
    //     return res.redirect('/'); // Redirect to another page when accessing the login page directly
    // }
    next();
};

module.exports = {
    isAuth,
    isAuthAdmin,
    authentication
};