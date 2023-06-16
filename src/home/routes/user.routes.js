const express = require('express');
const multer = require('multer');
const userRouter = express.Router();
const app = express();
const { registerController, loginController, profileController, updateProfileController } = require('../controllers/user.controller');
const { contactController } = require('../controllers/contact.controller');


const { isAuth } = require('../../utils/session');
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        // Customize the filename if needed
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const originalName = file.originalname.split('.')[0];
        const originalExtension = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + originalName + '.' + originalExtension);
        // cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for the image
    }
});

const upload = multer({
    storage: storage,
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


userRouter.get('/contact', async (req, res, next) => {
  res.render('contact', { title: "Contact us" });
});

userRouter.post('/contact', contactController);



userRouter.get('/register', async (req, res, next) => {
    res.render('register', { title: 'Register' });
});

userRouter.post('/register', upload.single('image'), registerController)


userRouter.get('/login', async (req, res, next) => {
    res.render('login', { title: 'Login' });
});

userRouter.post('/login', loginController);

userRouter.get('/logout', (req, res) => {
    // Clear session data
    req.session.destroy((error) => {
        if (error) {
            res.send(`<h2>Something went wrong: ${error}</h2>`);
        } else {
            // Redirect to the login page or any other desired page
            res.redirect('/user/login');
        }
    });
});

userRouter.get('/profile', isAuth, profileController);

userRouter.post('/update-profile', isAuth, upload.single('image'), updateProfileController);


module.exports = userRouter;
