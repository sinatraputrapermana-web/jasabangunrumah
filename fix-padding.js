const fs = require('fs');

function removePx0(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/class="card-body px-0"/g, 'class="card-body"');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

removePx0('blog/estimasi-biaya-bangun-rumah.html');
removePx0('index.html');
