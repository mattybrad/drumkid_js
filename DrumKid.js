// Based on Web Audio Metronome by Chris Wilson https://github.com/cwilso/metronome/

// To do before sharing beta:
// - bigger selection of beats
// - better snare
// - organise beats by time sig and make their order future-proof
// - proper share buttons
// - prettier beat visualisation
// - chunkier start stop buttons
// - click intro

(function () {

	"use strict";
	
	window.onload = function () {
		// prevent touch scrolling
		document.body.addEventListener('touchmove', function(event) {
			event.preventDefault();
		}, false);
		
		// check compatibility
		if(window.AudioContext===undefined&&window.webkitAudioContext===undefined) {
			window.location.href = "incompatible.html";
			return false;
		}
		
		// init parameters from PHP string
		var phpParams;
		if(drumKidPhpInitString.length>0&&drumKidPhpInitString.charAt(0)!=="<") {
			phpParams = decodeInitString(drumKidPhpInitString);
		} else if($.jStorage.get("b") !== null) {
			phpParams = decodeInitString($.jStorage.get("b"));;
		} else {
			phpParams = {};
		}
		
		// initialise GUI
		Interface.init(phpParams);
		
		// load all audio files
		Loader.loadAudioMultiple( Config.samples, function () {
			setTimeout(function() {
				$('#bottomSection').css('visibility','visible');
				Machine.init( Loader.sounds );
				Interface.showSliders();
			},3000);
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