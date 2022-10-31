const PORT = 3000;
const express = require('express');
const server = express();

const apiRouter= require('./api');
server.use('/api', apiRouter);

server.use((req, res, next)=>{
  console.log("<___Body Logger START____>");
  console.log(req.method);
  console.log("____Body Logger END____>");
  next();
})



server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});
