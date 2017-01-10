var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var http = require("http");

var users;

var app = express();
app.use(express.static('front'));
var server = http.createServer(app).listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("CRUD server listening at", addr.address + ":" + addr.port);
});
app.use(bodyParser.json());
app.listen(3000);

mongodb.MongoClient.connect("mongodb://localhost:27017/test", function(err, database){
  users = database.collection("users");
});

// 一覧取得
app.get("/api/users", function(req, res){
  console.log("/api/users--------------------");

  // 削除フラグを確認する
  users.find({del_flg: 0}).toArray(function(err, items){
    res.send(items);
  });
});

// 削除一覧取得
app.get("/api/drops", function(req, res){
  console.log("/api/drops--------------------");

  // 削除フラグを確認する
  users.find({del_flg: 1}).toArray(function(err, items){
    res.send(items);
  });
});

// 個人取得
app.get("/api/users/:_id", function(req, res){
  console.log("個人取得/api/users/:_id--------------------");

  users.findOne({_id: mongodb.ObjectID(req.params._id)}, function(err, item){
    res.send(item);
  });
});

// 追加・更新
app.post("/api/users", function(req, res){
  console.log("追加・更新/api/users--------------------");

  var user = {};
  user = req.body;
  if (user._id) user._id = mongodb.ObjectID(user._id);
  // 削除フラグ追加
  user.del_flg = 0;

  console.log("user--------------------");
  console.log(user);

  users.save(user, function(){
    res.send("insert or update");
  });
});

// 削除
app.delete("/api/users/:_id", function(req, res){
  console.log("削除/api/users/:_id--------------------");

  // 削除フラグUpdate
  users.findOne({_id: mongodb.ObjectID(req.params._id)}, function(err, item){
    item.del_flg = 1;
    users.save(item, function(){
      res.send("delete");
    });
  });
});

// 復旧
app.delete("/api/drops/:_id", function(req, res){
  console.log("復旧/api/drops/:_id--------------------");

  // 削除フラグUpdate
  users.findOne({_id: mongodb.ObjectID(req.params._id)}, function(err, item){
    item.del_flg = 0;
    users.save(item, function(){
      res.send("recovery");
    });
  });
});