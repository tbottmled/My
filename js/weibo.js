var httprequest = require('../js/httpserver.js').server;
var server = new httprequest();

var loginurl = "https://api.weibo.com/oauth2/authorize";
var appkey = "2110492170";
var appsecret = "6d623742beb0d11d930e5fbb91d82cae";
var callbackurl= "https://api.weibo.com/oauth2/default.html";
var display = "client";

function login(){
    url = loginurl + "?display=" + display + "&client_id=" + appkey + "&redirect_uri=" + callbackurl;
    var data = server.get(url);
    console.log(data);
    //nav(data);
}

function nav(data){
    var webview = document.getElementById('weibocontent');
    webview.innerHTML = data;
}