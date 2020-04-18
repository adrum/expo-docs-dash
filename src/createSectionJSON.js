var cheerio = require('cheerio');
var fs = require('fs');
var config = require('./config');

// get base file to iterate over
var version = fs.readFileSync(__dirname+'/version', 'utf8').trim();
var basePath = __dirname + `/../Contents/Resources/Documents/${config.name}${config.folder}${version}/${config.index}`;
var baseSrc = fs.readFileSync(basePath, 'utf8');
var $ = cheerio.load(baseSrc);
var pageNamesArray = [];
var $section = $('.' + config.sectionClass);
var path = __dirname + '/../src/indexedFiles.js';


$section.each(function(i, elem){

    // TODO: create a better config pointer
    var $sectionHeader = $(this).children('.'+config.sectionHeaderClass).text();
    var $subSection = $(this).find('.'+config.subSectionClass);
    $subSection.each(function(i, elem){
        var $subSectionHeader = $(this).children('.'+config.subSectionHeaderClass).text();
        var $sectionLink = $(this).children('a'+'.'+config.sectionLinkClass);

        $sectionLink.each(function(i, elem){
            var page = {};
            var excludeArray = $(this).text();

            if(config.ignoreSection.sectionsArray.indexOf($sectionHeader) !== -1 || config.ignoreSection.sectionsArray.indexOf($subSectionHeader) !== -1) {
                return;
            }

            // substring removes last 5 characters '.html' from href.
            page.name = $(this).attr('href').substring(0, $(this).attr('href').length - 5);

            if(config.ignorePage.pagesArray.indexOf(excludeArray) !== -1) {
                return;
            }

            page.type = config.defaultPageType;
            page.toc = config.defaultPageTOC;

            // set the Dash types based on the doc headers.
            switch ($sectionHeader) {
                case 'API Reference':
                    page.type = 'Library';
                    page.toc = 'Property';
                    break;
            };
            switch ($subSectionHeader) {
                case 'Expo SDK':
                    page.type = 'Package';
                    page.toc = 'Property';
                    break;
                case 'React Native':
                    page.type = 'Components';
                    page.toc = 'Property';
                    break;
            };
            pageNamesArray.push(page);
        });
    });
});

fs.writeFile(path, 'var indexedFiles = ' + JSON.stringify(pageNamesArray, null, 4) + ';\n\nmodule.exports = indexedFiles;', 'utf8', ()=>{});
