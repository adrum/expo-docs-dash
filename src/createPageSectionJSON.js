var cheerio = require('cheerio');
var fs = require('fs');
var config = require('./config');

// All current Pages
var indexedFiles = require('./indexedFiles');
var version = fs.readFileSync(__dirname+'/version', 'utf8').trim();

var keyed ={};

var pageNamesArray = [];
indexedFiles.forEach((srcPage)=>{
    var basePageSrc = `${config.name}${config.folder}${srcPage.name}.html`;
    var basePath = __dirname + `/../Contents/Resources/Documents/${basePageSrc}`;
    var baseSrc = fs.readFileSync(basePath, 'utf8');

    // get base file to iterate over
    var $ = cheerio.load(baseSrc);
    var pageTitle = $('h1').children('span').first().text();
    var $links = $('h2[data-heading]');

    $links.each(function(i, elem){

        var anchor = $(elem).find('a');

        var href = $(anchor).attr('href');

        href = href.split('#').pop();

        var title = $(anchor).children('span:not([id])').first().text()

        var dashAnchorPath = title;

        var page = {
            name: `${pageTitle} - ${title}`,
            type: 'Section',
        };

        if (keyed.hasOwnProperty(page.name)) {
            var text = $(elem).prevAll('h1').first().text()
            dashAnchorPath = `${text}: ${title}`,
            page.name = `${pageTitle} - ${dashAnchorPath}`;
        }

        page.path = `${config.name}${config.folder}${srcPage.name}.html#//apple_ref/Section/${encodeURIComponent(dashAnchorPath)}`;
        keyed[page.name] = page;

        $(elem).before( `<a name="//apple_ref/Section/${encodeURIComponent(dashAnchorPath)}" class="dashAnchor"></a>`);
        pageNamesArray.push(page);
    });

    fs.writeFileSync(basePath, $.html(), 'utf8');
})

fs.writeFile(__dirname+'/indexedPageSections.js', 'var indexedFiles = ' + JSON.stringify(pageNamesArray, null, 4) + ';\n\nmodule.exports = indexedFiles;', 'utf8', ()=>{});
