var TestEffect = function ( geometries ) {

	this.object = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshLambertMaterial( { color: 0xff0000 } ) );

	this.object.position.x = 50;
	this.object.position.y = -25;

	var spline = new THREE.Spline( [
		new THREE.Vector3( 50, -25, 0 ),
		new THREE.Vector3( -5, 10, 0 ),
		new THREE.Vector3( -50, 0, 0 )
	] );

	this.show = function () {

		// console.log( "show" );

	};

	this.hide = function () {

		// console.log( "hide" );

	};

	this.update = function ( progress ) {

		var position = spline.getPoint( progress );

		this.object.position.x = position.x;
		this.object.position.y = position.y;

		this.object.rotation.z = progress * ( 180 * Math.PI / 180 );

	};

};
TestEffect.prototype = new SequencerItem();
TestEffect.prototype.constructor = TestEffect;
