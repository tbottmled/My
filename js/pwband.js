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
      return false;
    });
});