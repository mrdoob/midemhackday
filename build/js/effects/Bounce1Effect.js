var Bounce1Effect = function ( mesh, volume ) {

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

	//

	for ( var i = 0, l = spline1.points.length; i < l; i ++ ) {

		switch ( volume ) {

			case 0:
				spline1.points[ i ].x *= 0.95;
				spline1.points[ i ].y *= 0.95;
				spline2.points[ i ].x *= 0.95;
				spline2.points[ i ].y *= 0.95;
				break;

			case 2:
				spline1.points[ i ].x *= 1.05;
				spline1.points[ i ].y *= 1.05;
				spline2.points[ i ].x *= 1.05;
				spline2.points[ i ].y *= 1.05;
				break;

		}

	}

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
