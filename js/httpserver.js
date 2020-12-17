const http = require('http');
const request = require('request');

http.createServer(function(req,res){
    //查询密码信息
    var querySql = "select * from password";
    var queryData = sqlitedb.selectAll(querySql);
    console.log(queryData);
    res.end(JSON.stringify(queryData));
}).listen(8520);

//发送http get请求
function HttpGetRequest(url){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        }
    })
}

//发送http post请求

