import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from "cors";

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { checkAuth, handleValidationErrors } from './middleware/index.js';

import { UserController, PostController } from './controllers/index.js';


mongoose
    .connect("mongodb+srv://RedCrown:password@mern-app.thsk0ov.mongodb.net/blog?retryWrites=true&w=majority",)
    .then(() => console.log('DB OK'))
    .catch((err) => console.log("DB error", err))

const app = express();

const storageImage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const storageAvatar = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'avatars')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage: storageImage });
const avatar = multer({ storage: storageAvatar });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/avatars', express.static('avatars'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.post('/avatar', avatar.single('image'), (req, res) => {
    res.json({
        url: `/avatars/${req.file.originalname}`,
    })
})

// app.get('/', (res) => {
//     res.send("Working")
// });

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
