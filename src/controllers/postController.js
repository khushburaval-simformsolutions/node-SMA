const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostById,
  getUserPosts,
} = require("../services/postService");
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require("../utils/responseHandler");

const createPostHandler = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, { errors: errors.array() });
    }

    const post = await createPost(req.user.id, req.body.content);
    return successResponse(
      res,
      {
        message: "Post created successfully",
        post,
      },
      201
    );
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getPostsHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await getPosts(parseInt(page), parseInt(limit));
    return successResponse(res, posts);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const updatePostHandler = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, { errors: errors.array() });
    }

    const post = await updatePost(req.params.id, req.user.id, req.body.content);
    return successResponse(res, {
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const deletePostHandler = async (req, res) => {
  try {
    const post = await deletePost(req.params.id, req.user.id);
    return successResponse(res, {
      message: "Post deleted successfully",
      post,
    });
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getPostByIdHandler = async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    return successResponse(res, post);
  } catch (err) {
    return errorResponse(res, err);
  }
};

const getUserPostsHandler = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await getUserPosts(
      req.params.id,
      parseInt(page),
      parseInt(limit)
    );
    return successResponse(res, posts);
  } catch (err) {
    return errorResponse(res, err);
  }
};

module.exports = {
  createPostHandler,
  getPostsHandler,
  updatePostHandler,
  deletePostHandler,
  getPostByIdHandler,
  getUserPostsHandler,
};
