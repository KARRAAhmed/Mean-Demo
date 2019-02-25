const express = require('express') ;
const router = express.Router() ;
const checkAuth = require('../middleware/check-auth') ;
const postController = require('../controllers/post') ;
const exctractFile = require('../middleware/file') ;

router.post("",checkAuth,exctractFile,postController.createPost);
router.get("",postController.getPosts) ;
router.delete('/:id',checkAuth,postController.deletePost);
router.put('/:id',checkAuth,exctractFile,postController.updatePost);
router.get('/:id',postController.getPost);
  module.exports = router ;
