/**
 * User: bens
 * Date: 13-3-25
 * Time: 下午12:56
 *
 * sqlite使用
 *
 * var mysqlite = new DEVICE.sqlite(dbname,size);
 * @param dbname:str  数据库名称  默认名：newDb
 * @param size：number  数据库大小  默认2m
 *
 * ==============================================================================
 * fn： 都是用的事务，失败会自动回滚
 *
 * @批量建表（建表时会自动创建 tablename_id 的自增id）
 * mysqlite.createTable(datas)
 *
 * datas={
      tableName:array              表名 ["tablename","tablename"]
      fields:array                 字段名 [["name","password"],["name","password"]]
      success:function             事务成功回调
      error:function               事务失败回调,返回错误原因（失败会回滚）
 * }
 *
 * @批量删除表
 * mysqlite.dropTable(datas)
 *
 * datas={
      tableName:array              表名 ["tablename","tablename"]
      fields:array                 字段名 [["name","password"],["name","password"]]
      success:function             事务成功回调
      error:function               事务失败回调,返回错误原因（失败会回滚）
   }
 *
 * @单个表批量插入数据
 * mysqlite.insertRow(datas)
 *
 * datas={
      tableName:str               表名 "tablename"
      fields:array                字段名 ["name","password"]
      values:array                插入的数据 [["aa","123"],["bb","222"],["cc","333"]]
      success：function           事务成功回调
      error:function              事务失败回调,返回错误原因（失败会回滚）
   }
 *
 * @插入单条数据并返回id
 * mysqlite.insertRowBackId(datas)
 *
 * datas={
      tableName:str               表名 "tablename"
      fields:array                字段名 ["name","password"]
      values:array                插入的数据 ["cc","333"]
      success：function           事务成功回调,返回id  (默认是 tablename_id)
      error:function              事务失败回调,返回错误原因（失败会回滚）
   }
 *
 * @执行单个sql语句，一般是select
 * mysqlite.exec(datas)
 *                                                    limit:获取数据条数  offset：第2条开始
 //datas={
      sql:str                     sql语句 "select * from tablename"
      success：function           事务成功回调,返回结果集 result
      error:function              事务失败回调,返回错误原因（失败会回滚）
   }
 *
 * 记录长度：result.rows.length  具体信息：result.rows.item(i).fieldname
 //          result是success返回
 //分页用sql：select  name as id from test order by test_id  limit 1 offset 2
 //
 *
 * @在事务里面批量执行一堆sql 不输出记录集时用
 * mysqlite.execs(datas)
 *
 * datas={
      sql:array                   sql语句 ["select * from tablename","select * from tablename"]
      success：function           事务成功回调
      error:function              事务失败回调,返回错误原因（失败会回滚）
   }

 */


