/* 
作者: RanAxro
github: 
功能: 
	用于个人主页
	兼容至 IE9- / Gecko 1.8 / Chrome 28- / WebKit 2004 
*/


/**
 * 获取设备DevicePixelRatio
 * @return { Number }
*/
function getDevicePixelRatio(){
	//标准api
	if(window.devicePixelRatio !== undefined) return window.devicePixelRatio;
	//IE9
	else if(window.screen.deviceXDPI && window.screen.logicalXDPI) return window.screen.deviceXDPI / window.screen.logicalXDPI;
	//webkit
	else if(window.webkitDevicePixelRatio !== undefined) return window.webkitDevicePixelRatio;
	else return 1;
}

//Cookie读写
/**
 * 设置Cookie键值对
 * @param { String } key 键
 * @param { String } value 值
 * @param { Number } days 数据保存的天数, 输入负数可删除键值对
*/
function setCookie(key, value, days){
	var d = new Date();
	d.setTime(d.getTime() + days * 8.64e+7);
	var expires = "expires=" + d.toGMTString();
	document.cookie = key + "=" + value + "; " + expires;
}
/**
 * 获取Cookie键值对
 * @param { String } key 键
 * @return { String } 返回对应的值
*/
function getCookie(key){
	var dataArray = document.cookie.split(";");
	for(var i = 0; i < dataArray.length; i++){
		var data = dataArray[i].replace(/^\s+|\s+$/g, "");
		if(data.indexOf(key) == 0) return data.substring((key + "=").length, data.length);
	}
}


/**
 * 获取数据类型
 * @param { any } value 需要获取的数据
 * @return { any } 返回数据类型
*/
function getType(value){
	var t = typeof value;
	// null
	if(value === null) return "Null";
	//undefined
	else if(value === void 0) return "Undefined";
	//function和其余原始类型
	else if(t === "function" || t !== "object") return t.charAt(0).toUpperCase() + t.slice(1);
	else return Object.prototype.toString.call(value).slice(8, -1);
}


Array.prototype.copy = function(){
	var res = [];
	for(var i = 0; i < this.length; i++) res[i] = this[i];
	return res;
}
//向量加法
Array.prototype.plus = function(value){
	var res = [];
	var type = getType(value);
	if(type == "Number"){
		for(var i = 0; i < this.length; i++){
			res[i] = this[i] + value;
		}
	}else if(type == "Array"){
		for(var i = 0; i < this.length; i++){
			res[i] = this[i] + value[i];
		}
	}
	return res;
}
//向量减法
Array.prototype.minus = function(value){
  var type = getType(value);
  if(type == "Number"){
    return this.plus(-value);
  }else if(type == "Array"){
    return this.plus(value.times(-1));
  }
  return this.copy();
}
//向量乘法
Array.prototype.times = function(value){
	var res = [];
	var type = getType(value);
	if(type == "Number"){
		for(var i = 0; i < this.length; i++){
			res[i] = this[i] * value;
		}
	}else if(type == "Array"){
		for(var i = 0; i < this.length; i++){
			res[i] = this[i] * value[i];
		}
	}
	
	return res;
}
//向量除法
Array.prototype.divided = function(value){
	var res = [];
	var type = getType(value);
	if(type == "Number"){
		for(var i = 0; i < this.length; i++){
			res[i] = this[i] / value;
		}
	}else if(type == "Array"){
		for(var i = 0; i < this.length; i++){
			res[i] = this[i] / value[i];
		}
	}
	return this;
}
//向量点乘
Array.prototype.dot = function(value){
	var type = getType(value);
	var res = 0;
	if(type == "Array"){
		for(var i = 0; i < this.length; i++){
			res += this[i] * value[i];
		}
	}
	return res;
}
//向量叉乘
Array.prototype.cross = function(value){
	var type = getType(value);
	if(type == "Array"){
		if(this.length == 2) return this[0] * value[1] - this[1] * value[0];
		else if(this.length == 3) return [this[1] * value[2] - this[2] * value[1], this[2] * value[0] - this[0] * value[2], this[0] * value[1] - this[1] * value[0]];
	}
	return this.copy();
}
//向量模长
Array.prototype.abs = function(){
	var res = 0;
	for(var i = 0; i < this.length; i++) res += this[i] * this[i];
	return Math.sqrt(res);
}
//向量归一化
Array.prototype.norm = function(protect){
	var sum = 0;
	if(this.length == 0) return [];
	for(var i = 0; i < this.length; i++) sum += this[i] * this[i];
	if(sum == 0){
		if(!protect) return this.copy();
		sum = protect;
	}
	sum = Math.sqrt(sum);
	var res = [];
	for(var i = 0; i < this.length; i++) res[i] = this[i] / sum;
	return res;
}
//求和
Array.prototype.sum = function(){
	var res = 0;
	for(var i = 0; i < this.length; i++){
		if(typeof this[i] === "number" && !isNaN(this[i])) res += this[i];
	}
	return res;
}


