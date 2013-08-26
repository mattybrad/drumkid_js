var Beats = (function () {
	
	var beats = [];
	
	beats[4] = [];
	beats[4][0] = {name:"Rock",kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedhat:[0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0]};
	beats[4][1] = {name:"Dubstep",kick:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedhat:[0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0]};
	beats[4][2] = {name:"Dancehall 1"};
	beats[4][3] = {name:"Reggae"};
	beats[4][4] = {name:"Techno",kick:[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],closedhat:[0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0,0.1,0]};
	beats[4][5] = {name:"Disco"};
	beats[4][6] = {name:"Military"};
	beats[4][7] = {name:"Ballad"};
	beats[4][8] = {name:"Rock 2"};
	beats[4][9] = {name:"Dancehall 2",kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],snare:[0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0]};
	//beats[4][10] = {name:"Dancehall"};
	
	return {
		beats : beats
	}
	
}());