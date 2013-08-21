var Interface = (function() {
	
	var colours = ['Crimson','Orange','Gold','Yellow','GreenYellow','LimeGreen','LightSkyBlue','RoyalBlue','Indigo','Violet'];
	var cvs,ctx;
	var sliders = [
		{
			name: "tempo",
			value: 0.6,
			id: 0
		},
		{
			name: "blend",
			value: 0.5,
			id: 1
		},
		{
			name: "hyperactivity",
			value: 0.4,
			id: 2
		},
		{
			name: "zoom",
			value: 0.6,
			id: 3
		},
		{
			name: "sloppiness",
			value: 0.1,
			id: 4
		},
		{
			name: "toms",
			value: 0.25,
			id: 5
		},
		{
			name: "percussion",
			id: 6
		},
		{
			name: "pitch",
			id: 7
		}
	]
	
	var slidersObj = {};
	var mouseIsDown = false;
	
	function init(phpParams) {
		// initialise param values from stored values if available
		if(phpParams !== false) {
			$.each(sliders,function(i,val) {
				if(phpParams[val.id] !== undefined) {
					val.value = phpParams[val.id];
				} else {
					val.value = Config.defaultParams[val.name];
				}
				$.jStorage.set(val.name,val.value);
			});
		} else {
			var storedVal;
			$.each(sliders,function(i,val) {
				storedVal = $.jStorage.get(val.name);
				if(storedVal === null) {
					val.value = Config.defaultParams[val.name];
				} else {
					val.value = storedVal;
				}
			});
		}
		
		cvs = $('#screen')[0];
		cvs.width = window.innerWidth;
		cvs.height = window.innerHeight - 100;
		window.onresize = function() {
			cvs.width = window.innerWidth;
			cvs.height = window.innerHeight - 100;
		}
		ctx = cvs.getContext('2d');
		
		$.each(sliders,function(i,val) {
			if(!val.value) val.value = 0;
			slidersObj[val.name] = val;
		});
		
		function drawCall() {
			draw();
			setTimeout(drawCall,20);
		}
		setTimeout(drawCall,4000);
		var logoImg = new Image();
		logoImg.onload = onLogoLoad;
		logoImg.src = "graphics/logo.png";
		function onLogoLoad() {
			ctx.drawImage(logoImg,0.25*cvs.width,0.5*cvs.height - 0.4*(logoImg.height/logoImg.width) * cvs.width,0.5*cvs.width,0.5*(logoImg.height/logoImg.width) * cvs.width);
		}
		
		$('body').keydown(function(ev) {
			if(ev.which === 32) {
				Tap.tap();
				var tempo = Tap.getTempo();
				if(tempo !== null) sliders[0].value = (Tap.getTempo()-30)/200;
			}
		});
		
		$('#screen').mousedown(function(ev) {
			mouseIsDown = true;
		});
		
		$('#screen').mouseup(function(ev) {
			mouseIsDown = false;
		});
		
		$('#screen').mousemove(function(ev) {
			if(mouseIsDown) {
				changeValue(ev.offsetX,ev.offsetY);
			}
		});
		
		$('#tweetButton').click(function(ev) {
			var tweetText = encodeURIComponent("I just made a beat using DrumKid, the web's coolest drum machine!");
			var relatedAccount = encodeURIComponent("matty_brad:The creator of DrumKid");
			window.location.href = "https://twitter.com/share?url=http%3A%2F%2Fmattbradshawdesign.com%2Flab%2Fdrumkid%2F%3Fb=" + getParamString() + "&text=" + tweetText + "&related=" + relatedAccount;
		});
		
		$('#facebookButton').click(function(ev) {
			window.location.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("http://mattbradshawdesign.com/lab/drumkid/?b=" + getParamString());
		});
		
		window.addEventListener('touchmove',function(ev) {
			$.each(ev.targetTouches,function(i,val) {
				changeValue(val.clientX,val.clientY);
			});
		});
	}
	
	function draw() {
		ctx.clearRect(0,0,cvs.width,cvs.height);
		
		ctx.textAlign = "center";
		var sliderWidth = cvs.width/sliders.length;
		var sliderHeight = 0.9 * cvs.height;
		$.each(sliders,function(i,val) {
			ctx.fillStyle = colours[i];
			ctx.fillRect(i*sliderWidth,0,sliderWidth,sliderHeight);
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(i*sliderWidth,0,sliderWidth,sliderHeight*(1-val.value));
			ctx.fillStyle = "#000000";
			ctx.fillText(val.name,i*sliderWidth+sliderWidth/2,1.05*sliderHeight);
		});
	}
	
	function getSliderValue(name) {
		return slidersObj[name].value;
	}
	
	function changeValue(x,y) {
		var foundSlider = null;
		var sliderWidth = cvs.width/sliders.length;
		var sliderHeight = 0.9 * cvs.height;
		$.each(sliders,function(i,val) {
			if(x>i*sliderWidth&&x<(i+1)*sliderWidth) foundSlider = val; 
		});
		if(foundSlider !== null) {
			foundSlider.value = Math.max(Math.min(1-(y/sliderHeight),1),0);
			$.jStorage.set(foundSlider.name,foundSlider.value); 
		}
	}
	
	function getParamString() {
		var returnString = "",paramId,paramVal;
		$.each(sliders,function(i,val) {
			paramId = val.id.toString(16);
			if(paramId.length === 1) paramId = "0" + paramId;
			paramVal = Math.round(val.value * 255).toString(16);
			if(paramVal.length === 1) paramVal = "0" + paramVal;
			returnString += paramId + paramVal;
		});
		return returnString;
	}
	
	return {
		init: init,
		draw: draw,
		getSliderValue: getSliderValue,
		getParamString: getParamString
	}
	
})();