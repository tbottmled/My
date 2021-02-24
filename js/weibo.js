//主线程/渲染线程通信
const wbipc = require('electron').ipcRenderer;

//获取http服务
const httpserver = require('../js/httpserver.js').server;
const server = new httpserver();

var DB = require('../js/db.js').SqliteDB;
var sdb = new DB('my.db');

//wbipc.send('httpserver-req', 'httpserver');
// wbipc.on('httpserver-res', (event, arg0) => {
//   console.log("from main");
//   console.log(arg0);
//   server = arg0;
//   console.log(server);
//   //server.prototype.post(tokenurl + "?client_id=" + appkey + "&client_secret=" + appsecret + "&grant_type=authorization_code"+ "&code=" + code + "&redirect_uri=" + callbackurl,"")
// });

//获取数据库服务
// var DB = require('../js/db.js').SqliteDB;
// var sdb = new DB('my.db');
//wbipc.send('DB-req', 'DB');
// wbipc.on('DB-res', (event, arg1) => {
//   console.log(arg1);
//   sdb = arg1;
// });

// const httpserver = require('../js/httpserver.js').server;
// const server = new httpserver();
const wbpath = require('path');
//localstorage
const locstorage = require('electron-localstorage');
//locstorage.setStoragePath(path.join(__dirname, 'restore.json'));

//登录参数
var code = "";
var loginurl = "https://api.weibo.com/oauth2/authorize";
var appkey = "2110492170";
var appsecret = "6d623742beb0d11d930e5fbb91d82cae";
var callbackurl= "http://127.0.0.1:8050/code_handle";
var display = "default";
var tokenurl = "https://api.weibo.com/oauth2/access_token";
var home_line = "https://api.weibo.com/2/statuses/home_timeline.json";

function login(){
  //查询登录信息token是否过期
  var QuerySql = "select * from userinfo;";
  sdb.queryData(QuerySql,dealdata);  
}

function dealdata(objects){
  objects.forEach(
    object => {
      if(object.token === null){

        //授权微博,打开授权页面
        url = loginurl + "?display=" + display + "&client_id=" + appkey + "&redirect_uri=" + callbackurl;
        console.log(url);
        wbipc.send("login",url);

        var token;
        code = locstorage.getItem('code');
        console.log(code);
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
            sdb.insertData(insertTileSql,arrdata);
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('登录成功!');
              });
            //关闭数据库
            sdb.close();
        }).then(() => {
          //关闭登录窗口
          wbipc.send("wbloginclose");
          //获取
          console.log(token);
          server.get(home_line + "?access_token=" + token).then(result => {
              console.log(result);
              //wbipc.send("weibo");
              //dealweibo(result);
          });
        })    
      }else{
        layui.use('layer', function(){
          var layer = layui.layer;
          layer.msg('登录成功!');
        });
        console.log(object);
            server.get(home_line + "?access_token=" + object.token).then(result => {
                console.log(result);
                //wbipc.send("weibo");
                dealweibo(result);
            });
        sdb.close();
      }
    }
  )
}

//解析weibo内容
function dealweibo(res){
  var wbcintainer = document.getElementById("wbcintainer");
  var content = JSON.parse(res);
  if(content.statuses !== undefined){
    content.statuses.forEach(element => {
      console.log(element.created_at);
      var div = document.createElement("div");
      div.classList.add("layui-card");
      div.style  = "-webkit-app-region: no-drag";
      //weibo head,name
      var divhead = document.createElement("div");
      divhead.classList.add("layui-card-header");
      var imghead = document.createElement("img");
      imghead.src = element.user.profile_image_url;
      var spanhead = document.createElement("span");
      spanhead.style = "font-size:x-large;";
      spanhead.innerHTML = element.user.screen_name;
      var spanremark = document.createElement("span");
      spanremark.style = "font-size:x-small;";
      spanremark.innerHTML = element.user.description;
      divhead.appendChild(imghead);
      divhead.appendChild(spanhead);
      divhead.appendChild(spanremark);
      div.appendChild(divhead);
      //weibo content
      var divcontent = document.createElement("div");
      divcontent.classList.add("layui-card-body");
      divcontent.style = "color: black";
      var divtext = document.createElement("div");
      divtext.innerHTML = element.text;
      var divimg = document.createElement("img");
      divimg.src = element.thumbnail_pic;
      divcontent.appendChild(divtext);
      divcontent.appendChild(divimg);
      div.appendChild(divcontent);

      wbcintainer.appendChild(div);
    });
  }
}

layui.use('element', function(){
    var element = layui.element;
    
    //一些事件监听
    element.on('tab(demo)', function(data){
      console.log(data);
    });
});