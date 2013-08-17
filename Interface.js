var Interface = (function() {
	
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
		}
	]
	
	var slidersObj = {};
	var mouseIsDown = false;
	
	function init() {
		cvs = $('#screen')[0];
		ctx = cvs.getContext('2d');
		
		var sliderWidth = 150;
		var sliderHeight = 700;
		$.each(sliders,function(i,val) {
			if(!val.value) val.value = 0;
			val.x = i * sliderWidth;
			val.width = sliderWidth;
			val.height = sliderHeight;
			slidersObj[val.name] = val;
		});
		
		function drawCall() {
			draw();
			setTimeout(drawCall,20);
		}
		drawCall();
		
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
	}
	
	function draw() {
		ctx.clearRect(0,0,cvs.width,cvs.height);
		
		ctx.textAlign = "center";
		$.each(sliders,function(i,val) {
			ctx.fillStyle = "#999999";
			ctx.fillRect(val.x,0,val.width,val.height);
			ctx.fillStyle = "#CCCCCC";
			ctx.fillRect(val.x,0,val.width,val.height*(1-val.value));
			ctx.fillStyle = "#000000";
			ctx.fillText(val.name,val.x+val.width/2,val.height+30);
		});
	}
	
	function getSliderValue(name) {
		return slidersObj[name].value;
	}
	
	function changeValue(x,y) {
		var foundSlider = null;
		$.each(sliders,function(i,val) {
			if(x>val.x&&x<val.x+val.width) foundSlider = val; 
		});
		if(foundSlider) {
			foundSlider.value = Math.max(Math.min(1-(y/foundSlider.height),1),0); 
		}
	}
	
	return {
		init: init,
		draw: draw,
		getSliderValue: getSliderValue
	}
	
})();

window.onload = function() {
	Interface.init();
	Drum.init();
}
