const express = require('express')
const path = require('path');
const app = express()
const port = 7000

app.use(cors());
//app.use('/', express.static(__dirname + '/home'));
app.get('/home', (req, res) => {
  res.sendFile(path.join(staticPath, 'home', 'Home.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})