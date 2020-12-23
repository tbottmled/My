var httprequest = require('../js/httpserver.js').server;
var server = new httprequest();
const ipc = require('electron').ipcRenderer;

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
    server.respone();
    url = loginurl + "?display=" + display + "&client_id=" + appkey + "&redirect_uri=" + callbackurl;
    ipc.send("login",url)
    //获取token
    var data = {};
    data.client_id = "2110492170";
    data.client_secret = "6d623742beb0d11d930e5fbb91d82cae";
    data.grant_type = "authorization_code";
    data.code = code;
    redirect_uri = "http://127.0.0.1:8050/code_handle";
    server.post("https://api.weibo.com/oauth2/access_token",data);
    //关闭登录窗口
}