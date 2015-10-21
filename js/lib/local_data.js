/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 15-8-6
 * Time: 上午11:31
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//本地缓存
//DEVICE.localData.setItem(key,val);
//DEVICE.localData.getItem(key);
//DEVICE.localData.removeItem(key);
DEVICE.localData = {
	userData: null,
	name: location.hostname,
	init: function () {
		if (!this.userData) {
			try {
				this.userData = document.createElement('INPUT');
				this.userData.type = "hidden";
				this.userData.style.display = "none";
				this.userData.addBehavior("#default#userData");
				document.body.appendChild(this.userData);
				var expires = new Date();
				expires.setDate(expires.getDate() + 365);
				this.userData.expires = expires.toUTCString();
			} catch (e) {
				return false;
			}
		}
		return true;

	},
	setItem: function (key, value) {
		if (window.localStorage) {
			window.localStorage[key] = value;
		} else {
			if (this.init()) {
				this.userData.load(this.name);
				this.userData.setAttribute(key, value);
				this.userData.save(this.name);
			}
		}

	},
	getItem: function (key) {
		if (window.localStorage) {
			return window.localStorage[key];
		} else {
			if (this.init()) {
				this.userData.load(this.name);
				return this.userData.getAttribute(key)
			}
		}

	},
	removeItem: function (key) {
		if (window.localStorage) {
			window.localStorage.removeItem(key);
		} else {
			if (this.init()) {
				this.userData.load(this.name);
				this.userData.removeAttribute(key);
				this.userData.save(this.name);
			}
		}
	}
};