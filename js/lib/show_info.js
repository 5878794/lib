/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-9-7
 * Time: 上午4:30
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */




DEVICE.info = (function(){
	var device = DEVICE;
	var info={
		box:null,
		img:null,
		text:null,
		isExist:false,
		isRun:false,
		fn:null,
		scale:1,
		errimg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVdJREFUeNq0V1tsVFUUXee+pnc6MI8+qC3QViiNJlVERVHUH0pi5ENifaQGgx8m/miM8UMMfmiMmpiY+IFRA0ow9scaEh8hxoQPUDAa5FFjKG3BCh2h05l2ptNO587ce9z70g5M53V/3MlJ7uxz9lpn77P3PmeE1J9GJZE0ppDFeZnCbzKBizJtTMPqcYBOmoosLksowKUQjKGP7RELHkU4FYgTsHBaTuOkjKtjcrbfgrPThNobgS/QKHyoh+qum4ONKZml9dl0BvZRA8rgOrFi4M38Obsqsa09VaRwyM8LMo1fZAynML1TgXivC4Hue0UEXWIFGkDQECU2vNERsvudInMBs8Ok2/OJPXq4InH+JmLyCufkDJFOmZcxf2gdAn0PiEZ0E2Hdooe1ZIEiMCxncUJOYQzpwTXwP/eqfTpTQpzTnizs+iyRUmjbksh9f4cIbbxfNLgeFklrGKK7DWJdy/U8GLsKOTwBRKeLlsXJjV9lnB05E4S+42X7j4mb5xXHJQXtMo0hpEzay5EtonHjI6IZYSJdml8aMmBCvLgdyr4X3MHfrFu+jm0Zg7EY83PtPnMZsUSMAnQeKYb9qksEejaJMIVWcaOwfNjjk1B23EOWwh38zbpyaxmDsRiTsUs8/lvO83d/I3w77xQhUPa6pVRuxLNzgKHdQKBv1lVaz1iMydhfaw/2F4gnydsZWIYPylsdVCR0HmV3X/DYDWSxsK6aDWMyNnP8oD3sJo1y1VmAkNgVkNr6VtqfI2WNUZrJrKtlx9jMQVy7F0PtcDh2R4RB+xJVd740Sog92DB2A3H4oe5iG01ARKhGtzRQIBwPdepU0Hmxpa6HedhbTqrbIpomxGYdispJUM6bct5V8riWMIcpVDUHZ7NGpJ1+N4ulB1OUXSU9ErMwF9VQp6ZJETQWaxaeQl3GY+mdmLmoNQc1jQ5dXUwqL5IvW07eiZmLORUVSlIRSknLqzQSoBPKZG94a+XdvuzVnrlcTkrzS1IjYuGtLOghgGMfHiwQH/vgAN/FnmyZg7mYU4ybj0cgxCQ0RZXphZqhiiKDU/RAOEP9jmUjQrib+jE3iJqvjkAdnZVDJyObxXjTMxQ667gS9G+1own8n6K2RuAk53/umP3mIU3yLiC/hE/fKg0qKzqzaqKtboR+2xro1GC5V+ZGJpA7fwX5aLy6t3yx+HQqZn3AxXFmM1BC9QedvP260hLuzP8Tq2xN16BYYSL02hPw925yVenDJ5B442DNnFZbwhRheUmEAgdcqFwiBakKi663vSLoB2hUSxBrYqpAylL/2GZkL/5bvbcTJmNLXd3bfmG/df2SkA5yMUqUleYATXyrda6CNMtfjZwXY7lkSdcazc1UJGUsF5OwO4b3DxSCxyHKT6eRj6cg/L5nRTgwZGxYTWdhlL3Yr2VSOP7RoQLx0fc/c2u73FrGYCzGZOyiM/8T2wvn5+tqg96+qk2przuSi8Z7rOErsGfSRR5OUDmdplIaQtLtQj10zd9FJdWCuuIzDQVgdK+G3tow5MwtPNr+47tFjz0xtETMP3QNRlcrjFtvCWiNwS/ysZk+ayQKa/waZDbn7R8CZa6+thm+DW3QmkKD+ank8+3fvZ0uWXcOvSWZa7SvIkPabXtzH2neyceS3dZoFLnLMdipOZQ8Q8hGXVkPfU0TDCozrSk4Sto9bZ++Mlhxg2eXE98cKgKh8KsE1C80tU/m7F7q06ZDf1aWIsAeKvS8VUxfRujqT9J2BvOTMwNrB/ZU/wtzBtuqzJIn4cD1CLiehExhGreTfj3NBhdXJalAR2XG+qtt30sZr13sPwEGAJ9VE3aPBYcqAAAAAElFTkSuQmCC",
		okimg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBtJREFUeNqslk+ME1Ucx79v5s1Ot9tu9x+VIqgBVDTRcOHIQQ7EhLh6ABOPnA3cPJgYj8YbnDDcPZgQTTyQbJSbNz2QCBxwyWq6LgLWdlraTufPe8/fzL5pXodZtrvhJd9MOzPvfeb33u8fm+lit8GMKzP+Z0MZgnEtHHwXUCKrQMxYXBZI7QTmU4C4lqOv2X3oxQUpzkkUWF4IzGC2AXG1ZrR4DpgAQlKgFWoJrYlt5jvAMtAsqbwgrdpqn589HNtnXfBDZeW8oaCkz+IHQ0TNLS5ufV+N13ym+vS+rxXodSegzHAay4CVSHOk6icdfPh6bF1a5q805uyD4KxkeIuCUCP040doiebmfUddubGANXqUgAekESnSUGkCWQ5WKUksXnyMLxqcX1hx3obFOEbSQ0CKpJ9OcqwyStYCXJJQIVrhPTyU8tvrB/E1Pe5psK+hqTPZ9ucT1rnastrFTXxZt3FhceY4gbroRk0MRCuFCRWnSn77wiN16IstlO06WNR+97iHuds1/Gac49hzE6BpXXJm1Y+aOH9E4NLC7CGEcoAhgRILdhoygathCnX5PCy/f7I2xPr6PP4yvDaFWsb5pY5SjVBr9HDZoo2NaKGB7KRXYXxukZJ3+rKNWAkkc1/18JkrUNG7NvZsy4i55KZ7+k+ccxjqjlWhreoiljFZgKmUvOuLHhy7Alrj5TMbOKdDyclYeaBT7eG05W4vEMlwalimSAbp1SJEzcOZXOwybgDTYOdDnMRy8rWCtkdh70OB0VxFq9k+3splJ8bz6UwFWBFSW4f9jUjpnQlxIJ9/n8mlYYw4jim+HfFsXZhyCHKciCKPJHZK3uNEGwq0gxHqzNUnvJ9Npa2hNUBrPclVkBSYwdKsP1LYGPVR5xT+trNPCynyAsoxQ4b7Og6lGYfKKDFhZx4/DT36QV8Yi2R79qZkTkDJbEBreBX8oitHnAdmZSZYfwdr/adoDdp0g16Vcg9hkTgbzRn8R0l0gK17p3BTA6N8ppH6ZuAtodVawrXeQ5rY3l5gKqgB6/0DtJbxjV9GV5epzEJkyXuiZ3l0DA+W7uCI6uHNJHDYzLZjKzZZxjONYS2g2wTaNr67vYrr9OiprhZZQVYmcGK0j+LXyl28JP7FCcpYYGYLRRSlrRJ01gEVot4WwShVezZu/H4eX0k7tW5owOTzCvCsLlOVEz/g4+rf+LRUxkppkfIUpWPubk+IabNCgvmdNAyedF/D1T9W8aO27LkFuKjFKGUtxmwbi4d/xgelx3jPHuGoJdBID55jS7jY8Bu4tfk+bgbVsVVZixHlGqoJYFETlTVOZiNla5neHRlNVAbKd2+FXZsyGh9leG+ov5prmNmXmm1ilA/03drEfCdt9p2WAXuhjXARWLyoVv9/AQYAzRaQFve6TfoAAAAASUVORK5CYII=",
		show:function(text,isok){
			if(this.isRun){
				this.list.push({text:text,isok:isok});
				return;
			}
			this.isRun=true;

			//            if(!this.box){
			this.createObj();
//            }


			var that=this;

			that.text.text(text);
			if(isok){
//                that.img.myCss({
//                    background:"url("+that.okimg+")",
//                    "background-size":"100% 100%"
//                });
				that.img.get(0).style.background = "url("+that.okimg+") no-repeat";
				that.img.css(device.fixObjCss({
					"background-size":22*this.scale+"px "+22*this.scale+"px"
				}));
			}else{
//                that.img.myCss({
//                    background:"url("+that.errimg+")",
//                    "background-size":"100% 100%"
//                });
				that.img.get(0).style.background = "url("+that.errimg+") no-repeat";
				that.img.css(device.fixObjCss({
					"background-size":22*this.scale+"px "+22*this.scale+"px"
				}));
			}

			var temp_height = parseInt(that.box.height());
			that.box.css(device.fixObjCss({display:"box","margin-top":-temp_height/2+"px",opacity:1}));


//            var cssobj = {opacity:0.9};
//            cssobj[device.transform] = device.css_s+"0,-60pt"+device.css_e;
//            cssobj = {
//                opacity:1
//            };


//            that.box.cssAnimate(cssobj,300,function(){
			that.fn=setTimeout(function(){
				that.hide();
				if(that.list.length!=0){
					setTimeout(function(){

						var data=that.list.shift();
						that.show(data.text,data.isok);
					},1000);
				}
			},2000);
//            })

		},
		createObj:function(){
			var box = document.createElement("div"),
				info = document.createElement("div"),
				img = document.createElement("div"),
				text = document.createElement("div"),
				$box = $(box),
				$info = $(info),
				$img = $(img),
				$text = $(text);

			$box.css(device.fixObjCss({
//                height:"30pt",
				width:"100%",
				"z-index":"100000",
				"position":"fixed",
				left:"0",
				top:"50%",
				"margin-top":"-15pt",
				display:"none",
				opacity:"0",
				"justify-content":"center",
				"align-items":"center"

			}));

			$info.css(device.fixObjCss({
//                height:"30pt",
				"border-radius":5*this.scale+"pt",
				background:"#333",
				color:"#eee",
				"padding":"0 "+7*this.scale+"pt",
				"max-width":320*this.scale+"px",
				"box-sizing":"border-box",
				"box-align":"center",
				display:"box",
				"flex-direction":"row",
				"box-shadow":"0 0 "+2*this.scale+"pt "+2*this.scale+"pt #aaa",
				"align-items":"center"
			}));

			img.style.cssText += "width:"+16*this.scale+"pt;height:"+16*this.scale+"pt;padding:0 "+7*this.scale+"px;";
			$text.css(device.fixObjCss({
				"padding":10*this.scale+"px "+7*this.scale+"px "+10*this.scale+"px 0",
//                height:"30pt",
				"flex":"1",
				"line-height":20*this.scale+"pt",
				"font-size":12*this.scale+"pt"
//                "text-overflow":"ellipsis",
//                "white-space":"nowrap",
//                overflow:"hidden"
			}));

			$info.append($img);
			$info.append($text);
			$box.append($info);
			$("html").append($box);

			this.box = $box;
			this.text = $text;
			this.img = $img;
		},
		hide:function(){
			if(this.box){
//                var cssobj = {
//                    display:"none",
//                    opacity:0
//                };
//                cssobj[device.transform] = "";
//                var _this = this;
//                setTimeout(function(){
//                    _this.box.css(cssobj);
//                },0);
				this.box.remove();
				this.box = null;
				this.text = null;
				this.img = null;
				this.isRun=false;
			}
		},
		list:[]
	};

	return info;
})();