if(typeof Object.assign !== "function"){
	Object.definePropertie(Object, "assign", {
		value: function assign(target){
			'use strict';
			if(target === null || target === undefined){
				throw new TypeError("Cannot convert undefined or null to object");
			}
			var res = Object(target);
			for(var i = 1; i < arguments.length; i++){
				var next = arguments[i];
				if(next !== null && next !== undefined){
					for(var key in next){
						if(Object.prototype.hasOwnProperty.call(next, key)){
							res[key] = next[key];
						}
					}
				}
			}
			return res;
		},
		writable: true,
		configurable: true
	});
}


/**
 * 将rgb字符串类型转换为rgb数组类型
 * @param { String } SRgb "rgb(r, g, b)"
 * @return { Array } rgb数组
*/
function SRgbToARgb(SRgb){
	var res = [];
	rgb = SRgb.replace(/^\s+|\s+$/g, "").replace(/^rgb\s*\(\s*(.*)\s*\)$/i, "$1");  // 提取括号里的内容
	var parts = rgb.split(",");
	for(var i = 0; i < 3; i++) res[i] = parseInt(parts[i], 10);
	return res;
}
function ARgbToSRgb(ARgb){
	return "rgb(" + ARgb[0] + "," + ARgb[1] + "," + ARgb[2] + ")";
}
/**
 * 将hex字符串类型转换为rgb数组类型
 * @param { String } SHex "#FFF" | "FFF" | "#FFFFFF" | "FFFFFF"
 * @return { Array } rgb数组
*/
function SHexToARgb(SHex){
	SHex = SHex.replace(/^#/, "");
	var r, g, b;
	if(SHex.length == 3){
		SHex = SHex.charAt(0) + SHex.charAt(0) +
		      SHex.charAt(1) + SHex.charAt(1) +
		      SHex.charAt(2) + SHex.charAt(2);
	}
	if(SHex.length != 6) return null;
	r = parseInt(SHex.slice(0, 2), 16);
	g = parseInt(SHex.slice(2, 4), 16);
	b = parseInt(SHex.slice(4, 6), 16);
	return [r, g, b];
}
/**
 * 将hsl数组类型转换成rgb数组类型
 * @param { Array } AHsl [h, s, l]
 * @return { Array } [r, g, b]
*/
function AHslToARgb(AHsl){
	var ARgb = [0, 0, 0];
	function hue2rgb(p, q, t){
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1 / 6) return p + (q - p) * 6 * t;
		if(t < 1 / 2) return q;
		if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	}
	if(AHsl[1] == 0) ARgb[0] = ARgb[1] = ARgb[2] = Math.round(AHsl[2] * 255);
	else{
		var q = AHsl[2] < 0.5 ? AHsl[2] * (1 + AHsl[1]) : AHsl[2] + AHsl[1] - AHsl[2] * AHsl[1];
		var p = 2 * AHsl[2] - q;
		ARgb[0] = Math.round(hue2rgb(p, q, AHsl[0] + 1 / 3) * 255);
		ARgb[1] = Math.round(hue2rgb(p, q, AHsl[0]) * 255);
		ARgb[2] = Math.round(hue2rgb(p, q, AHsl[0] - 1 / 3) * 255);
	}
	return ARgb;
}
/**
 * 将rgb数组类型转换成hsl数组类型
 * @param { Array } ARgb [r, g, b]
 * @return { Array } [h, s, l]
*/
function ARgbToAHsl(ARgb){
	var AHsl = [0, 0, 0];
	var r = ARgb[0] / 255;
	var g = ARgb[1] / 255;
	var b = ARgb[2] / 255;
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	AHsl[0] = AHsl[1] = AHsl[2] = (max + min) * 0.5;
	if(max == min) AHsl[0] = AHsl[1] = 0;
	else{
		var d = max - min;
		AHsl[1] = AHsl[2] > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: AHsl[0] = (g - b) / d + (g < b ? 6 : 0); break;
			case g: AHsl[0] = (b - r) / d + 2; break;
			case b: AHsl[0] = (r - g) / d + 4; break;
		}
		AHsl[0] /= 6;
	}
	return AHsl;
}
/**
 * 获取颜色(rgb格式)灰度值
 * 算法: r:g:b = 0.299:0.587:0.114
 * @param { String | Array | Object } rgb rgb格式颜色, "rgb(r, g, b)" | [r, g, b] | {r: r, g: g, b: b}
 * @return { Number } 灰度值, 若传入非法参数则返回null
*/
function getRgbGray(rgb){
	var type = getType(rgb);
	if(type == "String"){
		var res = SRgbToARgb(rgb);
		return 0.299 * res[0] + 0.587 * res[1] + 0.114 * res[2];
	}
	if(type == "Array") return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
	if(type == "Object") return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
	return null;
}

