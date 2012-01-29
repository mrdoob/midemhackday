var scene, camera, renderer;
var timer, sequencer;

init();
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

	sequencer = new Sequencer();

	timer = new Timer();
	// timer.loop = true;
	timer.play();

	scene.add( new Machine1( sequencer ) );

	renderer = new THREE.WebGLRenderer( { alpha: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	document.body.appendChild( renderer.domElement );
    analysisTest();
}

function animate() {

	requestAnimationFrame( animate );
	update();

}

function update() {

	camera.position.x = Math.cos( timer.currentTime / 4 ) * 100;
	camera.position.z = Math.sin( timer.currentTime / 4 ) * 100;
	camera.lookAt( camera.target );
	// camera.position.z = - timer.currentTime * 10 + 100;

	sequencer.update( timer.currentTime );

	renderer.render( scene, camera );

}
