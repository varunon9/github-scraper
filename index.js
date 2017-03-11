var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// taking github url as input for scraping e.g https://github.com/varunon9
var url = process.argv[2];

// modifying url because it contains user's repositories details as well
url += '?tab=repositories';

// making get request to supplied url and scraping it
request(url, function(error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);

        // output will be written in json form
        var outputJson = scrapGithub($);

        writeOutputFile(outputJson);
    } else {
        console.log("Error occured:", error);
    }
});

//function to extract user data
var scrapGithub = function($) {
	var outputJson = {};
    outputJson.avatar = $('.vcard-avatar img').attr('src');
    outputJson.name = $('.vcard-fullname', '.vcard-names').text();
    outputJson.username = $('.vcard-username', '.vcard-names').text();
    outputJson.description = $('.user-profile-bio').text();
	var selector = '.vcard-details li';

    /**
    * Some data scraped were containing new line character ('\n')
    * and white spaces. So I removed it explictly using regex and .replace function
    */
    $(selector).each(function(i, e) {
        switch (i) {
            case 0: {
                outputJson.organization = $(e).text();
                break;
            }
            case 1: {
                outputJson.location = 
                        // replacing newline as well as leading space
                        $(e).text().replace(/(\r\n|\n|\r|^\s+)/gm, '');
                break;
            }
            case 2: {
                outputJson.email = $('a', e).text();
                break;
            }
            case 3: {
                outputJson.website = $('a', e).text();
                break;
            }
        }
    });
    selector = '.user-profile-nav a';
    $(selector).each(function(i, e) {
        switch (i) {
            case 1: {
                outputJson.repositories_count = 
                        // replacing newline as well as all white spaces
                        $('span', e).text().replace(/(\r\n|\n|\r|\s)/gm, '');
                break;
            }
            case 2: {
                outputJson.stars = 
                        $('span', e).text().replace(/(\r\n|\n|\r|\s)/gm, '');
                break;
            }
            case 3: {
                outputJson.followers = 
                        $('span', e).text().replace(/(\r\n|\n|\r|\s)/gm, '');
                break;
            }
            case 4: {
                outputJson.following = 
                        $('span', e).text().replace(/(\r\n|\n|\r|\s)/gm, '');
                break;
            }
        }
    });

    // scraping repositories details
    outputJson.repositories = [];
    $('.js-repo-list li', '#user-repositories-list').each(function(i, e) {
        var repository = {};
        repository.name = $('a', e).text().replace(/(\r\n|\n|\r|^\s+)/gm, '');
        repository.url = 'https://github.com';
        repository.url += $('a', e).attr('href');
        repository.description = $('p.text-gray', e).text().replace(/(\r\n|\n|\r|^\s+)/gm, '');
        outputJson.repositories.push(repository);
    });

    return outputJson;
};

// function to write user.json file to disk
var writeOutputFile = function(outputJson) {
    var data = JSON.stringify(outputJson);
    console.log(data);
	fs.writeFile('user.json', data, function(err) {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
	});
};