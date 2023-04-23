var cheerio = require('cheerio');
var fs = require('fs');
var flatten = require('lodash.flatten');
var config = require('./config');
var indexedFiles = require('./indexedFiles');
var indexedPageSections = require('./indexedPageSections');
var version = fs.readFileSync(__dirname+'/version', 'utf8').trim();

// this assumes build.sh has been run, and the react-native docs fetched into
// Contents/Resources/Documents/react-native
function getData() {
    var res = indexedFiles.map(function(array) {
        var path = __dirname + `/../Contents/Resources/Documents/${config.name}${config.folder}${array.name}.html`;
        var src = fs.readFileSync(path, 'utf-8');
        var $ = cheerio.load(src);

        var $headers = $(config.pageHeader).first();

        var names = [];

        $headers.each(function(index, elem) {

            var name = $($(elem).contents()).text();

            if (name.indexOf('.css') > -1) {
                name = $($(elem).children('span')).first().text()
            }

            names.push(name.trim());
            // names.push(name.trim().substring(0, name.length - 2));
        });

        var url = `${config.name}${config.folder}${array.name}.html#`

        var res = names.map(function(n, i) {
            return {
                name: n,
                type: array.type,
                path: url + 'content',
            };
        });

        return res;
  });

  return flatten(res).concat(indexedPageSections);
}

module.exports = getData;
