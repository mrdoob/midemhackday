var scene, camera, renderer;
var audio, sequencer;

init();
build();
animate();

function init() {

	audio = document.createElement('audio');

	document.addEventListener( 'keydown', function ( event ) {

		switch ( event.keyCode ) {

			/* space */
			case 32:

			        audio.paused ? audio.play() : audio.pause();
			        break;

			case 37:

			        audio.currentTime --;
			        sequencer.clear();
			        break;

			case 39:

			        audio.currentTime ++;
			        sequencer.clear();
			        break;

			case 38:

			        audio.playbackRate += 0.1;
			        break;

			case 40:

			        audio.playbackRate -= 0.1;
			        break;

			/* m */
			case 77:

			        audio.volume = audio.volume ? 0 : 1;
			        break;

		}

	}, false );

	//

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = 0;
	camera.position.y = 150;
	camera.position.z = 200;
	camera.target = new THREE.Vector3( 0, 25, 0 );
	scene.add( camera );

	var ambient = new THREE.AmbientLight( 0x606060 );
	scene.add( ambient );

	var light = new THREE.SpotLight( 0xffffff, 2 );
	light.position.set( 0, 300, 0 );
	light.castShadow = true;
	light.shadowDarkness = 0.5;
	scene.add( light );

	/*

	var geometry = new THREE.CylinderGeometry( 2, 2, 1000, 10 );
	var material = new THREE.MeshPhongMaterial( { color: 0xff8020, ambient: 0x202020, combine: THREE.MixOperation, reflectivity: 0.25 } );

	for ( var i = 0; i < 50; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.random() * 400 - 200;
		mesh.position.y = - Math.random() * 100 - 100;
		mesh.position.z = Math.random() * 400 - 200;
		mesh.rotation.x = 90 * Math.PI / 180;
		mesh.rotation.z = Math.floor( Math.random() * 4 ) * 90 * Math.PI / 180;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		scene.add( mesh );

	}

	*/

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
    // var songID = 'SOBDWET12A6701F114';    // Daft Punk Steam Machine
    // var songID = 'SOWGEEH12B0B80AD1C';    // Wendy carlos, Concerto Brandebourgeois in D Major - Allegro
	// var songID = 'SOMMETY12A8C1368FE';    // chopin score: 8
	// var songID = 'SOVCXFC12B0B808739';    // moog machine
	// var songID = 'SOAALZA12A8C142A41';    // fur elise
	// var songID = 'SOSBGUU12B0B80BA69';    // Daft Punk Around The world
	// var songID = 'SOPBSOF12B0B80620A';    // Fanfare for the common man
	var songID = 'TRVUFMS134AF802D1E';    // Mind Heist  inception

	fetchTrackInfoBySongID( songID, function ( data ) {

		scene.add( new Machine1( sequencer, data ) );

		scene.add( new Machine2( sequencer, data ) );

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