// 矩阵乘法
function multiplyMatrices(a, b){
  return [
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    a[3] * b[0] + a[4] * b[1] + a[5] * b[2],
    a[6] * b[0] + a[7] * b[1] + a[8] * b[2]
  ];
}
// OKLCH 转 OKLab
function oklchToOklab(lch){
  var l = lch[0];
  var c = lch[1];
  var h = lch[2];
  var hRad = h * Math.PI / 180;
  var a = c * Math.cos(hRad);
  var b = c * Math.sin(hRad);
  return [l, a, b];
}
// OKLab 转 XYZ
function oklabToXyz(lab){
  var l = lab[0];
  var a = lab[1];
  var b = lab[2];
  var lmsG = multiplyMatrices([
    1.0, 0.3963377773761749, 0.2158037573099136,
    1.0, -0.1055613458156586, -0.0638541728258133,
    1.0, -0.0894841775298119, -1.2914855480194092
  ], [l, a, b]);
  var lms = [
    Math.pow(lmsG[0], 3),
    Math.pow(lmsG[1], 3),
    Math.pow(lmsG[2], 3)
  ];
  return multiplyMatrices([
    1.2268798758459243, -0.5578149944602171, 0.2813910456659647,
    -0.0405757452148008, 1.1122868032803170, -0.0717110580655164,
    -0.0763729366746601, -0.4214933324022432, 1.5869240198367816
  ], lms);
}
// XYZ 转线性 RGB
function xyzToLinearRgb(xyz){
  return multiplyMatrices([
    3.2409699419045226, -1.537383177570094, -0.4986107602930034,
    -0.9692436362808796, 1.8759675015077202, 0.04155505740717559,
    0.05563007969699366, -0.20397695888897652, 1.0569715142428786
  ], xyz);
}
// 线性 RGB 转 sRGB（带 gamma 校正）
function linearRgbToSrgb(rgb){
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];
  function gamma(c){
    if(c <= 0.0031308){
      return 12.92 * c;
    }else{
      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
  }
  return [
    Math.max(0, Math.min(1, gamma(r))),
    Math.max(0, Math.min(1, gamma(g))),
    Math.max(0, Math.min(1, gamma(b)))
  ];
}
// sRGB 转线性 RGB（逆 gamma 校正）
function srgbToLinearRgb(rgb){
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  function invGamma(c){
    if(c <= 0.04045){
      return c / 12.92;
    }else{
      return Math.pow((c + 0.055) / 1.055, 2.4);
    }
  }
  return [invGamma(r), invGamma(g), invGamma(b)];
}
// 线性 RGB 转 XYZ
function linearRgbToXyz(rgb){
  return multiplyMatrices([
    0.41239079926595934, 0.357584339383878, 0.1804807884018343,
    0.21263900587151027, 0.715168678767756, 0.07219231536073371,
    0.01933081871559182, 0.11919477979462598, 0.9505321522496607
  ], rgb);
}
// XYZ 转 OKLab
function xyzToOklab(xyz){
  var lms = multiplyMatrices([
    0.8190224379967030, 0.3619062600528904, -0.1288737815209879,
    0.0329836539323885, 0.9292868615863434, 0.0361446663506424,
    0.0481771893596242, 0.2642395317527308, 0.6335478284694309
  ], xyz);
  var lmsG = [
    Math.pow(lms[0], 1/3),
    Math.pow(lms[1], 1/3),
    Math.pow(lms[2], 1/3)
  ];
  return multiplyMatrices([
    0.2104542683093140, 0.7936177747023054, -0.0040720430116193,
    1.9779985324311684, -2.4285922420485799, 0.4505937096174110,
    0.0259040424655478, 0.7827717124575296, -0.8086757549230774
  ], lmsG);
}
// OKLab 转 OKLCH
function oklabToOklch(lab){
  var l = lab[0];
  var a = lab[1];
  var b = lab[2];
  var c = Math.sqrt(a * a + b * b);
  var h = 0;
  if(Math.abs(a) >= 0.0002 || Math.abs(b) >= 0.0002){
    h = (Math.atan2(b, a) * 180 / Math.PI) % 360;
    if(h < 0) h += 360;
  }else{
    h = 0; // 灰色，无色调
  }
  return [l, c, h];
}
// OKLCH 转 RGB
function oklchToRgb(lch){
  var lab = oklchToOklab(lch);
  var xyz = oklabToXyz(lab);
  var linearRgb = xyzToLinearRgb(xyz);
  var srgb = linearRgbToSrgb(linearRgb);
  return [
    Math.round(srgb[0] * 255),
    Math.round(srgb[1] * 255),
    Math.round(srgb[2] * 255)
  ];
}
// RGB 转 OKLCH
function rgbToOklch(rgb){
  var linearRgb = srgbToLinearRgb(rgb);
  var xyz = linearRgbToXyz(linearRgb);
  var lab = xyzToOklab(xyz);
  return oklabToOklch(lab);
}

