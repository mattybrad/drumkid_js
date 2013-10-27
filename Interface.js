var Interface = (function() {
	
	var colours = ['Crimson','Orange','Gold','Yellow','GreenYellow','LimeGreen','LightSkyBlue','RoyalBlue','Indigo','Violet','Crimson','Orange','Gold','Yellow','GreenYellow','LimeGreen','LightSkyBlue','RoyalBlue','Indigo','Violet'];
	var cvs, ctx, isBlurred = false, flash = "none", flashTimeout, valDisplay;
	var alertMessage = "", alertTimeRemaining = 0;
	valDisplay = {
		display: false,
		pos: {
			x: 0,
			y: 0
		},
		text: ""
	}
	var sliders = [
		{
			name: "tempo",
			value: 0.6,
			id: 0,
			display: function(val) {
				return decimalToBPM(val).toFixed(1) + "BPM";
			}
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
			id: 3,
			display: function(val) {
				return (val * 6).toFixed(1);
			}
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
			name: "resonance",
			id: 12
		},
		{
			name: "cutoff",
			id: 13,
			display: function(val) {
				return Config.conversions.decimalToCutoffFreq(val).toFixed(0) + "Hz";
			}
		},
		{
			name: "delay time",
			id: 14,
			display: function(val) {
				var delayTime = Config.conversions.decimalToDelayTime(val);
				var delayInBeats = delayTime * decimalToBPM(getSliderValue("tempo")) / 60;
				return delayTime.toFixed(2) + "s (" + delayInBeats.toFixed(2) + " beats)";
			}
		},
		{
			name: "delay level",
			id: 15
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
		
		$('.bigWindow').hide();
		cvs = $('#screen')[0];
		
		function initScreen() {
			cvs.width = window.innerWidth;
			cvs.height = window.innerHeight - $('#bottomSection').height() - 25;
			ctx = cvs.getContext('2d');
			ctx.font = "12px Open Sans";
			var bgcvs = $('#bgCanvas')[0];
			$(bgcvs).css({
				top: cvs.height.toString() + "px",
				height: (window.innerHeight - cvs.height).toString() + "px",
				width: window.innerWidth.toString() + "px"
			});
			var bgctx = bgcvs.getContext('2d');
			for(var i = 0; i < sliders.length; i ++) {
				bgctx.fillStyle = getRainbowColour(i);
				bgctx.fillRect(i * bgctx.canvas.width / sliders.length, 0, bgctx.canvas.width / sliders.length, bgctx.canvas.height);
			}
			bgctx.fillStyle = '#000000';
			//bgctx.fillRect(0, 0, bgctx.canvas.width, 4);
			bgctx.globalAlpha = 0.5;
			bgctx.fillRect(0, 0, bgctx.canvas.width, bgctx.canvas.height);
		}
		initScreen();
		window.onresize = function() {
			initScreen();
		}
	
		$.each(sliders,function(i,val) {
			if(!val.value) val.value = 0;
			slidersObj[val.name] = val;
		});
		
		ctx.save();
		var word = "DrumKid";
		ctx.font = "Bold " + Math.round(0.2 * ctx.canvas.height).toString() + "px Open Sans";
		var widthTally = 0;
		var rainbowOffset = Math.random() * 50;
		for(var i = 0; i < word.length; i ++) {
			ctx.fillStyle = getRainbowColour(1.5 * i + rainbowOffset);
			ctx.fillText(word.charAt(i), ctx.canvas.width/2 + widthTally - ctx.measureText(word).width / 2, 0.55 * ctx.canvas.height);
			widthTally += ctx.measureText(word.charAt(i)).width;
		}
		ctx.fillStyle = '#333333';
		ctx.font = "40px Open Sans";
		ctx.textAlign = "center";
		ctx.fillText("by Matt Bradshaw", ctx.canvas.width / 2, 0.65 * ctx.canvas.height);
		ctx.restore();	
		populateSavedBeats();			
		
		$('body').keydown(function(ev) {
			if(ev.which === 32) {
				processTapEvent();
			}
		});
		
		$('#screen').mousedown(function(ev) {
			changeValue(ev.offsetX,ev.offsetY);
			mouseIsDown = true;
			$('#infoBox,#myBeats').toggle(false);
		});
		
		$('#screen').mouseup(function(ev) {
			mouseIsDown = false;
		});
		
		$('#screen').mouseout(function(ev) {
			mouseIsDown = false;
		});
		
		$('#screen').mousemove(function(ev) {
			if(mouseIsDown) {
				changeValue(ev.offsetX,ev.offsetY);
			}
		});
		
		$('#tap').mousedown(function(ev) {
			processTapEvent();
		});
		
		$('#start').mouseup(function(ev) {
			Machine.startBeat();
		});
		
		$('#stop').mouseup(function(ev) {
			Machine.stopBeat();
		});
		
		$('#tweet').click(function(ev) {
			if(Machine.isPlaying()) {
				$('#alertMessage').toggle(true);
				$('#alertMessageText').html("You must stop the beat playing before you can tweet it!");
				setTimeout(function() {
					$('#alertMessage').toggle(false);
				}, 5000);
			} else {
				var tweetText = encodeURIComponent("I just made a beat using DrumKid, the web's coolest drum machine!");
				var relatedAccount = encodeURIComponent("matty_brad:The creator of DrumKid");
				window.location.href = "https://twitter.com/share?url=http%3A%2F%2Fmattbradshawdesign.com%2Flab%2Fdrumkid%2F%3Fb=" + getParamString() + "&text=" + tweetText + "&related=" + relatedAccount;
			}
		});
		
		$('#share').click(function(ev) {
			if(Machine.isPlaying()) {
				$('#alertMessage').toggle(true);
				$('#alertMessageText').html("You must stop the beat playing before you can share it!");
				setTimeout(function() {
					$('#alertMessage').toggle(false);
				}, 5000);
			} else {
				window.location.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("http://mattbradshawdesign.com/lab/drumkid/?b=" + getParamString());
			}
		});
		
		$('#infoButton').click(function(ev) {
			$('#infoBox').toggle();
		});
		
		$('#myBeatsButton').click(function(ev) {
			$('#myBeats').toggle();
			$('#newBeatName').focus();
			// update beat list
			
		});
		
		$('#saveBeatButton').click(function(ev) {
			// save beat
			var myBeats = $.jStorage.get("myBeats") || [];
			myBeats.push({
				name: $('#newBeatName').val(),
				paramString: getParamString()
			});
			$.jStorage.set("myBeats", myBeats);
			$('#myBeats').toggle(false);
			populateSavedBeats();
		});
		
		document.getElementById('screen').addEventListener('touchmove',function(ev) {
			$.each(ev.targetTouches,function(i,val) {
				changeValue(val.clientX,val.clientY);
			});
		});
		
		document.getElementById('screen').addEventListener('touchstart',function(ev) {
			$.each(ev.targetTouches,function(i,val) {
				changeValue(val.clientX,val.clientY);
			});
		});
		
		document.getElementById('tap').addEventListener('touchstart',function(ev) {
			processTapEvent();
		});
		
		document.getElementById('start').addEventListener('touchend',function(ev) {
			Machine.startBeat();
		});
		
		document.getElementById('stop').addEventListener('touchend',function(ev) {
			Machine.stopBeat();
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
		$('#beatSelect1,#beatSelect2').html(beatOptions);
		$('#beatSelect1').val(0);
		$('#beatSelect2').val(1);
		
		if(phpParams[200] !== undefined) $('#beatSelect1').val(Math.round(255*phpParams[200]));
		if(phpParams[201] !== undefined) $('#beatSelect2').val(Math.round(255*phpParams[201]));
		if(phpParams[202] !== undefined) $('#timeSignature').val(Math.round(255*phpParams[202]));
	}
	
	function populateSavedBeats() {
		var myBeats = $.jStorage.get("myBeats") || [];
		$('#myBeats>ul').html("");
		for(var i = 0; i < myBeats.length; i ++) {
			$('#myBeats>ul').append("<li data-beat=\"" + myBeats[i].paramString + "\">" + myBeats[i].name + "</li>")
		}
		$('#myBeats>ul>li').click(function() {
			//Machine.stopBeat();
			$('#myBeats').toggle(false);
			var i, params = {}, paramString = $(this).data("beat");
			for (i = 0; i < paramString.length; i += 4) {
				params[parseInt("0x"+paramString.substring(i,i+2))] = parseInt("0x"+paramString.substring(i+2,i+4))/255;
			}
			$.each(sliders,function(i,val) {
				if(params[val.id] !== undefined) {
					val.value = params[val.id];
				} else {
					val.value = Config.defaultParams[val.name];
				}
			});
		});
		
		// also reset the default new beat name while we're here...
		
		$('#newBeatName').val("My " + (myBeats.length + 1).toString() + ["th","st","nd","rd","th","th","th","th","th","th"][parseInt((myBeats.length + 1).toString().charAt(myBeats.length.toString().length-1))] + " Beat");
	}
	
	function processTapEvent() {
		Tap.tap();
		if(Tap.getTaps() === getBeatsPerBar()) {
			var tapTempo = Tap.getTempo();
			sliders[0].value = BPMToDecimal(tapTempo);
			var singleBeatTime = 60000/tapTempo;
			Tap.resetTaps();
			setTimeout(Machine.startBeat,singleBeatTime-150);
		}
	}
	
	function showSliders() {
		function drawCall() {
			draw();
			setTimeout(drawCall,20);
		}
		drawCall();
	}
	
	function getRainbowColour(value) {
		
		var freq = 10 / sliders.length;
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
		var sliderWidth = cvs.width/sliders.length;
		var sliderHeight = 1.0 * cvs.height;
		$.each(sliders,function(i,val) {
			ctx.fillStyle = getRainbowColour(i);
			ctx.fillRect(i*sliderWidth,sliderHeight,sliderWidth,-sliderHeight*(val.value));
		});
		
		var fontSize = 0.6 * cvs.width / sliders.length;
		ctx.font = fontSize.toString() + "px Open Sans";
		ctx.fillStyle = "#000000";
		$.each(sliders,function(i,val) {
			ctx.save();
			ctx.translate((i+1)*sliderWidth,sliderHeight);
			ctx.rotate(-Math.PI / 2);
			ctx.fillText(val.name, 5, 0);
			ctx.restore();
		});
		
		if(valDisplay.display && mouseIsDown) {
			var textMeasurement = ctx.measureText(valDisplay.text);
			var labelHeight = 1.2 * fontSize;
			var labelX = sliderWidth * Math.floor(valDisplay.pos.x / sliderWidth), labelY = valDisplay.pos.y;
			if(labelX < cvs.width / 2) labelX += sliderWidth;
			else labelX -= textMeasurement.width;
			if(labelY < labelHeight) labelY = labelHeight;
			ctx.save();
			ctx.fillStyle = "#FFFFFF";
			ctx.globalAlpha = 0.7;
			ctx.fillRect(labelX, labelY, textMeasurement.width, -labelHeight);
			ctx.restore();
			ctx.fillText(valDisplay.text, labelX, labelY - labelHeight + fontSize);
		}
		
		var bpmNum = Math.round(decimalToBPM(getSliderValue("tempo"))*10)/10;
		var bpmString = Math.round(bpmNum) == bpmNum ? bpmNum.toString() + ".0" : bpmNum.toString();
		$('#beatsPerMinute').html(bpmString);
	}
	
	function getSliderValue(name) {
		return slidersObj[name].value;
	}
	
	function getBeatValue(beatNum) {
		var s = document.getElementById("beatSelect"+beatNum.toString());
		var val = s.options[s.selectedIndex].value;
		return parseInt(val);
	}
	
	function getBeatsPerBar() {
		var s = document.getElementById("timeSignature");
		var bpb = parseInt(s.options[s.selectedIndex].value);
		return bpb;
	}
	
	function changeValue(x,y) {
		var foundSlider = null;
		var sliderWidth = cvs.width/sliders.length;
		var sliderHeight = 1.0 * cvs.height;
		$.each(sliders,function(i,val) {
			if(x>i*sliderWidth&&x<(i+1)*sliderWidth) foundSlider = val; 
		});
		if(foundSlider !== null) {
			foundSlider.value = Math.max(Math.min(1-(y/sliderHeight),1),0);
			$.jStorage.set("b",getParamString());
			valDisplay.display = true;
			valDisplay.pos.x = x;
			valDisplay.pos.y = y;
			valDisplay.text = foundSlider.display ? foundSlider.display(foundSlider.value) : Math.round(100 * foundSlider.value).toString() + "%";
		}
	}
	
	function getParamString() {
		var returnString = "",paramId,paramVal;
		
		// add values for each slider
		$.each(sliders,function(i,val) {
			returnString += getString(val,1);
		});
		
		function getString(val,range) {
			paramId = val.id.toString(16);
			if(paramId.length === 1) paramId = "0" + paramId;
			paramVal = Math.round(val.value * 255 / range).toString(16);
			if(paramVal.length === 1) paramVal = "0" + paramVal;
			return paramId + paramVal;
		}
		
		// add values for beat selections
		returnString += getString({id:200,value:getBeatValue(1)},255) + getString({id:201,value:getBeatValue(2)},255);
		
		// add value for time signature
		returnString += getString({id:202,value:getBeatsPerBar()},255);
		
		return returnString;
	}
	
	function returnIsBlurred() {
		return isBlurred;
	}
	
	function decimalToBPM(decimal) {
		return 30 + decimal * 200;
	}
	
	function BPMToDecimal(bpm) {
		return (bpm - 30) / 200;
	}
	
	function doFlash(beatNum) {
		flash = beatNum === 0 ? "#00DD00" : "#999999";
		$('#tap').css('background',flash);
		clearTimeout(flashTimeout);
		flashTimeout = setTimeout(function() {
			$('#tap').css('background','#cccccc');
			flash = "none";
		},100);
	}
	
	return {
		init: init,
		draw: draw,
		getSliderValue: getSliderValue,
		getBeatValue: getBeatValue,
		getBeatsPerBar: getBeatsPerBar,
		getParamString: getParamString,
		showSliders: showSliders,
		isBlurred: returnIsBlurred,
		decimalToBPM: decimalToBPM,
		doFlash: doFlash
	}
	
})();