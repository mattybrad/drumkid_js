// Based on Web Audio Metronome by Chris Wilson https://github.com/cwilso/metronome/

// To do before sharing beta:
// - touch controls
// - beat chooser + selection of beats
// - twitter share
// - facebook share
// - copy/paste share thing
// - take up all screen space
// - init logo
// - check compatibility

(function () {

	"use strict";
	
	window.onload = function () {
		document.body.addEventListener('touchmove', function(event) {
			event.preventDefault();
		}, false);
		// load all audio files
		Loader.loadAudioMultiple( Config.samples, function () {
			Interface.init();
			Machine.init( Loader.sounds );
		});
	};
	
	function decodeInitString(initString) {
		var i, params = {};
		for (i = 0; i < initString.length; i += 4) {
			
		}
	}
	
}());