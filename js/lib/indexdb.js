/**
 * Created by beens on 15/11/17.
 */



//indexdb库（个人理解为key，value数据库）
//未严格测试。。。


//-----------------------------------------------------------
//实例化
//var db = new DEVICE.indexdb();


//-----------------------------------------------------------
//db.close();         //关闭数据库
//db.delStore(name);  //删除某个表  @param:Str
//db.delDataBase();   //删除整个数据库



//-----------------------------------------------------------
//创建并打开数据库
//db.create({
//    name:"test",  //@param:str  数据库名称
//    ver:24,       //@param:number 数据库版本号，只能增加
//    stores:[      //@param:array  要创建的数据库表，索引
//        {
//            name:"test_store",      //@param:str  表名
//            index:["email","name"], //@param:array/str 索引字段名
//            unique:[true,false]     //@param:array/bool 值是否唯一
//        },
//        {
//            ...
//        }
//    ],
//    upgradeneed:function(){     //@param:fn  数据库版本变更时执行
//        console.log(123)
//
//        //a.delStore("test_store");
//
//    },
//    success:function(){         //@param:fn  创建或打开数据库后执行
//        console.log("open ok");
//
//    },
//    error:function(e){           //@param:fn   创建或打开数据库失败后执行
//        console.log(e);
//    }
//});


//-----------------------------------------------------------
//批量添加数据（事务，失败自动回滚，其他接口也是事务）
//var data = [
//    {id:1,name:"11",email:"a5"},
//    {id:2,name:"11",email:"a6"}
//];
//db.add({
//    name:"test_store", //@param:str 要添加数据的表名
//    key:"email",       //@param:str 主键使用数据中的哪个字段的值
//    val:data,           //@param:array/json  要添加的记录
//    success:function(){ //@param:fn   事务成功回调
//        console.log("add ok");
//    },
//    error:function(e){  //@param:fn   事务失败回调
//        console.log("add err");
//        console.log(e);
//    }
//});


//-----------------------------------------------------------
//获取数据
//db.get({
//    name:"test_store",   //@param:str 要获取数据的表名
//    key:"a4",            //@param:str 要获取数据的key值
//                                   // 为空获取整个表的所有数据
//    success:function(rs){ //@param:fn   事务成功回调
//                          //rs： array/json  返回查询到的数据
//        console.log(rs);
//    },
//    error:function(e){   //@param:fn   事务失败回调
//        console.log("add err");
//        console.log(e);
//    }
//})



//-----------------------------------------------------------
//通过索引获取数据(需要先建索引才能使用)
//db.getByIndex({
//    name:"test_store",      //@param:str 要获取数据的表名
//    index:"name",           //@param:str 要获取数据的表的索引名
//    range:["11","3"],       //@param:array 索引值的范围（取字母头2位大于等于11，字母头1位小于等于3）
//                                        //  索引前面的值必须小于后面的值,是按字符顺序大小计算 3大于11
//    success:function(rs){       //@param:fn   事务成功回调
//        console.log(rs);        //rs： array/json  返回查询到的数据
//    },
//    error:function(e){          //@param:fn   事务失败回调
//        console.log("add err");
//        console.log(e);
//    }
//})



//-----------------------------------------------------------
//update数据
//注意：更新会根据制定的key字段获取值后去覆盖表中的key字段的值，如果表中没有这个key则新增数据
//     如果是表中key字段使用的值的字段(email)变更，则老数据还会存在，只是增加一条新数据
//     如果要批量更改不同条件组合出来的数据，需要先通过索引查询出所有数据在调用该方法。

//var data = [
//    {id:1,name:"11",email:"a5"},
//    {id:2,name:"11",email:"a6"}
//];
//db.put({
//    name:"test_store", //@param:str 要修改数据的表名
//    key:"email",       //@param:str 主键使用数据中的哪个字段的值
//    val:data,           //@param:array/json  要修改的记录
//    success:function(){ //@param:fn   事务成功回调
//        console.log("put ok");
//    },
//    error:function(e){  //@param:fn   事务失败回调
//        console.log("put err");
//        console.log(e);
//    }
//})



//-----------------------------------------------------------
//delete数据
//db.delete({
//    name:"test_store",   //@param:str  要删除数据的表名
//    key:["a4","a5"],     //@param:array 要删除数据的key的值
//    success:function(){//@param:fn   事务成功回调
//        console.log("del ok");
//    },
//    error:function(e){//@param:fn   事务失败回调
//        console.log("del err");
//        console.log(e);
//    }
//})


//-----------------------------------------------------------
//删除某个表的所有数据
//db.deleteAll({
//    name:"test_store",      //@param:str  要删除数据的表名
//    success:function(){     //@param:fn   事务成功回调
//        console.log("delall ok");
//    },
//    error:function(e){      //@param:fn   事务成功回调
//        console.log("delall err");
//        console.log(e);
//    }
//})









