// layui.use('util', function(){
//     var util = layui.util;
//     util.fixbar({
//       bar1: true,
//       bgcolor: '#393D49',
//       click: function(type){
//         console.log(type);
//         if(type === 'bar1'){
//           alert('点击了bar1')
//         }
//       }
//     });
//   });

layui.use('form', function(){
    var form = layui.form;
    //监听提交
    form.on('submit(AddPwform)', function(data){
      layer.msg(JSON.stringify(data.field));
      sqlitedb.insertData(data.field);
      return false;
    });
});