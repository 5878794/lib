/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午11:23
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//获取适合容器的图片大小
DEVICE.getNewImageSize = function(imgwidth,imgheight,objwidth,objheight){
	var newimgwidth,newimgheight;

	if(!imgwidth || !imgheight){
		return {
			width:objwidth,
			height:objheight
		}
	}


	if(imgwidth>0 && imgheight>0){
		if(imgwidth/imgheight>=objwidth/objheight){
			if(imgwidth>objwidth){
				newimgwidth = objwidth;
				newimgheight = imgheight*objwidth/imgwidth;
			}else{
				newimgwidth = imgwidth;
				newimgheight = imgheight;
			}
		}else{
			if(imgheight>objheight){
				newimgheight = objheight;
				newimgwidth = imgwidth*objheight/imgheight;
			}else{
				newimgwidth = imgwidth;
				newimgheight = imgheight;
			}
		}
	}else{
		newimgwidth = objwidth;
		newimgheight = objheight;
	}


	return {
		width:newimgwidth,
		height:newimgheight
	}
};
