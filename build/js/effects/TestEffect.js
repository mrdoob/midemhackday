var TestEffect = function ( geometries ) {

	this.object = new THREE.Object3D();

	var ball = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
	ball.position.x = 50;
	ball.position.y = -25;
	this.object.add( ball );

	var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5, 1 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ) );
	cylinder.position.x = - 50;
	cylinder.rotation.z = - 45 * Math.PI / 180;
	this.object.add( cylinder );

	var spline = new THREE.Spline( [
		new THREE.Vector3( 50, -25, 0 ),
		new THREE.Vector3( 5, 10, 0 ),
		new THREE.Vector3( -50, 0, 0 ),
		new THREE.Vector3( -50, 0, 0 ),
		new THREE.Vector3( -25, -15, 0 ),
		new THREE.Vector3( 10, -50, 0 )
	] );

	this.show = function () {

		// console.log( "show" );

	};

	this.hide = function () {

		// console.log( "hide" );

	};

	this.update = function ( progress ) {

		ball.position.copy( spline.getPoint( progress ) );

	};

};
TestEffect.prototype = new SequencerItem();
TestEffect.prototype.constructor = TestEffect;
