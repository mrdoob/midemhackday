var scene, camera, renderer;
var timer, sequencer;

init();
animate();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 100;
	scene.add( camera );

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 0 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.25 );
	light.position.set( 0, -1, 0 );
	scene.add( light );

	timer = new Timer();
	timer.play();

	sequencer = new Sequencer();

	for ( var i = 0, l = 50; i < l; i ++ ) {

		var effect = new TestEffect();
		effect.object.position.z = - i * 10;
		scene.add( effect.object );

		// console.log( effect );

		sequencer.add( effect, i, i + 1 );

	}

	/*
	var cube = new THREE.Mesh( new THREE.CubeGeometry( 10, 10, 10 ), new THREE.MeshNormalMaterial() );
	scene.add( cube );
	*/

	renderer = new THREE.WebGLRenderer( { alpha: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}

function animate() {

	requestAnimationFrame( animate );
	update();

}

function update() {

	camera.position.z = - timer.currentTime * 10 + 100;

	sequencer.update( timer.currentTime );

	renderer.render( scene, camera );

}
