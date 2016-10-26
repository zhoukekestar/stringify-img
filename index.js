var tinify = require("tinify")
  , program = require('commander')
  , fs = require('fs')
  , package = require('./package.json')
  , filename = ''
  , base64image = require('base64-img')
  , ncp = require("copy-paste");


program
  .version(package.version)
  .option('-k, --key [your key]', 'Your API Key in https://tinypng.com')
  .option('-f, --file [file]', 'Your image file that want to tinify & base64.')
  .parse(process.argv);


if (program.key && program.file) {

  tinify.key = program.key;
  filename = program.file.replace(/(jpg|png)/, 'min.$1');

  package.KEY = program.key;
  fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
  console.log('Key has been saved to package.json');

  tinify.fromFile(program.file).toFile(filename, function(err) {
    if (err) {
      console.log(err)
    } else {
      ncp.copy(base64image.base64Sync(filename), function () {
        console.log('The base64 image has been copied to clipboard. And you have used tinypng %s times this month.', tinify.compressionCount);
      })
    }
  });


} else if (program.key) {

  package.KEY = program.key;
  fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
  console.log('Key has been saved to package.json');

} else if (program.file) {

  if (!package.KEY) {
    console.warn('You have to set your key at first.')
    return;
  }

  tinify.key = package.KEY;
  filename = program.file.replace(/(jpg|png)/, 'min.$1');

  tinify.fromFile(program.file).toFile(filename, function(err) {
    if (err) {
      console.log(err)
    } else {
      ncp.copy(base64image.base64Sync(filename), function () {
        console.log('The base64 image has been copied to clipboard. And you have used tinypng %s times this month.', tinify.compressionCount);
      })
    }
  });

} else {
  console.log('Please input something...');
}
