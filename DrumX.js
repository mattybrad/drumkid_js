/*
 * 		TO DO:
 * 				- Tap tempo
 * 				- Store values in cookie
 * 				- Better drum sounds
 * 				- More beats
 * 				- Other time signatures
 * 				- UI:
 * 					- Beat chooser
 * 					- Start/stop
 * 					- Elastic slider toggles
 * 					- Touch interface
 * 					- Proper loader
 * 					- Good graphics
 * 
 */

var Drum = (function() {
	
	var aCtx; // audio context
	var playing = false;
	var startTime;
	var sounds = {}; // object containing sounds
	var beats = {}; // object containing beats
	var step = 0;
	var tempo = 140.0;
	var lookahead = 25.0;
	var scheduleAheadTime = 0.1;
	var nextNoteTime = 0.0;
	var noteResolution = 0;
	var noteLength = 0.05;
	var intervalID = 0;
	var notesInQueue = [];
	var instruments = ["kick","snare","closedHat","openHat","lowTom","midTom","highTom"];
	
	function init() {
		// attempt to initialise audio context
		try {
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			aCtx = new AudioContext();
		}
		catch(e)
		{
			alert("Web Audio API not supported");
		}
		
		loadSound("snare","snare.wav");
		loadSound("kick","kick.mp3");
		loadSound("closedHat","hat.mp3");
		loadSound("openHat","hat.mp3");
		loadSound("lowTom","lowtom.wav");
		loadSound("midTom","tom.wav");
		loadSound("highTom","hightom.wav");
		
		beats[4] = [];
		beats[4][0] = {kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedHat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]};
		beats[4][1] = {kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedHat:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]};
		
		setTimeout(function() {
			step = 0;
			nextNoteTime = aCtx.currentTime;
			scheduler();
		},500);
		
	}
	
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	function nextNote() {
		var secondsPerBeat = 60.0 / (30+Interface.getSliderValue("tempo")*200);
		nextNoteTime += 0.25 * secondsPerBeat;
		step ++;
		if(step == 16) {
			step = 0;
		}
	}
	
	function scheduler() {
		while(nextNoteTime < aCtx.currentTime + scheduleAheadTime) {
			scheduleNote(step,nextNoteTime);
			nextNote();
		}
		timerID = window.setTimeout(scheduler,lookahead);
	}
	
	function scheduleNote(beatNumber,time) {
		notesInQueue.push( { note: beatNumber, time: time} );
		var zoomMultiplier = getZoomMultiplier(beatNumber);
		$.each(instruments,function(i,val) {
			var blend = Interface.getSliderValue("blend");
			var blendedBeat = (1-blend) * (beats[4][0][val] ? beats[4][0][val][beatNumber] : 0) + blend * (beats[4][1][val] ? beats[4][1][val][beatNumber] : 0);
			var tomVal = Interface.getSliderValue("toms");
			var tomMultiplier = $.inArray(val,["highTom","lowTom","midTom"])!=-1 ? Math.min(2*tomVal,1) : Math.min(2*(1-tomVal),1);
			if(val=="kick") tomMultiplier = 1;
			var vel = tomMultiplier * zoomMultiplier * Math.min(blendedBeat + Math.random()*1.0*Interface.getSliderValue("hyperactivity"),1);
			playSound(val,vel,time+Math.random()*0.2*Interface.getSliderValue("sloppiness"));
		});
	}
	
	function getZoomMultiplier(beatNumber) {
		// do this function next!
		var zoom = 5*Interface.getSliderValue("zoom");
		if($.inArray(beatNumber,[0])!=-1) {
			// 0
			return 1; 
		} else if($.inArray(beatNumber,[0,8])!=-1) {
			// 0, 8
			return zoom > 1 ? 1 : zoom;
		} else if($.inArray(beatNumber,[0,4,8,12])!=-1) {
			// 0, 4, 8, 12
			return zoom < 1 ? 0 : zoom > 2 ? 1 : zoom - 1;
		} else if($.inArray(beatNumber,[0,2,4,6,8,10,12,14])!=-1) {
			// 0, 2, 4, 6...
			return zoom < 2 ? 0 : zoom > 3 ? 1 : zoom - 2;
		} else {
			// 0, 1, 2, 3, 4...
			return zoom < 3 ? 0 : zoom > 4 ? 1 : zoom - 3;
		}
		return 0;
	}
	
	function loadSound(name,path) {
		var request = new XMLHttpRequest();
		request.open('GET',path,true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
			aCtx.decodeAudioData(request.response, function(buffer) {
				sounds[name] = buffer;
			}, function() {
				console.log("error");
			});
		}
		request.send();
	}
	
	var one = true;
	function playSound(name,vel,t) {
		var source = aCtx.createBufferSource();
		source.buffer = sounds[name];
		source.gain.value = vel;
		source.connect(aCtx.destination);
		source.start(t);
	}
	
	return {
		init: init
	}
	
})();
