const PORT = process.env.PORT || 80;
const express = require('express');


let app = express();
// console.log(typeof fs.readFileSync('public/shaders/vertexShader.txt', 'utf-8'));
app.use(express.static('public'));

app.listen(PORT);