(function(){
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

    var db = function(){
        this.db = null;
        this.name = null;
    };

    db.prototype = {
        //创建库，完成后创建表
        create:function(opt){
            var db_name = opt.name || "test",
                ver = opt.ver || 1,
                success = opt.success || function(){},
                error = opt.error || function(){},
                upgradeneed = opt.upgradeneed || function(){},
                stores = opt.stores || [],
                _this = this,
                open_request = window.indexedDB.open(db_name,ver);

            this.name = db_name;

            open_request.onsuccess = function(e){
                _this.db = e.target.result;
                success();
            };

            open_request.onerror = function(e){
                error(e);
            };
            //更新
            open_request.onupgradeneeded = function(e){
                _this.db = e.target.result;

                upgradeneed();

                _this.createStore({
                    stores:stores
                });
            };
            open_request.onversionchange = function(){
                _this.close();
                alert("程序已更新，点击确定重新载入页面！");
                window.location.reload();
            };
        },
        //创建表
        createStore:function(opt){
            var stores = opt.stores;

            for(var i= 0,l=stores.length;i<l;i++){
                var this_store_name = stores[i].name,
                    this_store_index = stores[i].index || [],
                    this_store_unique = stores[i].unique || [];

                //检查表是否存在
                if(!this.db.objectStoreNames.contains(this_store_name)){
                    //创建表
                    var this_store = this.db.createObjectStore(this_store_name,{autoIncrement:true});
                    //创建索引
                    for(var z= 0,zl=this_store_index.length;z<zl;z++){
                        var that_index = this_store_index[z],
                            that_unique = this_store_unique[z];
                        this_store.createIndex(that_index,that_index, {unique:that_unique});
                    }
                }
            }
        },
        //增加数据
        add:function(opt){
            var name = opt.name,
                type = "readwrite",
                key = opt.key,
                val = opt.val,
                success = opt.success,
                error = opt.error;

            var transaction = this.db.transaction([name],type),
                store = transaction.objectStore(name);

            for(var i= 0,l=val.length;i<l;i++){
                var this_val = val[i],
                    this_key = this_val[key];

                store.add(this_val,this_key);
            }



            transaction.oncomplete=(function(){
                success();
            });
            transaction.onerror = function(e){
                error(e);
            };

        },
        //获取单条或全部数据
        get:function(opt){
            var name = opt.name,
                type = "readonly",
                key = opt.key,
                success = opt.success,
                error = opt.error,
                backData = [];

            var transaction = this.db.transaction([name],type),
                store = transaction.objectStore(name),
                request;


            if(key){
                //取指定的数据
                request = store.get(key);
            }else{
                //取所有数据
                request = store.openCursor();
            }

            request.onsuccess = function(rs){
                rs = rs.target.result;

                if(key){
                    //取指定数据
                    backData.push(rs);
                }else{
                    //取所有数据
                    if(rs) {
                        backData.push(rs.value);
                        rs.continue();
                    }
                }



            };
            transaction.onerror = function(e){
                error(e);
            };
            transaction.oncomplete = function(){
                success(backData);
            };
        },
        //通过索引获取数据
        getByIndex:function(opt){
            var name = opt.name,
                type = "readonly",
                key = opt.index,
                range = opt.range,
                success = opt.success,
                error = opt.error,
                backData = [];

            var transaction = this.db.transaction([name],type),
                store = transaction.objectStore(name),
                index = store.index(key),
                _range = IDBKeyRange.bound(range[0],range[1]),
                request = index.openCursor(_range);



            request.onsuccess = function(rs){
                rs = rs.target.result;
                console.log(rs);
                //取所有数据
                if(rs) {
                    backData.push(rs.value);
                    rs.continue();
                }
            };
            transaction.onerror = function(e){
                error(e);
            };
            transaction.oncomplete = function(){
                success(backData);
            };
        },
        //更新数据,如果key不存在会添加数据(在key变更后会存在这个情况，新旧数据同时存在)
        put:function(opt){
            var name = opt.name,
                type = "readwrite",
                key = opt.key,
                val = opt.val,
                success = opt.success,
                error = opt.error;

            var transaction = this.db.transaction([name],type),
                store = transaction.objectStore(name);

            for(var i= 0,l=val.length;i<l;i++){
                var this_val = val[i],
                    this_key = this_val[key];

                store.put(this_val,this_key);
            }



            transaction.oncomplete=(function(){
                success();
            });
            transaction.onerror = function(e){
                error(e);
            };
        },
        //删除数据
        delete:function(opt){
            var name = opt.name,
                type = "readwrite",
                key = opt.key,
                success = opt.success,
                error = opt.error;

            var transaction = this.db.transaction([name],type),
                store = transaction.objectStore(name);

            for(var i= 0,l=key.length;i<l;i++){
                var this_key = key[i];
                store.delete(this_key);
            }


            transaction.onerror = function(e){
                error(e);
            };
            transaction.oncomplete = function(){
                success();
            };
        },
        //删除表内所有数据
        deleteAll:function(opt){
            var name = opt.name,
                type = "readwrite",
                success = opt.success,
                error = opt.error;

            var transaction = this.db.transaction([name],type),
                store = transaction.objectStore(name);

            store.clear();

            transaction.onerror = function(e){
                error(e);
            };
            transaction.oncomplete = function(){
                success();
            };
        },
        //关闭数据库
        close:function(){
            this.db.close();
        },
        //删除表
        delStore:function(name){
            if(this.db.objectStoreNames.contains(name)){
                this.db.deleteObjectStore(name);
            }
        },
        //删除整个数据库
        delDataBase:function(){
            this.close();
            indexedDB.deleteDatabase(this.name);
        }
    };

    DEVICE.indexdb = db;

})();


