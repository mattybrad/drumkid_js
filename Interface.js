var Interface = (function() {
	
	var colours = ['Crimson','Orange','Gold','Yellow','GreenYellow','LimeGreen','LightSkyBlue','RoyalBlue','Indigo','Violet'];
	var cvs,ctx;
	var sliders = [
		{
			name: "tempo",
			value: 0.6
		},
		{
			name: "blend",
			value: 0.5
		},
		{
			name: "hyperactivity",
			value: 0.4
		},
		{
			name: "zoom",
			value: 0.6
		},
		{
			name: "sloppiness",
			value: 0.1
		},
		{
			name: "toms",
			value: 0.25
		},
		{
			name: "percussion"
		},
		{
			name: "pitch"
		}
	]
	
	var slidersObj = {};
	var mouseIsDown = false;
	
	function init() {
		// initialise param values from stored values if available
		var storedVal;
		$.each(sliders,function(i,val) {
			storedVal = $.jStorage.get(val.name);
			if(storedVal === null) {
				val.value = Config.defaultParams[val.name];
			} else {
				val.value = storedVal;
			}
		});
		
		cvs = $('#screen')[0];
		cvs.width = window.innerWidth;
		cvs.height = window.innerHeight;
		window.onresize = function() {
			cvs.width = window.innerWidth;
			cvs.height = window.innerHeight;
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
			ctx.drawImage(logoImg,0.5*cvs.width - 0.25*logoImg.width,0.5*cvs.height - 0.4*(logoImg.height/logoImg.width) * cvs.width,0.5*cvs.width,0.5*(logoImg.height/logoImg.width) * cvs.width);
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
	
	function registerTouch() {
		
	}
	
	function deregisterTouch() {
		
	}
	
	return {
		init: init,
		draw: draw,
		getSliderValue: getSliderValue
	}
	
})();