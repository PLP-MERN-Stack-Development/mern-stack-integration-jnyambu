const Category = require('../models/category');

exports.getAll = async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json(categories);
};

exports.create = async (req, res) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const exist = await Category.findOne({ slug });
  if (exist) return res.status(400).json({ message: 'Category exists' });
  const cat = new Category({ name, slug });
  await cat.save();
  res.status(201).json(cat);
};
