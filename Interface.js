var Interface = (function() {
	
	var colours = ['Crimson','Orange','Gold','Yellow','GreenYellow','LimeGreen','LightSkyBlue','RoyalBlue','Indigo','Violet','Crimson','Orange','Gold','Yellow','GreenYellow','LimeGreen','LightSkyBlue','RoyalBlue','Indigo','Violet'];
	var cvs,ctx,isBlurred = false;
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
		},
		{
			name: "ceiling",
			id: 8
		},
		{
			name: "kick",
			id: 9
		},
		{
			name: "snare",
			id: 10
		},
		{
			name: "volume",
			id: 11
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
		
		var logoImg = new Image();
		logoImg.onload = onLogoLoad;
		logoImg.src = "graphics/logo.png";
		function onLogoLoad() {
			ctx.drawImage(logoImg,0.25*cvs.width,0.5*cvs.height - 0.2*(logoImg.height/logoImg.width) * cvs.width,0.5*cvs.width,0.5*(logoImg.height/logoImg.width) * cvs.width);
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
		
		document.getElementById('screen').addEventListener('touchmove',function(ev) {
			$.each(ev.targetTouches,function(i,val) {
				changeValue(val.clientX,val.clientY);
			});
		});
		
		window.addEventListener('focus', function() {
			isBlurred = false;
		});
		
		window.addEventListener('blur', function() {
			isBlurred = true;
		});
		
		// populate beat select menus
		var beatOptions = "";
		var initText = "";
		$.each(Beats.beats[4],function(i,val) {
			beatOptions += "<option value='" + i.toString() + "'>" + val.name + "</option>";
		});
		console.log(beatOptions);
		$('#beatSelect1,#beatSelect2').html(beatOptions);
		console.log(Beats.beats[4][phpParams[200]].name);
		console.log(Beats.beats[4][phpParams[201]].name);
		$('#beatSelect1').val(phpParams[200]);
		$('#beatSelect2').val(phpParams[201]);
	}
	
	function showSliders() {
		function drawCall() {
			draw();
			setTimeout(drawCall,20);
		}
		drawCall();
	}
	
	function getRainbowColour(value) {
		
		var freq = 5 / sliders.length;
		value *= freq;
		
		function numToHex(num) {
			num = Math.max(0,num);
			num = Math.min(1,num);
			var outputString = Math.round(num * 255).toString(16);
			if (outputString.length == 1) {
				outputString = "0" + outputString;
			}
			return outputString;
		}
		
		function rgbToColour(r,g,b) {
			return '#' + numToHex(r) + numToHex(g) + numToHex(b);
		}
		
		var returnColour = rgbToColour(0.5 * Math.sin(value + 0) + 0.5, 0.5 * Math.sin(value + 2) + 0.5, 0.5 * Math.sin(value + 4) + 0.5);
		return returnColour;
		
	}
	
	function draw() {
		ctx.clearRect(0,0,cvs.width,cvs.height);
		
		ctx.textAlign = "center";
		var sliderWidth = cvs.width/sliders.length;
		var sliderHeight = 0.9 * cvs.height;
		$.each(sliders,function(i,val) {
			ctx.fillStyle = getRainbowColour(i);
			ctx.fillRect(i*sliderWidth,sliderHeight,sliderWidth,-sliderHeight*(val.value));
			//ctx.fillStyle = "#FFFFFF";
			//ctx.fillRect(i*sliderWidth-1,0,sliderWidth+2,sliderHeight*(1-val.value));
			ctx.fillStyle = "#000000";
			ctx.fillText(val.name,i*sliderWidth+sliderWidth/2,1.05*sliderHeight);
		});
	}
	
	function getSliderValue(name) {
		return slidersObj[name].value;
	}
	
	function getBeatValue(beatNum) {
		var s = document.getElementById("beatSelect"+beatNum.toString());
		var val = s.options[s.selectedIndex].value;
		return parseInt(val);
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
			$.jStorage.set("b",getParamString());
		}
	}
	
	function getParamString() {
		var returnString = "",paramId,paramVal;
		
		// add values for each slider
		$.each(sliders,function(i,val) {
			returnString += getString(val);
		});
		
		function getString(val) {
			paramId = val.id.toString(16);
			if(paramId.length === 1) paramId = "0" + paramId;
			paramVal = Math.round(val.value * 255).toString(16);
			if(paramVal.length === 1) paramVal = "0" + paramVal;
			return paramId + paramVal;
		}
		
		// add values for beat selections
		returnString += getString({id:200,value:getBeatValue(1)}) + getString({id:201,value:getBeatValue(2)});
		
		return returnString;
	}
	
	function returnIsBlurred() {
		return isBlurred;
	}
	
	return {
		init: init,
		draw: draw,
		getSliderValue: getSliderValue,
		getBeatValue: getBeatValue,
		getParamString: getParamString,
		showSliders: showSliders,
		isBlurred: returnIsBlurred
	}
	
})();