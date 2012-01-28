var TestEffect = function ( geometries ) {

	this.object = new THREE.Object3D();

	var ball = new THREE.Mesh( new THREE.SphereGeometry( 2 ), new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: Math.random() * 0xffffff } ) );
	this.object.add( ball );

	var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5, 1, 20 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ) );
	cylinder.position.x = 100;
	cylinder.rotation.z = 45 * Math.PI / 180;
	this.object.add( cylinder );

	var spline = new THREE.Spline( [
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 26, 18, 0 ),
		new THREE.Vector3( 54, 26, 0 ),
		new THREE.Vector3( 79, 17, 0 ),
		new THREE.Vector3( 100, 0, 0 )
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
