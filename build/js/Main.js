var scene, camera, renderer;
var audio, sequencer;

init();
build();
animate();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = 0;
	camera.position.y = 150;
	camera.position.z = 200;
	camera.target = new THREE.Vector3( 0, 25, 0 );
	scene.add( camera );

	var ambient = new THREE.AmbientLight( 0x606060 );
	scene.add( ambient );

	var light = new THREE.SpotLight( 0xffffff, 1.75 );
	light.position.set( 0, 200, 0 );
	light.castShadow = true;
	light.shadowDarkness = 0.75;
	scene.add( light );

	renderer = new THREE.WebGLRenderer( { alpha: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	document.body.appendChild( renderer.domElement );

}

function build() {

	sequencer = new Sequencer();

	// var songID = 'SOMAJBN12B20E5E531';    // beatles score: 5
	// var songID = 'SODPFTL12B0B80BE1A';    // moonlight score: 5
	// var songID = 'SOCNYQF12B0B8067D4';    // chopin2 score: 8
	// var songID = 'SOPNOJG12B0B808F24';    // vivaldi score: 4
	// var songID = 'SOUBKFT12A6701F07A';
	// var songID = 'SOBRCCG12B0B8099F8';    // justice score: 5
	var songID = 'SOMMETY12A8C1368FE';    // chopin score: 8

	fetchTrackInfoBySongID( songID, function ( data ) {

		scene.add( new Machine1( sequencer, data ) );

		audio = document.createElement('audio');
		audio.src = data.track.audio;
		audio.play();

	});

}

function animate() {

	requestAnimationFrame( animate );
	update();

}

function update() {

	camera.position.x = Math.cos( audio.currentTime / 4 ) * 100;
	camera.position.z = Math.sin( audio.currentTime / 4 ) * 100;
	camera.lookAt( camera.target );

	sequencer.update( audio.currentTime );

	renderer.render( scene, camera );

}
