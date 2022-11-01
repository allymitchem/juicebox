const express = require('express');
const postsRouter = express.Router();
const {getAllPosts, createPost} = require('../db');
const {requireUser} = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
  // res.send({message: 'under construction' });
  const {title, content, tags = ""} = req.body;
  const tagArr= tags.trim().split(/\s+/)
  
  
  const postData = {authorId: req.user.id, title, content};
  console.log(postData, 'BIG FAT NOTE')

  if (tagArr.length){
    postData.tags = tagArr;
  }

  try {
    const post = await createPost(postData)
    console.log(post)
    if (post){
      res.send({post});
    } else {
      next({
        name: 'NoPostError',
        message: 'Valid post is necessary'
      });
    }

    

  } catch ({name, message}){
    next({ name, message})
  }
});

postsRouter.use((req, res, next)=>{
  console.log("A request is being made to /posts");
  next();

});
 
postsRouter.get ('/',async (req,res)=>{
  const posts = await getAllPosts();
  res.send({
    posts
  });
});

module.exports = postsRouter;
