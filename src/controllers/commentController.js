const commentService = require('../services/commentService');
const { getIO } = require('../sockets/socket');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const addCommentHandler = async (req, res) => {
  try {
    // Save comment
    const comment = await commentService.addComment(
      req.params.postId,
      req.user.id,
      req.body.text
    );

    // Emit WebSocket event
    getIO().to(req.params.postId).emit('commentAdded', {
      postId: req.params.postId,
      comment: {
        ...comment.toObject(),
        user: {
          _id: req.user.id,
          username: req.user.username
        }
      }
    });

    return successResponse(res, comment, 201);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getCommentsHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const paginatedComments = await commentService.getComments(
      req.params.postId,
      page,
      limit
    );
    return successResponse(res, paginatedComments);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  addCommentHandler,
  getCommentsHandler
};