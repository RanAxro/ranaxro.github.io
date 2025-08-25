//视角辅助线
function ui_homeAL(){
	new box("homeAL", {
		t: 0,
		viewAngle: 2 * PI / 3,  //竖直视角
		finalLen: 5,  //视点离loadding的最远距离
		aniTime: 2,  //动画运行时长
		blockLen: 0,  //格子大小
	}, {
		lineWidth: function(){return 0.003 * h < 1 ? 0.003 * h : 1},  //辅助线线宽
		blockLen: function(){return 0.3 * h},  //各自大小
		viewLen: function(viewAngle){return 0.5 * h / Math.tan(0.5 * viewAngle)},  //视距: 当前视点离屏幕的距离
		aniCurve: function(t){return t < 1 ? 0.5 - 0.5 * Math.cos(PI * t) : 1},  //动画曲线
		objectLen: function(viewLen, j, aniCurve){return viewLen + (j.finalLen * h - viewLen) * aniCurve(j.t / j.aniTime)},  //物距: 当前视点离loadding的距离
		loadingBoxRatio: function(viewLen, objectlen){return viewLen / objectlen;},  //loading缩小的倍数
		cast: function(a, b, c, viewLen, objectLen){  //将点投射到屏幕上
			var x, y;
			var t = viewLen / (objectLen - b);
			x = a * t;
			y = 0.5 * h * (1 - t) + c * t;
			return [x, y];
		}
	}, function(delta){
		var j = this.vars;
		j.t += delta;
		if(j.t > j.aniTime) j.t = j.aniTime;
		
		//初始化数据
		var viewLen = this.attr.viewLen(j.viewAngle);
		var objectLen = this.attr.objectLen(viewLen, j, this.attr.aniCurve);
		boxs.loading.vars.ratio = this.attr.loadingBoxRatio(viewLen, objectLen);
		var lw = this.attr.lineWidth();
		var blockLen = this.attr.blockLen(); j.blockLen = blockLen;
		
		// 绘制水平线
		var vertQ = Math.ceil((objectLen - viewLen) / blockLen);
		for(var i = 0; i < vertQ; i++){
			var b = i * blockLen;
			var pos = this.attr.cast(0, b, 0, viewLen, objectLen);
			ctx.strokeStyle = color.anti;
			ctx.lineWidth = lw;
			ctx.beginPath();
			ctx.moveTo(0, h - pos[1]);
			ctx.lineTo(w, h - pos[1]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(0, pos[1]);
			ctx.lineTo(w, pos[1]);
			ctx.stroke();
			ctx.closePath();
		}
		
		// 绘制竖直线
		var horiQ = Math.ceil(0.5 * w * objectLen / viewLen / blockLen);
		for(var i = 0; i < horiQ; i++){
			var a = (0.5 + i) * blockLen;
			var pos1 = this.attr.cast(a, 0, 0, viewLen, objectLen);
			var pos2 = this.attr.cast(a, objectLen - viewLen, 0, viewLen, objectLen);
			ctx.strokeStyle = color.anti;
			ctx.lineWidth = lw;
			ctx.beginPath();
			ctx.moveTo(0.5 * w + pos1[0], h - pos1[1]);
			ctx.lineTo(0.5 * w + pos2[0], h - pos2[1]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(0.5 * w - pos1[0], h - pos1[1]);
			ctx.lineTo(0.5 * w - pos2[0], h - pos2[1]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(0.5 * w + pos1[0], pos1[1]);
			ctx.lineTo(0.5 * w + pos2[0], pos2[1]);
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(0.5 * w - pos1[0], pos1[1]);
			ctx.lineTo(0.5 * w - pos2[0], pos2[1]);
			ctx.stroke();
			ctx.closePath();
		}

	}, function(box){
		setTimeout(navBack, 700)
	})
}




//导航栏背景
function navBack(){
	//滚动文字
	var textArray = [];  //储存text对象
	var textCount = 0;  //计数器, 控制text对象要显示的字符为什么
	var textSymbol = ["R", "a", "n"];  //字符列表
	function text(){
		this.deg = 0;  //旋转过的角度
		this.v = 0.3;  //旋转速度
		this.maxV = 300;  //最大旋转速度
		this.isFirst = true;  //是否为第一个字符
		this.topText = textSymbol[textCount];  //在顶部显示的字符
		this.BottomText = textSymbol[textSymbol.length - 1 - textCount];  //在底部显示的字符
		textArray.push(this);
		textCount = (textCount + 1) % textSymbol.length;  //更新计数器
	}
	text.prototype.run = function(delta, r, place, x, y, alpha){
		var v = this.v * w;
		if(v > this.maxV) v = this.maxV;
		
		var R = r - 0.6 * place;
		var d = v * delta;
		var beta = d / R;
		this.deg = this.deg + beta;
		ctx.fillText(this.topText, x + R * Math.cos(HPI - 0.5 * alpha + this.deg), -y + R * Math.sin(HPI - 0.5 * alpha + this.deg));
		ctx.fillText(this.BottomText, x - R * Math.cos(HPI - 0.5 * alpha + this.deg), h + y - R * Math.sin(HPI - 0.5 * alpha + this.deg));
		
		//生成新字符
		if(this.deg > 0.8 * place / R && this.isFirst){
			this.isFirst = false;
			new text();
		}
		//旋转完成后删除
		if(this.deg > 2 * alpha) textArray.shift();
	}
	
	//滚动字符区背景
	new box("navBack", {
		t: 0,
		place: 0.2,  //背景最小高度
		aniTime: 0.7,  //动画时长
		maxTheta: PI / 4,  //最大圆心角
		maxArc: 50  //背景最大高度与最小高度差值的最大值
	}, {
		
	}, function(delta){
		var j = this.vars;
		
		j.t = j.t + delta;
		if(j.t > j.aniTime) j.t = j.aniTime;
		
		//数学原理见推导
		var p = j.place * h;
		var x = 0.5 * w;
		var y = p < j.maxArc ? x * x / p - 1.25 * p : 0.5 * x * x / j.maxArc - 0.5 * j.maxArc - p;
		var theta = 2 * Math.atan2(x, y + p);
		if(theta > j.maxTheta){
			theta = j.maxTheta;
			y = x / Math.tan(0.5 * theta) - p;
		}
		var r = y + 1.5 * p;
		var alpha = 2 * Math.atan2(x, y);
		
		//绘制中部背景
		if(j.t > 0.5 * j.aniTime){
			var place2 = 0.5 * h;
			var r2 = Math.sqrt(x * x + (y + 0.5 * h) * (y + 0.5 * h));
			ctx.fillStyle = color.main;
			ctx.beginPath();
			ctx.moveTo(x, -y);
			ctx.arc(x, -y, r2, HPI - 0.5 * alpha, HPI - 0.5 * alpha + alpha * (2 * j.t / j.aniTime - 1));
			ctx.moveTo(x, h + y);
			ctx.arc(x, h + y, r2, 3 * HPI - 0.5 * alpha, 3 * HPI - 0.5 * alpha + alpha * (2 * j.t / j.aniTime - 1));
			ctx.fill();
			ctx.closePath();
		}
		
		//绘制顶部与底部背景
		ctx.fillStyle = color.anti;
		ctx.beginPath();
		ctx.moveTo(x, -y);
		ctx.arc(x, -y, r, HPI - 0.5 * alpha, HPI - 0.5 * alpha + alpha * j.t / j.aniTime);
		ctx.moveTo(x, h + y);
		ctx.arc(x, h + y, r, 3 * HPI - 0.5 * alpha, 3 * HPI - 0.5 * alpha + alpha * j.t / j.aniTime);
		ctx.fill();
		ctx.closePath();
		
		//绘制文字
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color.vice;
		ctx.font = p + "px Calibri";
		ctx.beginPath();
		for(var i = 0; i < textArray.length; i++){
			textArray[i].run(delta, r, p, x, y, alpha)
		}
		ctx.closePath();
		
	}, function(){
		new text();
		setTimeout(portrait, 700)
		setTimeout(function(){
			boxs.loading.remove();
			boxs.homeAL.remove();
		}, 2000)
	});
}


//头像
function portrait(){
	var e = document.getElementById("portrait")
	new box("portrait", {
		t: 0,
		aniTime: 1
	}, {
		size: function(minLen){return 0.3 * minLen + "px";},  //头像大小
		top: function(minLen){return 0.5 * h - 0.15 * minLen + "px";},
		left: function(minLen){return 0.5 * w - 0.15 * minLen + "px";},  //动画曲线
		aniCurve: function(t){return t * t}
	}, function(delta){
		var j = this.vars;
		var k = this.attr;
		var s = e.style;
		j.t += delta;
		if(j.t > j.aniTime) j.t = j.aniTime;
		
		var minLen = w < h ? w : h;
		s.width = k.size(minLen);
		s.height = k.size(minLen);
		s.top = k.top(minLen);
		s.left = k.left(minLen);
		s.opacity = k.aniCurve(j.t / j.aniTime);
		
	}, function(){
		e.style.display = "block";
		setTimeout(opt, 100);
	})
}


//导航选项
function opt(){
	var i = 0;  //当前处理的导航id
	var dt = 0.1;  //延迟加载
	var f = [
		{
			title: ["项目", "project"],
			icon: "0000000000000000000000000000000000000001111110000000000100001000000001111110100000000100001010000001111110101000000100001010100000010000101110000001000010100000000100001110000000010000100000000001111110000000000000000000000000000000000000000000000000000000",
			link: "page/project.html",
			isRight: false
		},
		{
			title: ["设置", "setting"],
			icon: "0000000000000000000000000000000000000000000000000000111001110000000100100100100000010010010010000001111001111000000000000000000000000000000000000001111001111000000100100100100000010010010010000000111001110000000000000000000000000000000000000000000000000000",
			link: "",
			isRight: true
		},
		{
			title: ["demo", "demo"],
			icon: "0000000000000000000000000000000000011111110000000001000000100000000100000001000000010111100100000001000000010000000101111101000000010000000100000001011111010000000100000001000000010000000100000001111111110000000000000000000000000000000000000000000000000000",
			link: "",
			isRight: false
		},
		{
			title: ["更多", "more"],
			icon: "0000000000000000000000000000000000000000000000000001111111110000000000000000000000000000000000000000000000000000000111111111000000000000000000000000000000000000000000000000000000011111111100000000000000000000000000000000000000000000000000000000000000000000",
			link: "",
			isRight: true
		},
		{
			title: ["游戏", "game"],
			icon: "0000000000000000000000111100000000000010010000000000001001000000000000100100000000000001100000000111100000011110010001000010001001000100001000100111100000011110000000011000000000000010010000000000001001000000000000100100000000000011110000000000000000000000",
			link: "",
			isRight: false
		},
		{
			title: ["联系", "contact"],
			icon: "0000000000000000000000000000000000000000000000000000000000000000000111111111000000010000000100000001000000010000000101010101000000010000000100000001000000010000000110111111000000000100000000000000000000000000000000000000000000000000000000000000000000000000",
			link: "",
			isRight: true
		}
	];
	
	//将二进制icon转换为img
	function convertImgData(bits){
		var canvas = document.createElement("canvas");
		canvas.width = 16;
		canvas.height = 16;
		var ctx = canvas.getContext("2d");
		
		var x, y;
		for(var i = 0; i < 256; i++){
			x = i % 16;
			y = (i / 16) | 0;
			if(bits.charAt(i) == "0") continue;
			ctx.fillStyle = color.anti;
			ctx.fillRect(x, y, 1, 1);
		}
		return canvas.toDataURL("image/png");
	}
	
	//创建element
	function createEle(){
		new box("navOpt_" + f[i].title[1], {
			size: 0.07,  //icon高度
			data: f[i],
			t: 0,
			aniTime: 1,  //动画时长
			border: new linear(0, 10, 0)  //指针悬停的动画边框
		}, {
			size: function(minLen){return 0.3 * minLen + "px";},
			top: function(minLen){return 0.5 * h - 0.15 * minLen + "px";},
			left: function(minLen){return 0.5 * w - 0.15 * minLen + "px";},
			aniCurve: function(t){return t * t}
		}, function(delta){
			var j = this.vars;
			var s = j.box.style;
			j.t += delta;
			if(j.t > j.aniTime) j.t = j.aniTime;
			
			//主题改变时更改icon
			theme.get(function(){
				j.img.src = convertImgData(j.data.icon);
			})
			var minLen = w < h ? w : h;
			s.width = j.size * minLen + 60 + "px";
			s.height = j.size * minLen + "px";
			s.top = 0.5 * h + (j.id - Math.ceil(0.5 * f.length)) * 0.05 * h + "px";
			var x = 0.5 * w - 0.3 * minLen - j.size * h - 60;
			var d = 20 * (1 - Math.sin(HPI * j.t / j.aniTime));
			if(j.data.isRight){
				s.right = (x > 0 ? x : 0.1  * w) - d + "px";
			}else{
				s.left = (x > 0 ? x : 0.1  * w) - d + "px";
			}
			s.opacity = j.t / j.aniTime;
			
			j.title.style.left = j.size * (minLen + 0.3) + "px";
		  j.title.style.lineHeight = s.height;
			j.title.style.color = color.anti;
			j.title.style.fontSize = 0.05 * minLen > 16 ? "16px" : 0.05 * minLen + "px";
			
			//指针悬停时绘制边框
			if(j.border.value > 0.01){
				var x = j.box.getBoundingClientRect().left;
				var y = j.box.getBoundingClientRect().top;
				var ew = j.box.offsetWidth;
				var eh = j.box.offsetHeight;
				ctx.beginPath();
				ctx.moveTo(x - 5, y + 0.5 * eh * (1 - j.border.value));
				ctx.lineTo(x - 5, y + 0.5 * eh * (1 + j.border.value));
				ctx.moveTo(x + ew + 5, y + 0.5 * eh * (1 - j.border.value));
				ctx.lineTo(x + ew + 5, y + 0.5 * eh * (1 + j.border.value));
				ctx.lineWidth = 3;
				ctx.strokeStyle = color.vice;
				ctx.stroke();
				ctx.closePath();
			}
			
			j.border.run(delta);
		}, function(box){
			box.vars.id = i;
			
			/*
				box
				 | img
				 | title
			*/
			var Ebox = document.createElement("div"); box.vars.box = Ebox;
			var Eimg = document.createElement("img"); box.vars.img = Eimg;
			var Etitle = document.createElement("div"); box.vars.title = Etitle;
			Ebox.classList.add("nav_box");
			Eimg.classList.add("nav_img");
			Etitle.classList.add("nav_title");
			Ebox.appendChild(Eimg);
			Ebox.appendChild(Etitle);
			Ebox.onmouseenter = function(){
				box.vars.border.setFinal(1);
			}
			Ebox.onmouseleave = function(){
				box.vars.border.setFinal(0);
			}
			Ebox.onclick = function(){
				if(!box.vars.data.link) return ;
				openIframe(box.vars.data.link);
			}
			document.body.appendChild(Ebox);
			
			Eimg.src = convertImgData(box.vars.data.icon);
			Etitle.innerText = box.vars.data.title[lang];
		});
		
		i++;
		if(i >= f.length) return 0;
		setTimeout(createEle, dt * 1000);
	}
	createEle();
	
}
