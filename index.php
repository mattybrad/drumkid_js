<!DOCTYPE html>
<html>
	<head>
		<title>DrumKid</title>
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
		<style>
			body {
				font-family: "Open Sans",Arial, Helvetica, sans-serif;
				margin: 0 0 0 0;
				padding: 0 0 0 0;
				overflow: hidden;
			}
			
			#bottomSection {
				text-align: center;
				visibility: hidden;
			}
			
			#tweetButton,#facebookButton {
				text-decoration: underline;
				cursor: pointer;
			}
			
			#tweetButton:hover,#facebookButton:hover {
				color: #999999;
			}
			
			#beatsPerMinute {
				display: inline-block;
				min-width: 2.7em;
				text-align: right;
			}
			
			.chunkyButton {
				display: inline-block;
				background: #CCCCCC;
				border-radius: 20px;
				padding: 20px;
				cursor: pointer;
				-webkit-user-select: none;  
				-moz-user-select: none;    
				-ms-user-select: none;      
				user-select: none;
			}
			
			.bigWindow {
				position: absolute;
				top: 40%;
				left: 50%;
				padding: 20px;
				margin-left: -250px;
				margin-top: -200px;
				height: 400px;
				width: 500px;
				background: #EEEEEE;
				overflow: auto;
				text-align: center;
			}
			
			.bigWindow span {
				cursor: pointer;
				text-decoration: underline;
			}
			
			#infoBox {
				text-align: left;
			}
			
			select {
				height: 60px;
				background: #CCCCCC;
				font-size: 16px;
				border-radius: 20px;
				border: none;
				min-width: 60px;
				padding: 10px;
				font-family: "Open Sans",Arial, Helvetica, sans-serif;
			}
		</style>
		<script>
			var drumKidPhpInitString = "<?php echo $_GET['b']; ?>";
		</script>
		<script src="jquery.min.js"></script>
		<script src="json2.js"></script>
		<script src="jstorage.js"></script>
		<script src="DrumKid.js"></script>
		<script src="Loader.js"></script>
		<script src="Config.js"></script>
		<script src="Machine.js"></script>
		<script src="Beats.js"></script>
		<script src="Interface.js"></script>
		<script src="Tap.js"></script>
	</head>
	<body>
		<canvas id="screen" width="1200" height="800">Canvas not supported</canvas>
		<p id="bottomSection">
			<span class="chunkyButton" id="tap"><span id="beatsPerMinute">?</span> BPM </span> <span class="chunkyButton" id="start">Start</span> <span class="chunkyButton" id="stop">Stop</span> <span class="chunkyButton" id="infoButton">Info</span> <select id="timeSignature"><option value="3">3/4</option><option value="4" selected>4/4</option><option value="5">5/4</option><option value="6">6/8</option><option value="7">7/4</option><option value="9">9/4</option></select> <select id="beatSelect1"></select> <select id="beatSelect2"></select>
		</p>
		<div id="infoBox" class="bigWindow">
			<h2>What is DrumKid?</h2>
			DrumKid is a drum machine for your web browser. It's designed for live performance, so you can adjust the beat in real time.
			
			<h2>What's the point?</h2>
			Drumming is hard and there aren't many good drummers around, but drum machines can be restrictive and don't lend themselves to fluid live performance, IMO. I wanted to design a drum machine that could be played by anyone, and that could be played live without prior setup or programming. I also wanted to create something with enough subtlety and range that it could be learnt and mastered over time; one day, I want to hear the phrase "he's really good at DrumKid".
			
			<h2>How do I play it?</h2>
			DrumKid starts by blending two basic beats that you choose from the drop-down menus at the bottom of the screen. The mix between these two beats is controlled by the "blend" slider. The other sliders all control different aspects of the beat and can be adjusted while the beat plays. DrumKid is designed so that you can play around with the sliders without knowing exactly what each one does, but for the curious among you, here is an explanation of every available control:
			<ul>
				<li>Tempo: changes the number of beats per minute (displayed at the bottom of the screen)</li>
				<li>Time signature: changes the number of beats in the bar. This change takes effect at the end of the current bar. If you use a beat that does not match your desired time signature, the beat will be either looped or truncated to make it fit.</li>
				<li>Blend: crossfades between the two selected beats.</li>
				<li>Hyperactivity: each step, a random amount of volume is added to each drum. The hyperactivity slider controls the magnitude of this random component.</li>
				<li>Zoom: progressively fades in the volume of smaller and smaller steps. When the zoom control is at zero, only the first note of each bar is played. As you increase the zoom, the third beat becomes louder, until it is at a maximum. Increasing the zoom further fades in the second and fourth beats until they reach a maximum, and so on with smaller increments (half beats, quarter beats, etc).</li>
				<li>Pitch: changes the speed (and hence pitch) at which the drum samples are played. The kick drum is not affected by this control.</li>
				<li>Kick/snare/percussion/toms: simply changes the volume of the kick, snare, percussion and toms.</li>
				<li>Ceiling: changes the threshold volume level below which a sound will not play at all.</li>
				<li>Volume: master volume control.</li>
			</ul>
			<h2>How did DrumKid come about?</h2>
			I came up with this idea in late 2012 (I think), and initially tried to build it as a hardware project, using an Arduino mounted in a box with knobs to change the settings, outputting the drums as MIDI notes. It proved beyond my skill, but I changed tack and re-wrote the program in Javascript in August 2013. Both the unsuccessful box and the more successful web app were created in my wire-strewn den in Oxford, England.
			
			<h2>How does it work?</h2>
			DrumKid uses the Web Audio API to play sounds with a high degree of rhythmic accuracy - this is a fairly new piece of technology that is only available on certain browsers, but should spread to all modern devices and browsers in time. My code is basically a sparkly version of Chris Wilson's Web Audio Metronome. The code for DrumKid is available on GitHub; please feel free to fork it and make your own custom version.
			
			<h2>What next?</h2>
			I have a few ideas for what to do next with DrumKid. For starters, I want to make a better version based on feedback from people who have played around with it. Then I want to make a version for the Raspberry Pi and mount it in a box with knobs, mainly because it's fun to solder things. I think this would be possible by getting the project to run in Node, replacing the touch/mouse interface with physical input and writing to an audio stream using a library in Node instead of the Web Audio API.

		</div>
	</body>
</html>