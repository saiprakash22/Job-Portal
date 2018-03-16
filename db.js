var express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose');

app.use(express.static('public'));
app.use(bodyparser.json());
mongoose.connect('mongodb://localhost/jobportal');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/main.html');
});

var userSchema = new mongoose.Schema({
    "username": String,
    "password": String,
    "email": String,
    "phone": Number,
    "location": String,
    "usertype": String
});

var jobSchema = new mongoose.Schema({
    "job_title": String,
    "job_description": String,
    "job_location": String,
    "keywords": [String]
});

var LoggedInSchema = new mongoose.Schema({
    "userid": String,
    "usertype": String
});

var user = mongoose.model('user', userSchema);

var job = mongoose.model('job', jobSchema);

var LoggedIn = mongoose.model('LoggedIn', LoggedInSchema);

app.post('/register', function (req, res) {

    user.create(req.body, function (err, data) {
        if (!err) {
            res.send({
                "flg": true
            });
        }
    });
});

app.post('/login', function (req, res) {
    var username = req.body.username,
        password = req.body.password;
    user.findOne({
        username: username,
        password: password
    }, function (err, data) {
        var p = data;
        if (!err && data != null) {
            LoggedIn.create({
                "userid": data._id,
                "usertype": data.usertype
            }, function (err, data) {
                if (!err) {
                    res.send({
                        "data": p,
                        "flg": true
                    })
                } 
                

            });
        }
        else{
            console.log('else');
            res.send({
                "flg" : false
            });}
    });
});

app.get('/LoggedIn', function (req, res) {
    LoggedIn.find({}, function (err, data) {
        if (!err) {
            res.send(data);
        }
    })
});

app.post('/logout', function (req, res) {
    mongoose.connection.db.dropCollection('loggedins', function (err, data) {
        if (!err) {
            res.send({
                "flg": true
            })
        }
    })
})


app.post('/jobpost', function (req, res) {
    job.create(req.body, function (err, data) {
        if (!err) {
            res.send({
                "flg": true
            });
        }
    });
});

app.get('/jobDisplay', function (req, res) {
    job.find({}, function (err, data) {
        if (!err) {
            res.send(data);
        }
    })
});

app.post('/searchjob',function(req,res){
    job.find({$or:[{'job_title':req.body.job_title},{'keywords':req.body.keywords},{'job_location':req.body.job_location}]},function(err,data){
      if(!err){
          console.log(data);
          res.send({
              "searchResult" : data,
              "flg": true
          });
      }
    })
})

app.listen('1000', function () {
    console.log('server running @ localhost:1000');
});