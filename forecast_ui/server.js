const express = require('express'),
       path = require('path');
       var cors = require('cors');

const app = express();

 
app.use(cors())
app.listen(process.env.PORT || 8080, () =>
{
});
app.use(express.static(__dirname + '/dist'));
app.get('/*',(req,res) => {
res.sendFile(path.join(__dirname + '/dist/index.html'))});