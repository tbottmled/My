var httprequest = require('./js/httpserver.js').server;
var server = new httprequest();
const ipc = require('electron').ipcRenderer;
function pw(){
    ipc.send("pw");
}
function addpw(){
    ipc.send("addpw");
}
function weibo(){
    server.respone();
    ipc.send("weibo");
}
function newClose(){
    ipc.send("newClose");
}
function nav(src_str){
    console.log(src_str);
    const webview = document.getElementById('appcontent');
    webview.src = src_str;
}

