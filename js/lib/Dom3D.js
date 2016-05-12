/**
 * Created by beens on 16/4/25.
 */



var Dom3D = function(opt){
    this.body = opt.body;


    this.init();
};
Dom3D.prototype = {
    init:function(){
        this.setBody();

    },
    setBody:function(){
        var main = $("<div></div>");
        this.screen = main;
        this.body.append(main);

        this.body.css({
            perspective:"500px",
            "perspective-origin":"50% 50%"
        });
        main.css({
            "transform-style":"preserve-3d",
            width:"100%",
            height:"100%",
            transform:"rotateY(45deg)"
        })
    },
    add:function(opt){
        var div = $("<div></div>"),
            container = opt.container || this.screen,
            translate = opt.translate || "0,0,0",
            scale = opt.scale,
            rotate = opt.rotate || "0,0,0",
            css = opt.css;

        rotate = rotate.split(",");
        var _rotate = "rotateX("+rotate[0]+") " + "rotateY("+rotate[1]+") " + "rotateZ("+rotate[2]+") ";

        div.css3(css).css3({
            transform:"translate3d("+translate+") " + _rotate
        });

        container.append(div);


    }
};



$(document).ready(function(){
    a = new Dom3D({
        body:$("#test3d")
    });
    //1
    a.add({
        css:{
            background:"#f00",
            width:"100px",
            height:"100px",
            position:"absolute",
            left:"50%",
            top:"50%",
            margin:"-50px 0 0 -50px"
        },
        translate:"0,0,0"
    });
    //2
    a.add({
        css:{
            background:"#000",
            width:"100px",
            height:"100px",
            position:"absolute",
            left:"50%",
            top:"50%",
            margin:"-50px 0 0 -50px"
        },
        translate:"0,0,100px"
    });
    //3
    a.add({
        css:{
            background:"#000fff",
            width:"100px",
            height:"100px",
            position:"absolute",
            left:"50%",
            top:"50%",
            margin:"-50px 0 0 -50px"
        },
        translate:"50px,0,50px",
        rotate:"0,90deg,0"
    });
    //4
    a.add({
        css:{
            background:"#000fff",
            width:"100px",
            height:"100px",
            position:"absolute",
            left:"50%",
            top:"50%",
            margin:"-50px 0 0 -50px"
        },
        translate:"-50px,0,50px",
        rotate:"0,90deg,0"
    });
    //5
    a.add({
        css:{
            background:"#abcdef",
            width:"100px",
            height:"100px",
            position:"absolute",
            left:"50%",
            top:"50%",
            margin:"-50px 0 0 -50px"
        },
        translate:"0,50px,50px",
        rotate:"90deg,0,0"
    });
    //6
    a.add({
        css:{
            background:"#fedcba",
            width:"100px",
            height:"100px",
            position:"absolute",
            left:"50%",
            top:"50%",
            margin:"-50px 0 0 -50px"
        },
        translate:"0,-50px,50px",
        rotate:"90deg,0,0"
    });
});