(function(){
    var sqlite=function(dbname,size){
        //if(!window.openDatabase){return;}

        this.dbName=dbname || "newDb";
        this.size=size || 2;

        this.db=null;   //db obj

        this.init();
    };
    sqlite.prototype={
        //初始化数据库
        init:function(){
            //初始化原生的html5数据库
            this.db = openDatabase(this.dbName, '3.0', 'database for ' + this.dbName, this.size * 1024 * 1024);

        },
        createTable:function(datas){
            var tableName = datas.tableName,
                fields = datas.fields,
                callBack = datas.success,
                error = datas.error;


            callBack = (typeof(callBack) == "function")? callBack : function(){};
            error = (typeof(error) == "function")? error : function(){};
            if($.isArray(tableName) && tableName.length!=0  ){}else{ error("tableName参数错误"); return;}
            if($.isArray(fields) && fields.length!=0  ){}else{ error("fields参数错误"); return;}
            if(tableName.length != fields.length){ error("参数错误"); return; }

            this.db.transaction(function (tx) {
                for(var i= 0,l=tableName.length;i<l;i++){
                    var pkField = tableName[i] + "_id",
                        sql = "CREATE TABLE IF NOT EXISTS " + tableName[i] + "( " + pkField + " integer primary key autoincrement,";

                    sql += fields[i].join(",") + ")";
                    tx.executeSql(sql);
                }
            },function(err){ error(err.message); },callBack )
        },
        dropTable:function (datas) {
            var tableName = datas.tableName,
                success = datas.success,
                error = datas.error;

            success = (typeof(success) == "function")? success : function(){};
            error = (typeof(error) == "function")? error : function(){};
            if($.isArray(tableName) && tableName.length!=0  ){}else{ error("tableName参数错误"); return;}


            this.db.transaction(function (tx) {
                for(var i= 0,l=tableName.length;i<l;i++){
                    var sql = "DROP TABLE IF EXISTS " + tableName[i];
                    tx.executeSql(sql);
                }
            },function(err){ error(err.message); },success)
        },
        insertRow:function (datas) {
            var tableName = datas.tableName,
                fields = datas.fields,
                values = datas.values,
                callback = datas.success,
                error = datas.error;

            callback = (typeof(callback) == "function")? callback : function(){};
            error = (typeof(error) == "function")? error : function(){};
            if( !tableName ){ error();return;}
            if( $.isArray(fields) && fields.length!=0 ){}else{ error();return;}
            if( $.isArray(values) && fields.length!=0){}else{ error();return;}

            this.db.transaction(function (tx) {
                for(var i= 0,l=values.length;i<l;i++){
                    var sql = "INSERT INTO " + tableName + " (" + fields.join(",") + ") SELECT "
                        + new Array(values[i].length + 1).join(",?").substr(1);
                    tx.executeSql(sql,values[i]);
                }
            },function(err){ error(err.message); },callback);
        },
        insertRowBackId:function (datas) {
            var tableName = datas.tableName,
                fields = datas.fields,
                values = datas.values,
                callback = datas.success,
                error = datas.error;

            callback = (typeof(callback) == "function")? callback : function(){};
            error = (typeof(error) == "function")? error : function(){};
            if( !tableName ){ error();return;}
            if( !$.isArray(fields)){ error();return;}
            if( !$.isArray(values)){ error();return;}


            var sql = "INSERT INTO " + tableName + " (" + fields.join(",") + ") SELECT "
                + new Array(values.length + 1).join(",?").substr(1);

            this.db.transaction(function (tx) {
                tx.executeSql(sql, values, function () { }, error);
                tx.executeSql("SELECT max(" + tableName + "_id) as id from " + tableName, [], function (tx, result) {
                    var item = result.rows.item(0);
                    var id = item.id;
                    callback(id);
                }, error);
            });
        },
        exec:function(datas){
            var sql = datas.sql,
                callback = datas.success,
                error = datas.error;



            var reg = new RegExp("'undefined'","g");
            sql = sql.replace(reg, null);

            callback = (typeof(callback) == "function")? callback : function(){};
            error = (typeof(error) == "function")? error : function(){};
            if( !sql ){ error();return;}

            this.db.transaction(function (tx) {
                tx.executeSql(sql, [], function(tx,result){
                    callback(result);
                }, function(tx,e){
                    error(e);
                });
            })
        },
        execs:function(datas){
            var sql = datas.sql,
                callback = datas.success,
                error = datas.error;

            callback = (typeof(callback) == "function")? callback : function(){};
            error = (typeof(error) == "function")? error : function(){};
            if( $.isArray(sql) && sql.length!=0){}else{ error();return;}

            this.db.transaction(function (tx) {
                for(var i= 0,l=sql.length;i<l;i++){

                    var thissql = sql[i];
                    var reg = new RegExp("'undefined'","g");
                    thissql = thissql.replace(reg, null);

                    tx.executeSql(thissql);
                }
            },function(err){ error(err.message); },callback)
        }
    };

    DEVICE.sqlite = sqlite;

})();