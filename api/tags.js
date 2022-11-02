const express = require('express');
const tagsRouter = express.Router();
const {getAllTags, getPostsByTagName} = require('../db');

tagsRouter.use((req, res, next)=>{
  console.log("A request is being made to /tags");
  next();

});

tagsRouter.get ('/', async (req,res)=>{
  const tags = await getAllTags();
  res.send({
    tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next)=>{
let {tagName}= req.params;
// tagName = decodeURIComponent(tagName)
try{
const allPosts = await getPostsByTagName(tagName);
const posts = allPosts.filter(post => {
  return post.active || (req.user && post.author.id === req.user.id ) || post.author.active
})


res.send(posts)
}
catch({name, message}){
  next({
  name: 'NoMatchingTags',
  message: 'No matching tags'})
}
})
module.exports = tagsRouter;
