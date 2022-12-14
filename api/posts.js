const express = require('express');
const postsRouter = express.Router();
const {getAllPosts, createPost, updatePost, getPostById} = require('../db');
const {requireUser, requireActiveUser} = require('./utils');

postsRouter.post('/', requireUser, requireActiveUser, async (req, res, next) => {
  // res.send({message: 'under construction' });
  const {title, content, tags = ""} = req.body;
  const tagArr= tags.trim().split(/\s+/)


  const postData = {authorId: req.user.id, title, content};


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
  const allPosts = await getAllPosts();
  const posts = allPosts.filter(post => {
    return post.active || (req.user && post.author.id === req.user.id )|| post.author.active;

    // if (post.active){
    //   return true;
    // }
    // if (req.user && post.author.id === req.user.id){
    //   return true
    // }
    // return false
  });

  res.send({
    posts
  });
});

postsRouter.patch('/:postId', requireUser, requireActiveUser, async (req, res, next)=>{
  const {postId} = req.params;
  const { title, content, tags}= req.body;

  const updateFields = {};
  if (tags && tags.length>0){
    updateFields.tags=tags.trim().split(/\s+/);
  }
  if (title){
    updateFields.title=title;
  }
  if (content){
    updateFields.content =content;
  }
  try{
    const originalPost=await getPostById(postId);
    if (originalPost.author.id === req.user.id){
      const updatedPost = await updatePost(postId, updateFields);
      res.send({post:updatedPost})
    }else{
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours! Go in time out!"
      })
    }
  } catch ({name, message}){
    next({name, message});
  }
});

postsRouter.delete('/:postId', requireUser, requireActiveUser, async (req, res, next)=>{
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id){
      const updatedPost = await updatePost(post.id, {active:false});

      res.send({post: updatedPost});
    } else {
      next(post ? {
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      }: {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }
  } catch({ name, message}){
    next({name, message})
  }
});

module.exports = postsRouter;
