var Machine = (function () {
	
	"use strict";
	
	var ctx, sounds = {}, instruments = [], timerID, nextNoteTime = 0, notesInQueue = [], step = 0, reverb;
	
	function init ( soundDataObject ) {
		// attempt to initialise audio context
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			ctx = new AudioContext();
		} catch ( e ) {
			// tell user that there is a problem
		}
		
		reverb = ctx.createConvolver();
		//reverb.connect(ctx.destination);
		var s, decodeTally = 0, decodeTotal = 0;
		// get number of sounds
		for ( s in soundDataObject ) {
			decodeTotal += 1;
			instruments.push(s);
		}
		
		for ( s in soundDataObject ) {
			initSound( s, soundDataObject[s], function() {
				decodeTally += 1;
				if (decodeTally === decodeTotal) {
					// drum machine is ready to start (all sounds ready)
					setTimeout(function() {
						step = 0;
						nextNoteTime = ctx.currentTime;
						scheduler();
					}, 500);
				}
			});
		}
	}
	
	function initSound ( name, data, callback ) {
		ctx.decodeAudioData( data, function( buffer ) {
			sounds[name] = buffer;
			callback();
		} );
	}
	
	function nextNote() {
		var secondsPerBeat = 60.0 / (30+Interface.getSliderValue("tempo")*200);
		nextNoteTime += 0.25 * secondsPerBeat;
		step += 1;
		if(step === 16) {
			step = 0;
		}
	}
	
	function scheduler() {
		while( nextNoteTime < ctx.currentTime + Config.scheduleAheadTime + (Interface.isBlurred() ? 1.1 : 0) ) {
			scheduleNote(step,nextNoteTime);
			nextNote();
		}
		timerID = window.setTimeout( scheduler, Config.lookahead );
	}
	
	function scheduleNote(beatNumber,time) {
		notesInQueue.push( { note: beatNumber, time: time} );
		var zoomMultiplier = getZoomMultiplier(beatNumber);
		var beat1 = Interface.getBeatValue(1), beat2 = Interface.getBeatValue(2);
		$.each(instruments,function(i,val) {
			var blend = Interface.getSliderValue("blend");
			var blendedBeat = (1-blend) * (Beats.beats[4][beat1][val] ? Beats.beats[4][beat1][val][beatNumber] : 0) + blend * (Beats.beats[4][beat2][val] ? Beats.beats[4][beat2][val][beatNumber] : 0);
			var tomVal = Interface.getSliderValue("toms");
			var tomMultiplier = $.inArray(val,["tomlow","tommid","tomhigh"])!=-1 ? Math.min(2*tomVal,1) : Math.min(2*(1-tomVal),1);
			if(val=="kick") tomMultiplier = 1;
			var percussionVal = Interface.getSliderValue("percussion");
			var percussionMultiplier = $.inArray(val,["claves","rim","shaker","closedhat"])!=-1 ? Math.min(2*percussionVal,1) : Math.min(2*(1-percussionVal),1);
			var vel = 0.5 * (tomMultiplier + percussionMultiplier) * zoomMultiplier * Math.min(blendedBeat + Math.random()*0.6*Interface.getSliderValue("hyperactivity"),1);
			playSound(val,vel,time+Math.random()*0.1*Interface.getSliderValue("sloppiness"));
		});
	}
	
	function getZoomMultiplier(beatNumber) {
		var zoom = 5*Interface.getSliderValue("zoom");
		if($.inArray(beatNumber,[0])!=-1) {
			// 0
			return 1; lo
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
	
	function playSound(name,vel,t) {
		var source = ctx.createBufferSource();
		if(name!=="kick") source.playbackRate.value = Interface.getSliderValue("pitch")*2;
		source.buffer = sounds[name];
		source.gain.value = 0.3 * vel;
		//source.connect(reverb);
		//reverb.connect(ctx.destination);
		source.connect(ctx.destination);
		source.noteOn(t);
	}
	
	return {
		init : init
	};
	
}());