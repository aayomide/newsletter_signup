const bodyParser = require("body-parser");
//jshint esversion:6

const express = require("express");
const body_parser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(body_parser.urlencoded({extended: true}))

// load static files .. css js images
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

// what happens when we receive post request of subscibers details
app.post('/', (req, res) => {


    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    
    // console.log(firstName);

    // CONNECT TO MAILCHIMP API:
    // first create an array of objects of members (check: listing/audience-batch sub section of the MC API reference)

    const data = {
        members: [
            {
                "email_address": email,
                "status": "subscribed",
                "merge_fields": {
                    "FNAME": firstName,
                    "LNAME": lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    // next: make a post (unlike openweather api where we made a get) request to mailchimp api (an external server)
    const url = 'https://us7.api.mailchimp.com/3.0/lists/058c9ad2c3';
    const options = {
        method: "POST",
        auth: "anystringgg:a01f6de27de353c24419b5b28ff270f7-us7"
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on('data', (data) => {
            console.log(JSON.parse(data));

            // realise we wanna send something to mailchimp, but haven't specified what (i.e the data above) in this fxn
            // thats one reason we save this function in a variable .. so we can call .write() on it
        })
    })

    request.write(jsonData);
    request.end();
})


// what happens when we receive post request to try subcribing again
app.post('/failure.html', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000.")
});

// API keys:
// a01f6de27de353c24419b5b28ff270f7-us7
// LIST/AUDIENCE ID:
// 058c9ad2c3
// List_id helps mailchimp identify the list that you want to put your subscribers into