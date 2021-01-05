//http服务
var httprequest = require('../js/httpserver.js').server;
var server = new httprequest();
const path = require('path');
//localstorage
const storage = require('electron-localstorage');
//storage.setStoragePath(path.join(__dirname, 'restore.json'));

//数据库服务
var SqliteDB = require('../js/db.js').SqliteDB;
var sqlitedb = new SqliteDB('my.db');
//主线程/渲染线程通信
const ipc = require('electron').ipcRenderer;
//登陆参数
var code = "";
var loginurl = "https://api.weibo.com/oauth2/authorize";
var appkey = "2110492170";
var appsecret = "6d623742beb0d11d930e5fbb91d82cae";
var callbackurl= "http://127.0.0.1:8050/code_handle";
var display = "default";
var tokenurl = "https://api.weibo.com/oauth2/access_token";
var home_line = "https://api.weibo.com/2/statuses/home_timeline.json";

function login(){
    //授权微博,打开授权页面
    url = loginurl + "?display=" + display + "&client_id=" + appkey + "&redirect_uri=" + callbackurl;
    ipc.send("login",url);
    var token;

    //获取code
    // var querySql = 'select * from userinfo';
    // sqlitedb.queryData(querySql, dealdata);
    
    //获取token
    // var data = {};
    // data.client_id = "2110492170";
    // data.client_secret = "6d623742beb0d11d930e5fbb91d82cae";
    // data.grant_type = "authorization_code";
    // data.code = code;
    // data.redirect_uri = callbackurl;
    // console.log(data);
    // session.defaultSession.cookies.get({ url: "http://localhost" }, function (error, cookies) {
    //     console.log(cookies);
    //     if (cookies.length > 0) {
    //         code = cookies[0].code;
    //         console.log(code);
    //     }
    // });
    code = storage.getItem('code');
    console.log(code);
    //console.log(tokenurl + "?client_id=" + appkey + "&client_secret=" + appsecret + "&grant_type=authorization_code"+ "&code=" + code + "&redirect_uri=" + callbackurl);
    server.post(tokenurl + "?client_id=" + appkey + "&client_secret=" + 
        appsecret + "&grant_type=authorization_code"+ "&code=" + code + "&redirect_uri=" + callbackurl,"").then(result => {
            console.log(result);
            console.log(JSON.parse(result).access_token);
            token = JSON.parse(result).access_token;
            //存入数据库
            var insertTileSql = "insert into userinfo (token,expires_in) values(?, ?);";
            var arr = new Array(2);
            arr[0] = token;
            arr[1] = JSON.parse(result).expires_in;
            var arrdata = new Array(arr);
            console.log(arrdata);
            sqlitedb.insertData(insertTileSql,arrdata);
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('登陆成功!');
              });
            //关闭数据库
            sqlitedb.close();
        });
    //关闭登录窗口
    ipc.send("wbloginclose");
    //获取
    server.get(home_line + "?access_token = " + token).then(result => {
        console.log(result);
    });
    
}

//function dealdata(objects){
    // objects.forEach(object => {
    //     var cookie = {
    //         url: "http://localhost",
    //         name: "code", 
    //         value: object.code 
    //     };
    //     session.defaultSession.cookies.set(cookie,(error) => {
    //         if(error) console.log(error);
    //         else console.log("sucess");
    //     })
    // });
//}