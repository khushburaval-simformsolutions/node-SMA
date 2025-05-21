
const { createPost, getPosts, updatePost, deletePost } = require('../services/postService');

const createPostHandler = async (req, res) => {
  try {
    const post = await createPost(req.user.id, req.body.content);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPostsHandler = async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updatePostHandler = async (req, res) => {
  try {
    const post = await updatePost(req.params.id, req.user.id, req.body.content);
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deletePostHandler = async (req, res) => {
  try {
    const post = await deletePost(req.params.id, req.user.id);
    res.json({ message: 'Post deleted successfully', post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createPostHandler, getPostsHandler, updatePostHandler, deletePostHandler };