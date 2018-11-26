const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// static folder
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body;

    // Validation to make sure fields are filled
    if (!firstName || !lastName || !email) {
        res.redirect('/fail.html')
        return;
    }

    // construct request data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    // stringify
    const postData = JSON.stringify(data);

    // create options
    const options = {
        url: 'https://us19.api.mailchimp.com/3.0/lists/a600f327a3',
        method: 'POST',
        headers: {
            // api key
            Authorization: 'auth 5c48eb5227a951af2d86597ca743c4f6-us19'
        },
        body: postData
    }

    // request function
    request(options, (err, response, body) => {
        // check for errror -> redirect to failpage
        if(err) {
            res.redirect('/fail.html');
        } else {
            if(response.statusCode === 200) {
                res.redirect('/success.html');
            } else {
                res.redirect('/fail.html');
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));