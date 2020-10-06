const express = require("express");
const app = express();
const port = process.env.port || 3000;
const { nanoid } = require('nanoid');
const MongoClient = require('mongodb').MongoClient;
const BSON = require('bson');
const bodyParser = require('body-parser');

const url = "YOUR MONGO URL";

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});

app.get('/', (req,res) => { 
    res.sendFile(__dirname+'/public/index.html');
})

app.get('/:urlid', (req,res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let id = req.params.urlid;

        var dbo = db.db("urlshortener");
        var query = { short: id };
        dbo.collection("urls").find(query).toArray(function(err, result) {
            if (err) throw err;
            db.close();

            if(result[0]) {
                res.redirect(result[0]['url']);
            }
        });
      });
});

app.post('/url', (req,res) => {
    let body = req.body;
    if(!body['url']) { res.send('500'); return; } 

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("urlshortener");
        var src = body['src'];
        var obj = { url: body['url'], short: nanoid(5), src: src || undefined };

        dbo.collection("urls").insertOne(obj, function(err, resp) {
            res.json(resp['ops'][0]);
            if (err) throw err;
            db.close();
        });
    });
    
})
