const express = require('express')
const path = require('path');
const app = express()
const port = 7000
const staticPath = path.join(__dirname, 'public');

const multer = require('multer');
const cors = require("cors");
app.use(express.static(staticPath));
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/images')
    },
    filename: (req, file, cb) => {
        // Preserve the original file extension
        cb(null,file.originalname);
    }
})
const upload = multer({storage: storage})
app.use(cors());
//app.use('/', express.static(__dirname + '/home'));
app.get('/home', (req, res) => {
  res.sendFile(path.join(staticPath, 'home', 'Home.html'));
});
app.post("/upload",upload.single("image"),(req,res)=>{
  res.status(200).json({
      message :"Image uploaded"
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})