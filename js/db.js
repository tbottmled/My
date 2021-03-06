var DB = {};
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

DB.SqliteDB = function(file){
    DB.db = new sqlite3.Database(file);
    DB.exist = fs.existsSync(file);
    if(!DB.exist){
        console.log("Creating db file!");
        fs.openSync(file, 'w');
    };
};
 
DB.printErrorInfo = function(err){
    console.log("Error Message:" + err.message + " ErrorNumber:" + errno);
};
 
DB.SqliteDB.prototype.createTable = function(sql){
    DB.db.serialize(function(){
        DB.db.run(sql, function(err){
            if(null != err){
                DB.printErrorInfo(err);
                return;
            }
        });
    });
};
 
/// tilesData format; [[column0, column1, column2, column3,...], [column0, column1, column2, column3,...]]
DB.SqliteDB.prototype.insertData = function(sql, objects){
    DB.db.serialize(function(){
        var stmt = DB.db.prepare(sql);
        for(var i = 0; i < objects.length; ++i){
            stmt.run(objects[i]);
        }
        stmt.finalize();
    });
};
 
DB.SqliteDB.prototype.queryData = function(sql, callback){
    DB.db.all(sql, function(err, rows){
        if(null != err){
            DB.printErrorInfo(err);
            return;
        }
        /// deal query data.
        if(callback){
            callback(rows);
        }
    });
};

DB.SqliteDB.prototype.selectAll = function select_user(sql,data){
    DB.db.each(sql, function(err, rows){
		if(!err){
            data += rows;
		} else {
			throw err;
		}
    });
}

DB.SqliteDB.prototype.executeSql = function(sql){
    DB.db.run(sql, function(err){
        if(null != err){
            DB.printErrorInfo(err);
        }
    });
};
 
DB.SqliteDB.prototype.close = function(){
    DB.db.close();
};
 
/// export SqliteDB.
//exports.SqliteDB = DB.SqliteDB;
module.exports.SqliteDB = DB.SqliteDB;