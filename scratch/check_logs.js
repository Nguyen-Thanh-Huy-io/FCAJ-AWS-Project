const fs = require('fs');
try {
  const content = fs.readFileSync('d:/Fullit/projects/PubliCast/backend/test_error.log', 'utf16le');
  console.log(content.split('\n').slice(-50).join('\n'));
} catch (e) {
  console.error(e);
}
