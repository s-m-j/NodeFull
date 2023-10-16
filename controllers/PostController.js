import { validationResult } from "express-validator";

import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Ошибка сохранения статьи" });
  }
};

export const getAll = async (req, res) => {
  try {
    // Это просто записи коллекции без расшифровки ключей
    // const posts = await PostModel.find();

    // а это с расшифровкой ключей, в poulate() можно передать массив
    const posts = await PostModel.find()
      // .populate("user", "-passwordHash") -- если нужно исключить что-то
      .populate("user", ["fullName", "email"])
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить список статей" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user", ["fullName", "email"])
      .exec()
      .then((doc, err) => {
        if (err) {
          console.log(err);
        }
        res.json(doc);
      })
      .catch((reject) => {
        res.status(404).json({ message: "Статья не найдена!" });
      });

    /*
    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    );
    */

    // res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось получить заданную статью" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc, err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "не удалось удалить статью",
          });
        }

        if (!doc) {
          res.status(500).json({
            message: "Статья не найдена",
          });
        }

        res.json({
          success: "true",
        });
      })
      .catch((reject) => {
        res.status(404).json({ message: "Статья не найдена!" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Ошибка операции remove" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