/**
 * 为颜色(rgb数组)生成副色
 * @param { Array } rgb [r, g, b]
 * @return { Array } 副色
*/
function generateSecondaryColor(rgb){
	var gray = getRgbGray(rgb);
	var oklch = rgbToOklch(rgb);
	oklch[0] += gray < 128 ? 0.1 : -0.1;
	var res = oklchToRgb(oklch);
	return res;
}
/**
 * 为颜色(rgb数组)生成对比色
 * @param { Array } rgb [r, g, b]
 * @return { Array } 对比色
*/
function generateContrastingColor(rgb){
	var gray = getRgbGray(rgb);
	var oklch = rgbToOklch(rgb);
	oklch[0] = (oklch[0] + 0.5) % 1;
	var res = oklchToRgb(oklch);
	return res;
}


/**
 * 线性插值
 * @param { Number } value 初始值
 * @param { Number } v 速率
 * @param { Number } final 终值
*/
function linear(value, v, final){
	this.value = value;
	this.v = v;
	this.final = final || value;
}
linear.prototype.setFinal = function(final){
	this.final = final;
	return this;
}
linear.prototype.run = function(delta){
	var d = this.v * delta;
	d = d > 1 ? 1 : d;
	this.value = this.value + d * (this.final - this.value);
	return this.value;
}
