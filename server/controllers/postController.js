const Post = require('../models/Post');
const Category = require('../models/category');
const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, q, category } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { content: new RegExp(q, 'i') }
      ];
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.categories = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(filter)
      .populate('categories')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      data: posts,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// ✅ Rest of your routes stay outside getAll
exports.getById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('categories')
      .populate('author', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, excerpt, categories, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const post = new Post({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 200),
      content,
      excerpt: excerpt || content.substring(0, 150),
      author: req.user._id,
      categories: categories || [],
      published: published !== undefined ? published : true
    });

    if (req.file) {
      post.featuredImage = `/uploads/${req.file.filename}`;
    }

    await post.save();

    const populated = await Post.findById(post._id)
      .populate('categories')
      .populate('author', 'name');

    res.status(201).json({
      success: true,
      data: populated
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const updates = req.body;
    Object.assign(post, updates);

    if (req.file) {
      post.featuredImage = `/uploads/${req.file.filename}`;
    }

    post.updatedAt = Date.now();
    await post.save();

    const updated = await Post.findById(post._id)
      .populate('categories')
      .populate('author', 'name');

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { authorName, content } = req.body;

    if (!authorName || !content) {
      return res.status(400).json({
        success: false,
        message: 'Author name and content are required'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({ authorName, content });
    await post.save();

    res.status(201).json({
      success: true,
      data: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};
