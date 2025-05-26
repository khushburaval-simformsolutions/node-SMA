// src/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const commentService = require("../services/commentService");
const authMiddleware = require("../middlewares/authMiddleware");
const { getIO } = require("../sockets/socket");
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    // Save comment
    const comment = await commentService.addComment(
      req.params.postId,
      req.user.id,
      req.body.text
    );

    // Emit WebSocket event
    getIO().to(req.params.postId).emit("commentAdded", {
      postId: req.params.postId,
      comment: {
        ...comment.toObject(),
        user: {
          _id: req.user.id,
          username: req.user.username,
        },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await commentService.getComments(req.params.postId);
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
