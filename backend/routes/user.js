const express = require('express') ;
const router = express.Router() ;
module.exports = router ;
const userController = require('../controllers/user') ;


router.post("/signup",userController.createUser);

router.post("/login",userController.login);
