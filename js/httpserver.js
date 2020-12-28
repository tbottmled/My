var Httpserver = {};
var http = require('http');
var url = require('url');
var request = require('request');
var qs=require('querystring');

var SqliteDB = require('../js/db.js').SqliteDB;
var sqlitedb = new SqliteDB('my.db');

Httpserver.server = function(){

}

Httpserver.server.prototype.respone = function HeepRespone(){
    http.createServer(function(req,res){
        var arg = url.parse(req.url).query;
        var code = qs.parse(arg)['code']; 
        res.end(code);
        //保存到数据库
        var insertTileSql = "insert into userinfo (code) values(?);";
        var arr = new Array(1);
        arr[0] = code;
        var arrdata = new Array(arr);
        console.log(arrdata);
        sqlitedb.insertData(insertTileSql,arrdata);
    }).listen(8050);
}

//发送http get请求
Httpserver.server.prototype.get = function HttpGetRequest(url){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
          return body;
        }
    })
}

//发送http post请求
Httpserver.server.prototype.post = function HttpPostRequest(url,requestData){
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(requestData)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.stringify(body));
            response.end(JSON.stringify(body));
        }
    });
}

module.exports.server = Httpserver.server;