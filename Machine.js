var Machine = (function () {
	
	"use strict";
	
	var ctx, sounds = {}, instruments = [], timerID, nextNoteTime = 0, notesInQueue = [], step = 0, playing = false, gainNode, filterNode, delayNode, delayGainNode, machineTimeSignature;
	
	function init ( soundDataObject ) {
		// attempt to initialise audio context
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			ctx = new AudioContext();
		} catch ( e ) {
			// tell user that there is a problem
		}
		
		doConnections();
	
		machineTimeSignature = Interface.getBeatsPerBar();
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
					
				}
			});
		}
	}
	
	function startBeat() {
		if(playing === false) {
			step = 0;
			nextNoteTime = ctx.currentTime;
			playing = true;
			scheduler();
			gainNode.gain.value = 1;
		} else {
			step = 0;
			nextNoteTime = ctx.currentTime;
			gainNode.disconnect();
			doConnections();
			scheduler();
		}
	}
	
	function doConnections() {
		gainNode = ctx.createGainNode();
		filterNode = ctx.createBiquadFilter();
		delayNode = ctx.createDelayNode();
		gainNode.connect(filterNode);
		delayGainNode = ctx.createGain();
		filterNode.connect(delayNode);
		delayGainNode.gain.value = 0;
		delayNode.connect(delayGainNode);
		delayGainNode.connect(delayNode);
		delayGainNode.connect(ctx.destination);
		filterNode.connect(ctx.destination);
	}
	
	function stopBeat() {
		playing = false;
		gainNode.gain.value = 0;
	}
	
	function initSound ( name, data, callback ) {
		ctx.decodeAudioData( data, function( buffer ) {
			sounds[name] = buffer;
			callback();
		} );
	}
	
	function nextNote() {
		//var secondsPerBeat = 60.0 / (30+Interface.getSliderInterface.getSliderValue("tempo")*200);
		var secondsPerBeat = 60.0 / Interface.decimalToBPM(Interface.getSliderValue("tempo"));
		nextNoteTime += 0.25 * secondsPerBeat;
		step += 1;
		if(step === machineTimeSignature * 4) {
			machineTimeSignature = Interface.getBeatsPerBar();
			step = 0;
		}
	}
	
	function scheduler() {
		if(playing) {
			filterNode.frequency.value = 8000 * Interface.getSliderValue("cutoff");
			filterNode.Q.value = 0.01 + 20 * Interface.getSliderValue("resonance");
			delayNode.delayTime.value = 0.01 + 3 * Interface.getSliderValue("delay time");
			delayGainNode.gain.value = Interface.getSliderValue("delay level");
			while( nextNoteTime < ctx.currentTime + Config.scheduleAheadTime + (Interface.isBlurred() ? 1.1 : 0) ) {
				scheduleNote(step,nextNoteTime);
				// every whole beat, do interface functions
				if(step/4 === Math.round(step/4)) {
					setTimeout(function(stepVal) {
						Interface.doFlash(stepVal);
					},1000 * (nextNoteTime - ctx.currentTime) + 80, step/4);
				}
				nextNote();
			}
			timerID = window.setTimeout( scheduler, Config.lookahead );
		}
	}
	
	function scheduleNote(beatNumber,time) {
		notesInQueue.push( { note: beatNumber, time: time} );
		var zoomMultiplier = getZoomMultiplier(beatNumber);
		var beat1 = Interface.getBeatValue(1), beat2 = Interface.getBeatValue(2);
		$.each(instruments,function(i,val) {
			var blend = Interface.getSliderValue("blend");
			var blendedBeat = (1-blend) * (Beats.beats[4][beat1][val] ? Beats.beats[4][beat1][val][beatNumber] : 0) + blend * (Beats.beats[4][beat2][val] ? Beats.beats[4][beat2][val][beatNumber] : 0);
			var tomMultiplier = $.inArray(val,["tomlow","tommid","tomhigh"])!=-1 ? Interface.getSliderValue("toms") : 1;
			var percussionMultiplier = $.inArray(val,["claves","rim","shaker","closedhat"])!=-1 ? Interface.getSliderValue("percussion") : 1;
			var kickMultiplier = val === "kick" ? Interface.getSliderValue("kick") : 1;
			var snareMultiplier = val === "snare" ? Interface.getSliderValue("snare") : 1;
			var hyperMultiplier = $.inArray(val,["clap"])!=-1 ? 0 : Interface.getSliderValue("hyperactivity");
			var vel = kickMultiplier * snareMultiplier * tomMultiplier * percussionMultiplier * zoomMultiplier * Math.min(blendedBeat + Math.random()*0.6 * hyperMultiplier,1);
			if(vel < Interface.getSliderValue("ceiling")) vel = 0;
			vel *= Interface.getSliderValue("volume");
			playSound(val,2*vel,time+Math.random()*0.1*Interface.getSliderValue("sloppiness"));
		});
	}
	
	function getZoomMultiplier(beatNumber) {
		var zoom = 5*Interface.getSliderValue("zoom");
		if($.inArray(beatNumber,[0])!=-1) {
			// 0
			return 1;
		} else if($.inArray(beatNumber,[0,8,16,24])!=-1) {
			// 0, 8
			return zoom > 1 ? 1 : zoom;
		} else if($.inArray(beatNumber,[0,4,8,12,16,20,24,28])!=-1) {
			// 0, 4, 8, 12
			return zoom < 1 ? 0 : zoom > 2 ? 1 : zoom - 1;
		} else if($.inArray(beatNumber,[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30])!=-1) {
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
		if(name!=="kick") source.playbackRate.value = (Interface.getSliderValue("pitch")+0.01)*2;
		source.buffer = sounds[name];
		source.gain.value = 0.7 * vel;
		source.connect(gainNode);
		source.noteOn(t);
	}
	
	return {
		init : init,
		startBeat: startBeat,
		stopBeat: stopBeat,
		context: function(){return ctx},
		d: function(){return delayNode}
	};
	
}());