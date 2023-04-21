import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Парь должен быть минимум 5 символов').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Парь должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Имя должно быть минимум 3 символа').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватар').optional().isString(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
    body('tags', 'Неверерный формат тэгов').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];