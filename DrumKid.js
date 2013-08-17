// Based on Web Audio Metronome by Chris Wilson https://github.com/cwilso/metronome/

(function () {

	"use strict";
	
	window.onload = function () {
		// load all audio files
		Loader.loadAudioMultiple( Config.samples, function () {
			Interface.init();
			Machine.init( Loader.sounds );
		});
	};
	
}());