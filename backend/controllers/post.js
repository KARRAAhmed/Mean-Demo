const Post = require('../models/post') ;

exports.createPost = (req,res,next)=>{
  // const post = req.body ;
  const url = req.protocol + '://' + req.get("host") ;
  const post = new Post(
    {
      title:req.body.title ,
      content:req.body.content,
      imagePath : url + "/images/" + req.file.filename,
      creator :req.userData.userId
     }) ;
    // console.log(req.userData) ;
    // return res.status(201).json({}) ;
     post.save().then(createdPost => {
       res.status(201).json({
         message: "Post added successfully",
         post: {id : createdPost._id,
          title : createdPost.title ,
          content :createdPost.content ,
          imagePath :createdPost.imagePath,
          creator: createdPost.creator}
       });
     }).catch(error => {res.status(500).json({message : 'Creation a post is Failed'})}) ;
   }
   exports.updatePost = (req,res,next)=>{
    // const post = req.body ;
    let imagePath = req.body.imagePath ;
    if(req.file)
    {
     const url = req.protocol + '://' + req.get("host") ;
     imagePath=url + "/images/" + req.file.filename;
    }


    const post = new Post(
      {
        _id:req.body.id ,
        title:req.body.title ,
        content:req.body.content,
        imagePath: imagePath,
        creator :req.userData.userId
       }) ;
    Post.updateOne({ _id: req.params.id , creator :req.userData.userId },post).then(result =>
      {console.log(result) ;
   console.log(req.params.id) ;
   if(result.nModified > 0)
   {
     res.status(200).json(
       {
         message:'post updated'
       }
     );
   }else{
     res.status(401).json(
       {
         message:'not updated'
       }
     );
   }

      }).catch(error => {res.status(500).json({message : 'Updating a post is Failed'})}) ;
   }

   exports.deletePost = (req,res,next)=>{
    // const post = req.body ;
    Post.deleteOne({ _id: req.params.id, creator :req.userData.userId }).then(result =>
      {console.log(result) ;
   console.log(req.params.id) ;
   if(result.n> 0)
   {
     res.status(200).json(
       {
         message:'post deleted'
       }
     );
   }else{
     res.status(401).json(
       {
         message:'not deleted'
       }
     );
   }
      }).catch(error => {res.status(500).json({message : 'Deleting a post is Failed'})}) ;
   }
   exports.getPosts = (req,res,next)=>{
    const pageSize = +req.query.pagesize ;
    const currentPage = +req.query.page ;
    const postQuery = Post.find() ;
    let fetchedPosts ;
    if(pageSize && postQuery)
    {
     postQuery.skip(pageSize *(currentPage -1)).limit(pageSize) ;
    }
    postQuery.then(documents =>
     {
       fetchedPosts = documents ;
       return Post.countDocuments()
     })
    .then(countDocuments=>
        {
      console.log('hello') ;
      console.log(countDocuments) ;
      res.status(200).json({
      message :'you do great',
      posts: fetchedPosts,
      maxPosts : countDocuments
              }) ;
        }).catch(error => {res.status(500).json({message : 'Fetching posts is Failed'})}) ;
  }

exports.getPost = (req,res,next)=>{
  // const post = req.body ;
  Post.findById(req.params.id).then(post =>
    { if(post){
        console.log(req.params.id) ;
        res.status(201).json(post);
       }
      else{
        res.status(404).json(
          {
            message:'error'
          }
        );
      }

    }).catch(error => {res.status(500).json({message : 'Fetching a post is Failed'})}) ;
 }
