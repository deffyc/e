    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyTRange;
    window.IDBCursor = window.IDBCursor || window.webkitIDBCursor || window.msIDBCursor;

    function openDB(dbObj, callback) {
        var version = dbObj.version || 1;
        var request = window.indexedDB.open(dbObj.name, version);
        
        callbackFlag = true
        request.onerror = function(e) {
            console.log(e.currentTarget.error.message);
            //alert(e.currentTarget.error.message)
        };
        request.onsuccess = function(e) {
            dbObj.db = e.target.result;
            if (dbObj.db) {
                callback()
            }
        };
        request.onupgradeneeded = function(e) {
            dbObj.db = e.target.result;
            //alert('DB version changed to ' + version)
            for (var i = 0; i < dbObj.storeArr.length; i++) {
                if (!dbObj.db.objectStoreNames.contains(dbObj.storeArr[i]["name"])) {
                    var store = dbObj.db.createObjectStore(dbObj.storeArr[i]["name"], dbObj.storeArr[i]["params"]); //{keyPath: 'id' }
                    indexArr = dbObj.storeArr[i]["indexArr"]
                    for (var j = 0; j < indexArr.length; j++) {
                        //indexName,keyName,unique=true|false
                        console.log(indexArr[j]["name"]+": "+indexArr[j]["target"])
                        store.createIndex(indexArr[j]["name"], indexArr[j]["target"] ? indexArr[j]["target"] : indexArr[j]["name"], {
                            unique: indexArr[j]["unique"]
                        });
                        
                    }
                    console.log('createObjectStore： ' + dbObj.storeArr[i]["name"]);
                }
            }
            //alert('DB version changed to ' + version)
            console.log('DB version changed to ' + version);
        };
    }

    function closeDB(db) {
        db.close();
    }

    function deleteDB(name) {
        indexedDB.deleteDatabase(name);
    }

    function addData(db, storeName, data) {
        var transaction = db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        store.add(data);
    }

    function addDatas(db, storeName, arr) {
        var transaction = db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        for (var i = 0; i < arr.length; i++) {
            request = store.add(arr[i]);
            request.onerror = function() {
                console.error('add添加数据库中已有该数据')
                console.error(arr[i])
            };
            request.onsuccess = function() {
                console.log('add添加数据已存入数据库')
            };
        }
    }

    function putDatas(db, storename, data) {
        //添加数据，重复添加会更新原有数据
        var store = store = db.transaction(storename, 'readwrite').objectStore(storename),
            request;
        for (var i = 0; i < data.length; i++) {
            request = store.put(data[i]);
            request.onerror = function() {
                console.error('put添加数据库中已有该数据')
                console.error(arr[i])
            };
            request.onsuccess = function() {
                console.log('put添加数据已存入数据库')
            };
        }
    }

    function getDataByKey(db, storeName, key, callback) {
        var transaction = db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        var request = store.get(key);
        request.onsuccess = function(e) {
            callback(e.target.result)
        };
        request.error = function(e) {
            callback(null)
            console.log(e);
        };
    }

    function updateData(db, storeName, data) {
        var transaction = db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        var request = store.put(data);
        request.onsuccess = function(e) {
            console.log('数据更新成功')
        };
        request.error = function(e) {
            console.log(e);
            console.log('数据更新失败');
        };
    }
    

    function deleteDataByKey(db, storeName, key) {
        var transaction = db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        store.delete(key);
    }

    function clearObjectStore(db, storeName) {
        var transaction = db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        store.clear();
    }

    function deleteObjectStore(db, storeName) {
        var transaction = db.transaction(storeName, 'versionchange');
        db.deleteObjectStore(storeName);
    }

    function fetchStoreByCursor(db, storeName, keyRange, callback) {
        var transaction = db.transaction(storeName);
        var store = transaction.objectStore(storeName);
        var request = store.openCursor(keyRange, "prev");
        request.onsuccess = function(e) {
            var cursor = e.target.result;
            callback(cursor);
            if (cursor) {
                cursor.
                continue ();
            }
        };
        request.error = function(e) {
            callback(null)
            console.log(e);
        };
    }

    function getDataByIndex(db, storeName, indexName, indexVlue, callback) {
        var transaction = db.transaction(storeName);
        var store = transaction.objectStore(storeName);
        var index = store.index(indexName);
        request=index.get(indexVlue)
        request.onsuccess = function(e) {
            callback(e.target.result);
        }
        request.error = function(e) {
            //callback(null)
            console.log(e);
        };
    }

    function getMultipleData(db, storeName, indexName, keyRange, callback) {
        var transaction = db.transaction(storeName, 'readwrite');
        var store = transaction.objectStore(storeName);
        var index = store.index(indexName);
        var request = index.openCursor(keyRange, "next");
        request.onsuccess = function(e) {
            var cursor = e.target.result;
            callback(cursor);
            if (cursor) {
                cursor.
                continue ();
            }
        }
        request.error = function(e) {
            callback(null)
            console.log(e);
        };
    }

    var myDB = {
        name: 'xinxin4',
        version: 1,
        db: null,
        storeArr: [{
                "name": "books",
                "params":{"keyPath": 'id', "autoIncrement": false},
                "indexArr": [ {
                        "name": "id",
                        "unique": true
                    }, {
                        "name": "name",
                        "unique": false
                    }, {
                        "name": "sortNum",
                        "unique": false
                    }, {
                        "name": "createdAt",
                        "unique": false
                    }, {
                        "name": "updatedAt",
                        "unique": false
                    }, {
                        "name": "USM",
                        "unique": false
                    }
                ]
            }, {
                "name": "articles",
                "params":{"keyPath": 'id', "autoIncrement": false},
                "indexArr": [{
                        "name": "id",
                        "unique": true
                    }, {
                        "name": "bookId_no",
                        "target": ["bookId", "no"],
                        "unique": true
                    }, {
                        "name": "bookId",
                        "unique": false
                    }, {
                        "name": "title",
                        "unique": false
                    }, {
                        "name": "sortNum",
                        "unique": false
                    }, {
                        "name": "createdAt",
                        "unique": false
                    }, {
                        "name": "updatedAt",
                        "unique": false
                    }, {
                        "name": "USM",
                        "unique": false
                    }
                ]
            }
        ]
    };

    function GetQueryString(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    
    //判断字符是否为空的方法
    function isEmpty(obj){
        if(typeof(obj) == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }