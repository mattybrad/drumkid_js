var Beats = (function () {
	
	var beats = [];
	
	beats[4] = [];
	beats[4][0] = {name:"Rock",ts:4,kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedhat:[0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0]};
	beats[4][1] = {name:"Dubstep",ts:4,kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedhat:[0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0]};
	beats[4][2] = {name:"Dancehall 1",ts:4};
	beats[4][3] = {name:"Reggae",ts:4};
	beats[4][4] = {name:"Techno",ts:4,kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedhat:[0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0]};
	beats[4][5] = {name:"Disco",ts:4};
	beats[4][6] = {name:"Military",ts:4};
	beats[4][7] = {name:"Ballad",ts:4};
	beats[4][8] = {name:"Rock 2",ts:4,kick:[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],snare:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],closedhat:[0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0]};
	beats[4][9] = {name:"Dancehall 2",ts:4,kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],snare:[0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0]};
	beats[4][10] = {name:"Waltz",ts:3,kick:[1,0,0,0,0,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,1,0,0,0]};
	beats[4][11] = {name:"Take Five",ts:5,kick:[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],snare:[0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0]};
	// beat ideas: 
	
	function init() {
		var i;
		for(i = 0; i < beats[4].length; i += 1) {
			$.each(beats[4][i],function(j,val) {
				if(j !== "name" && j !== "ts") {
					beats[4][i][j] = val.concat(val,val);
				};
			});
		}
	}
	
	init();
	
	return {
		beats : beats
	}
	
}());