import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат, ожидается массив тэгов").optional().isArray(),
  body("imageUrl", "Неверный адрес изображения").optional().isString(),
];
