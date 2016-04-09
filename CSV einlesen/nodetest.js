fs = require('fs')
fs.readFile('Liste_PPN-ExNr_HSHN-libre.csv', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var lines = data.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  var outputFilename = 'my.json';

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }

	  result.push(obj);
  }
  fs.writeFile(outputFilename, JSON.stringify(result), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
  });
});
