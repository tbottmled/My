var Httpserver = {};
var http = require('http');
var request = require('request').verbose();

http.createServer(function(req,res){
    //查询密码信息
    var querySql = "select * from password";
    var queryData = sqlitedb.selectAll(querySql);
    console.log(queryData);
    res.end(JSON.stringify(queryData));
}).listen(8520);

//发送http get请求
Httpserver.get = function HttpGetRequest(url){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
          return body;
        }
    })
}

//发送http post请求
Httpserver.post = function HttpPostRequest(url,requestData){
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
            
        }
    });
}

module.exports.Httpserver = Httpserver;