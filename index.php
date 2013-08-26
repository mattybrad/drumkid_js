<!DOCTYPE html>
<html>
	<head>
		<title>DrumKid</title>
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<style>
			body {
				font-family: Arial, Helvetica, sans-serif;
				margin: 0 0 0 0;
				padding: 0 0 0 0;
				overflow: hidden;
			}
			
			#bottomSection {
				text-align: center;
			}
			
			#bottomSection span {
				text-decoration: underline;
				cursor: pointer;
			}
			
			#bottomSection span:hover {
				color: #999999;
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
			<select id="beatSelect1"></select> / <select id="beatSelect2"></select> / <span id="tweetButton">Tweet My Beat</span> / <span id="facebookButton">Share My Beat on Facebook</span>
		</p>
	</body>
</html>