const express = require('express');
const multer = require('multer');
const adminRouter = express.Router();
const {
    registerController,
    loginController,
    dashboardController,
    // profileController,
    // updateProfileController
} = require('../controllers/admin.controller');
// const { contactController } = require('../controllers/contact.controller');

const { isAuthAdmin } = require('../../utils/session');
// const { newsletterController } = require('../controllers/newsletter.controller');

// Configure multer to upload images to the server
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        // Customize the filename if needed
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const originalName = file.originalname.split('.')[0];
        const originalExtension = file.originalname.split('.').pop();
        // Generate a unique filename for the image
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + originalName + '.' + originalExtension);
    }
});

// Set limitations and rules to the multer
const upload = multer({
    storage: Storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        // Accept only certain file types
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, JPG and PNG files are allowed'));
        }
    }
});


// User register route
adminRouter.post('/register', upload.single('image'), registerController)

// Render the login page to the user
adminRouter.get('/login', async (req, res, next) => {
    res.render('adminLogin', { title: 'Admin Login' });
});

// User login route
adminRouter.post('/login', loginController);

// Render the dashboard page to the user
adminRouter.get('/dashboard', isAuthAdmin, dashboardController);

// User logout using destroy session
adminRouter.get('/logout', (req, res) => {
    // Clear session data
    req.session.destroy((error) => {
        if (error) {
            res.send(`<h2>Something went wrong: ${error}</h2>`);
        } else {
            // Redirect to the login page or any other desired page
            res.redirect('/admin/login');
        }
    });
});

// // User profile route
// adminRouter.get('/profile', isAuthAdmin, profileController);

// // User update profile route
// adminRouter.post('/update-profile', isAuthAdmin, upload.single('image'), updateProfileController);

// // Render the contact page to the user
// adminRouter.get('/contact', async (req, res, next) => {
//     res.render('contact', { title: "Contact us" });
// });

// // User contact us route
// adminRouter.post('/contact', contactController);

// // User newsletter router
// adminRouter.post('/newsletter', newsletterController);


module.exports = adminRouter;
