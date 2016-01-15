var express = require('express')
, bodyParser = require('body-parser')
, request = require('request').defaults({json: true})
, httpProxy = require('http-proxy');

// 1
var app = express();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


var mongoose = startDBConnection();
var userSchemaObj = getUserSchemaObj();

app.post('/signup', function (req, response) 
{
  console.log('its signing up...');
  if (req.method == 'POST') {

    console.log(req.body.name);

   var tempUser = new userSchemaObj({ first_name: req.body.first_name, last_name: req.body.last_name, gender: req.body.gender, password: req.body.password, user_name: req.body.user_name  });
    tempUser.save(function (err) {
      if (err) 
       console.log('Error occured');
     else
     {
      response.writeHead(200, {"Content-Type": "application/json"});
      var reponseObject = { code:"200", message: "Successfully Created user: " + req.body.first_name};
      var json = JSON.stringify({  
        response:reponseObject
      });
      response.end(json);
    }

  });
  }
});


app.post('/login',function(req,res)
{

  console.log('Loging In ...');

  userSchemaObj.findOne({ user_name: req.body.user_name }, function(err, userObj) {

if (userObj != null) 
{
    console.log(req.body.user_name + "==" + userObj.user_name);
    if (err) 
    {
      res.writeHead(200, {"Content-Type": "application/json"});
      var reponseObject = { code:"400", message: err};
      var json = JSON.stringify({  
        response:reponseObject
      });
      res.end(json);
    }
    else if (req.body.user_name == userObj.user_name)
    {
      res.writeHead(200, {"Content-Type": "application/json"});
      var reponseObject = { code:"200", message: "Successfully Loged In" + userObj.first_name};
      var json = JSON.stringify({  
        response:reponseObject
      });
      res.end(json);
    }
    else
    {
      res.writeHead(200, {"Content-Type": "application/json"});
      var reponseObject = { code:"200", message: "Invalid Loged In credentials" };
      var json = JSON.stringify({  
        response:reponseObject
      });
      res.end(json);

    }
}
else
{
  res.writeHead(200, {"Content-Type": "application/json"});
      var reponseObject = { code:"200", message: "Invalid Loged In credentials" };
      var json = JSON.stringify({  
        response:reponseObject
      });
      res.end(json);
}
  });
});

app.post('/getuserslist', function (req, res) 
{
  console.log('Getting users list up...');
  userSchemaObj.find({ }, function(err, usersList) {

if (err) {
  res.writeHead(200, {"Content-Type": "application/json"});
      var reponseObject = { code:"200", message: "Error occured" };
      var json = JSON.stringify({  
        response:reponseObject
      });
      res.end(json);
}
else
{
  res.writeHead(200, {"Content-Type": "application/json"});
      var reponseObject = { code:"200", message: "Users list", users_list: usersList};
      var json = JSON.stringify({  
        response:reponseObject
      });
      res.end(json);
}

  });
});

function startDBConnection() {
  var dbConObj;
  var dbConObj = require('mongoose');
  dbConObj.connect('mongodb://localhost/user');

  return dbConObj;
}


function getUserSchemaObj()
{
   var schema_Obj =  mongoose.model('User', { first_name: String, last_name: String, gender: String, password: String, user_name: String });
   return schema_Obj;
}


// 3
app.all('*', function(req, res) {
  var url = 'http://0.0.0.0:4984' + req.url;
  req.pipe(req(url)).pipe(res);
});

// 4
var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});