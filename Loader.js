var Loader = (function () {
	
	"use strict";
	
	var sounds = {};
	
	function loadAudio ( path, callback ) {
		var request = new XMLHttpRequest();
		request.open( 'GET', "samples/" + path + ".wav", true );
		request.responseType = 'arraybuffer';
		request.onload = function () {
			sounds[path] = request.response;
			callback ( path );
		};
		request.send();
	}
	
	function loadAudioMultiple ( paths, callback ) {
		var i, fileTally = 0;
		
		function onAudioLoaded () {
			fileTally += 1;
			if( fileTally === paths.length ) {
				callback();
			}
		}
		
		for ( i = 0 ; i < paths.length ; i += 1 ) {
			loadAudio( paths[i], onAudioLoaded );
		}
	}
	
	return {
		loadAudioMultiple : loadAudioMultiple,
		sounds : sounds
	};
	
}());