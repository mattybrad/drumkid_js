var Config = {
	
	samples: ["kick","snare","closedhat","tomlow","tommid","tomhigh","rim","claves","shaker"],
	lookahead : 25.0,
	scheduleAheadTime : 0.1,
	scheduleAheadTimeBlurred: 1.1,
	noteResolution : 0,
	noteLength : 0.05,
	defaultParams: {
		tempo: 0.5,
		blend: 0.5,
		hyperactivity: 0.5,
		zoom: 0.5,
		sloppiness: 0.1,
		toms: 0.3,
		percussion: 0.0,
		pitch: 0.5,
		ceiling: 0,
		kick: 0.7,
		snare: 0.6,
		volume: 0.7,
		cutoff: 1,
		resonance: 0
	},
	conversions: {
		decimalToDelayTime: function(val) {
			return 0.001 + 3 * Math.pow(val, 3);
		},
		decimalToCeilingLevel: function(val) {
			return Math.pow(val, 2) * 1.0;
		},
		decimalToCutoffFreq: function(val) {
			return 20000 * Math.pow(val,3);
		},
		decimalToSloppiness: function(val) {
			return Math.pow(val, 3);
		}
	}
	
};