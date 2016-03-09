/**
 * Created by beens on 15/10/28.
 */



    //当增加了历史记录时
    //并且点击后退按钮才会促发该事件
    // 注意：直接访问或刷新该页面时，由于popstate不会触发。因此需要手动获取参数去请求数据，同$(document).ready 后执行的操作
/*
    window.addEventListener("popstate", function() {
        //获取历史数据
        var currentState = history.state;

        //由于已经保存数据。可以省略ajax直接显示数据
        //do something


    });
*/


    //替换当前的历史记录
    //data 存储 ajax获取的数据集对象
/*
    history.replaceState(data, "标题", url);
*/

    //增加历史记录
    //data 存储 ajax获取的数据集对象
    // 注意：直接访问或刷新该页面时，由于popstate不会触发。因此需要手动获取参数去请求数据
/*
    history.pushState(data, "标题", url);
*/










