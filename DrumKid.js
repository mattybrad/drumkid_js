// Based on Web Audio Metronome by Chris Wilson https://github.com/cwilso/metronome/

// To do before sharing beta:
// - beat chooser + selection of beats
// - twitter share
// - facebook share
// - copy/paste share thing
// - check compatibility

(function () {

	"use strict";
	
	window.onload = function () {
		// prevent touch scrolling
		document.body.addEventListener('touchmove', function(event) {
			event.preventDefault();
		}, false);
		
		// init parameters from PHP string
		var phpParams;
		if(drumKidPhpInitString.length>0&&drumKidPhpInitString.charAt(0)!=="<") {
			phpParams = decodeInitString(drumKidPhpInitString);
		} else {
			phpParams = false;
		}
		
		// load all audio files
		Loader.loadAudioMultiple( Config.samples, function () {
			Interface.init(phpParams);
			Machine.init( Loader.sounds );
		});
	};
	
	function decodeInitString(initString) {
		var i, params = {};
		for (i = 0; i < initString.length; i += 4) {
			params[parseInt("0x"+initString.substring(i,i+2))] = parseInt("0x"+initString.substring(i+2,i+4))/255;
		}
		return params;
	}
	
}());