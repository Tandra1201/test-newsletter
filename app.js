// menghubungkan dengan express
const express = require("express");
// menangkap input yang dikirim lewat method post
const bodyParser = require("body-parser");

const request = require("request");
const https = require("https");

const app = express();
const port = 3000;

// membuat lokasi static sehingga file yang dibutuhkan bisa digunakan
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    const url = "https://us12.api.mailchimp.com/3.0/lists/b72d4c5d51"

    const options = {
        method: "POST",
        auth: "dicky1:d7128d05313f845004c024046818b645-us12"
    }

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(port || process.env.PORT, function () {
    console.log("server is running on port " + port);
})

// API KEY
// d7128d05313f845004c024046818b645-us12

// Audience ID
// b72d4c5d51