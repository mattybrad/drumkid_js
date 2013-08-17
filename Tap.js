var Tap = (function () {
	
	"use strict";
	
	var recentTaps = [], startTime;
	
	function init() {
		
	}
	
	function tap() {
		recentTaps.unshift(new Date().getTime());
		recentTaps = recentTaps.slice(0,4);
	}
	
	function calculateTempo(tapArray) {
		var i, totalTime = 0;
		for ( i = 1; i < tapArray.length; i += 1 ) {
			totalTime += tapArray[i-1] - tapArray[i];
		}
		return tapArray.length > 3 ? 60000 / (totalTime / (tapArray.length -1)) : null;
	}
	
	function getTempo() {
		return calculateTempo(recentTaps);
	}
	
	return {
		tap : tap,
		getTempo : getTempo
	};
	
}());