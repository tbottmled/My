//http服务
var httprequest = require('../js/httpserver.js').server;
var server = new httprequest();
const path = require('path');
//localstorage
const storage = require('electron-localstorage');
//storage.setStoragePath(path.join(__dirname, 'restore.json'));
//和主线程通信
const ipc = require('electron').ipcRenderer;
//var session = require('electron').remote.session;
//数据库服务
var SqliteDB = require('../js/db.js').SqliteDB;
var sqlitedb = new SqliteDB('my.db');

//登陆参数
var code = "";
var loginurl = "https://api.weibo.com/oauth2/authorize";
//https://open.weibo.cn/oauth2/authorize
//https://api.weibo.com/oauth2/authorize
var appkey = "2110492170";
var appsecret = "6d623742beb0d11d930e5fbb91d82cae";
var callbackurl= "http://127.0.0.1:8050/code_handle";
//http://127.0.0.1:8050
//https://api.weibo.com/oauth2/default.html
//https://tengrui.info:5443/weibo
var display = "default";
var tokenurl = "https://api.weibo.com/oauth2/access_token";

function login(){
    //授权微博,打开授权页面
    url = loginurl + "?display=" + display + "&client_id=" + appkey + "&redirect_uri=" + callbackurl;
    ipc.send("login",url);

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
    var token = server.post(tokenurl + "?client_id=" + appkey + "&client_secret=" + 
        appsecret + "&grant_type=authorization_code"+ "&code=" + code + "&redirect_uri=" + callbackurl,"");
    console.log(Promise.resolve(token));
    //关闭登录窗口
    //ipc.send("wbloginclose");
    //关闭数据库
    //sqlitedb.close();
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