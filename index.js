const fs = require('fs'),
const convertFactory = require('electron-html-to');
const axios = require("axios");
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML");
const conversion = convertFactory({
converterPath: convertFactory.converters.PDF
});




function init() {                                             
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter your GitHub username:",
                name: "username"
            },
            {
                type: "list",
                mesage: "Select your preferred color",
                choices: ["green", "blue", "pink", "red"],
                name: "color"
            }])



                                                    // API call to github API 
        .then(function ({ username, color }) {
            const queryURL = "https://api.github.com/users/${username}";
            axios.get(queryURL).then(function (response) {

                let photo = response.data.avatar_url;
                let name = response.data.login;
                let location = response.data.location;
                let profile = response.data.html_url;
                let blog = response.data.blog;
                let bio = response.data.bio;
                let repos = response.data.public_repos;
                let followers = response.data.followers;
                let following = response.data.following;

                console.log(photo, name, location, profile, blog, bio, repos, followers, following);


                const html = generateHTML({ color, photo, name, location, profile, blog, bio, repos, followers, following });

                conversion({ html: html }, function (err, result) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(result.numberOfPages);
                    console.log(result.logs);
                    result.stream.pipe(fs.createWriteStream('./index.pdf'));
                    conversion.kill(); 
                });




            })
        })
}


init();          