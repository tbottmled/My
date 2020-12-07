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
  sqlitedb.selectAll(querySql,queryData);
  console.log(queryData);

  var ul = document.getElementById("pwlist");  
  var li = document.createElement("li");
                     
  var a = document.createElement("a");
  var i = document.createElement("i");
  i.innerHTML = "&#xe683; 3" + queryData[0].bandname;//步骤名称
  ul.appendChild(li);
  li.appendChild(a)
  a.appendChild(i);

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

// window.onload =function() { 
//   var querySql = 'select * from password';
//   var queryData = null;
//   sqlitedb.selectAll(querySql,queryData);
//   console.log(queryData);

//   var ul = document.getElementById("pwlist");  
//         var li = document.createElement("li");
                     
//         var a = document.createElement("a");
//         var i = document.createElement("i");
//         i.innerHTML = "&#xe683; 3" + queryData[0].bandname;//步骤名称
//         ul.appendChild(li);
//         li.appendChild(a)
//         a.appendChild(i);
// };
