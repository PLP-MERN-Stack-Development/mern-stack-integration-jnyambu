const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const postsCtrl = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createPostSchema } = require('../validations/postValidation');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random()*1E9) + ext);
  }
});
const upload = multer({ storage });

router.get('/', postsCtrl.getAll);
router.get('/:id', postsCtrl.getById);
router.post('/', auth, upload.single('featuredImage'), validate(createPostSchema), postsCtrl.create);
router.put('/:id', auth, upload.single('featuredImage'), postsCtrl.update);
router.delete('/:id', auth, postsCtrl.remove);

router.post('/:id/comments', postsCtrl.addComment); // comment route

module.exports = router;

