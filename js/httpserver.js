var Httpserver = {};
var http = require('http');
var url = require('url');
var request = require('request');
var qs=require('querystring');

Httpserver.server = function(){

}

Httpserver.server.prototype.respone = function HeepRespone(){
    http.createServer(function(req,res){
        var arg = url.parse(req.url).query;
        var code = qs.parse(arg)['code']; 
        //保存code
        res.end(code);
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
            response.end(JSON.stringify(body))
        }
    });
}

module.exports.server = Httpserver.server;