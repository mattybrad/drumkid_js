var Tap = (function () {
	
	"use strict";
	
	var recentTaps = [], startTime;
	
	function init() {
		
	}
	
	function tap() {
		var currentTime = new Date().getTime();
		if((recentTaps.length > 0 && currentTime - recentTaps[0] > 50) || recentTaps == 0) {
			// test above disregards doubles
			if(recentTaps.length > 0 && currentTime - recentTaps[0] > 2000) resetTaps(); 
			recentTaps.unshift(currentTime);
			recentTaps = recentTaps.slice(0,8);
		}
	}
	
	function calculateTempo(tapArray) {
		var i, totalTime = 0;
		for ( i = 1; i < tapArray.length; i += 1 ) {
			totalTime += tapArray[i-1] - tapArray[i];
		}
		return tapArray.length > 0 ? 60000 / (totalTime / (tapArray.length -1)) : null;
	}
	
	function getTaps() {
		return recentTaps.length;
	}
	
	function getTempo() {
		return calculateTempo(recentTaps);
	}
	
	function resetTaps() {
		recentTaps = [];
	}
	
	return {
		tap : tap,
		getTempo : getTempo,
		getTaps: getTaps,
		resetTaps: resetTaps
	};
	
}());