"use strict";DEVICE.arrayFunction=function(array,fn,callback){array=JSON.parse(JSON.stringify(array));var run=function run(){if(array.length==0){callback();}else{var param=array.shift();runner(param);}};var runner=function runner(param){fn(param,run);};run();};

//# sourceMappingURL=arrayFunction-compiled.js.map