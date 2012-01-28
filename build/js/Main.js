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
	camera.lookAt( scene.position );
	scene.add( camera );

	var ambient = new THREE.AmbientLight( 0x606060 );
	scene.add( ambient );

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 0 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.25 );
	light.position.set( 0, -1, 0 );
	scene.add( light );

	timer = new Timer(12);
	timer.loop = true;
	timer.play();

	sequencer = new Sequencer();

	// Machine 1

	var machine1 = new THREE.Object3D();
	machine1.position.x = -50;
	machine1.position.z = - ( 12 / 2 ) * 10;
	scene.add( machine1 );

	var geometry = new THREE.CylinderGeometry( 5, 5, 1, 20 );
	var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );

	for ( var i = 0, l = 12; i < l; i ++ ) {

		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.position.x = 100;
		cylinder.position.y = 50;
		cylinder.position.z = i * 10;
		cylinder.rotation.z = 45 * Math.PI / 180;
		machine1.add( cylinder );

	}

	var geometry = new THREE.SphereGeometry( 2 );

	for ( var i = 0, l = 100; i < l; i ++ ) {

		var effect = new TestEffect( geometry );
		effect.object.position.z = Math.floor( Math.random() * 12 ) * 10;
		machine1.add( effect.object );

		sequencer.add( effect, i / 8, i / 8 + 1 );

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

	camera.position.x = Math.cos( timer.currentTime / 4 ) * 100;
	camera.position.z = Math.sin( timer.currentTime / 4 ) * 100;
	camera.lookAt( scene.position );
	// camera.position.z = - timer.currentTime * 10 + 100;

	sequencer.update( timer.currentTime );

	renderer.render( scene, camera );

}
