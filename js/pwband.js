var SqliteDB = require('../js/db.js').SqliteDB;
var sqlitedb = new SqliteDB('my.db');
layui.use('form', function(){
    var form = layui.form;
    //监听提交
    form.on('submit(AddPwform)', function(data){
      var insertTileSql = "insert into password (bandname,cardnum,password,content) values(?, ?, ?, ?);";
      var arr = new Array(4);
      arr[0] = data.field.name;
      arr[1] = data.field.num;
      arr[2] = data.field.password;
      arr[3] = data.field.desc;
      var arrdata = new Array(arr);
      console.log(arrdata);
      sqlitedb.insertData(insertTileSql,arrdata);
      layer.msg("成功保存~");
      sqlitedb.close();
      return false;
    });
});

//读取密码,初始化列表
function Read_Init()
{
  var querySql = 'select * from password';
  var queryData = null;
  sqlitedb.queryData(querySql,dealdata);
  // var cmdconent = {"cmdtype":"100","data":""};
  // $.ajax({
  //     url: 'http://localhost:8520/',
  //     type: "POST",
  //     contentType: "application/json;charset=UTF-8",//设置请求头信息
  //     dataType:"json",
  //     data: JSON.stringify(cmdconent),
  //     success: function (data) {
  //       var ul = document.getElementById("pwlist");  
  //       var li = document.createElement("li");
                     
  //       var a = document.createElement("a");
  //       var i = document.createElement("i");
  //       i.innerHTML = "&#xe683; 3";//步骤名称
  //       ul.appendChild(li);
  //       li.appendChild(a)
  //       a.appendChild(i);
  //         // $.each(data, function (index, item) {
  //         //     $('#pwlist').append("3");//动态生成列表
  //         // });
  //     }
  // });
}

function dealdata(objects){
  var ul = document.getElementById("pwlist");
  objects.forEach(object => {
    var li = document.createElement("li");
    li.classList.add("layui-nav-item","layui-nav-itemed");
    li.style  = "-webkit-app-region: no-drag";     
    li.id = object.pw_id;    
    //li.click.bind     
    li.onclick= "nav('./pwdetail.html')";
    var a = document.createElement("a");
    a.style = "font-size:17px;color: black;";
    a.href = "javascript:;";
    var i = document.createElement("i");
    i.style = "font-size:17px;color: black;";
    i.classList.add("layui-icon");
    i.innerHTML = "&#xe683; " + object.bandname;//密码名称
    ul.appendChild(li);
    li.appendChild(a)
    a.appendChild(i);
  });
}

function nav(src){
  const webview = document.getElementById('secondappcontent');
  webview.src = src;
}
