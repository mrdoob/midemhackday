var Bounce1Effect = function ( mesh ) {

	mesh.visible = false;

	var spline1 = new THREE.Spline( [
		new THREE.Vector3( 0, 50, 0 ),
		new THREE.Vector3( 25, 65, 0 ),
		new THREE.Vector3( 50, 71, 0 ),
		new THREE.Vector3( 75, 65, 0 ),
		new THREE.Vector3( 100, 50, 0 )
	] );

	var spline2 = new THREE.Spline( [
		new THREE.Vector3( 100, 50, 0 ),
		new THREE.Vector3( 77, 54, 0 ),
		new THREE.Vector3( 52, 46, 0 ),
		new THREE.Vector3( 32, 25, 0 ),
		new THREE.Vector3( 18, 0, 0 )
	] );

	this.show = function () {

		mesh.visible = true;

	};

	this.hide = function () {

		mesh.visible = false;

	};

	this.update = function ( progress ) {

		var point;

		if ( progress < 0.5 ) {

			point = spline1.getPoint( progress * 2 );

		} else {

			point = spline2.getPoint( progress * 2 - 1 );

		}

		mesh.position.x = point.x;
		mesh.position.y = point.y;

	};

};
Bounce1Effect.prototype = new SequencerItem();
Bounce1Effect.prototype.constructor = Bounce1Effect;
