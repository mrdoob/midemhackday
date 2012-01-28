var TestEffect = function ( geometries ) {

	this.object = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshNormalMaterial() );
	this.object.position.x = 50;

	this.show = function () {

		// console.log( "show" );

	};

	this.hide = function () {

		// console.log( "hide" );

	};

	this.update = function ( progress ) {

		this.object.position.x = progress * - 100 + 50;
		this.object.rotation.z = progress * ( 180 * Math.PI / 180 );

	};

};
TestEffect.prototype = new SequencerItem();
TestEffect.prototype.constructor = TestEffect;

function Spline() {

	var c = [], v2 = { x: 0, y: 0 },
	point, intPoint, weight;

	this.get2DPoint = function ( points, k ) {

		point = ( points.length - 1 ) * k;
		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
		c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

		v2.x = interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
		v2.y = interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );

		return v2;

	}

	// Catmull-Rom

	function interpolate( p0, p1, p2, p3, t ) {

		var v0 = ( p2 - p0 ) * 0.5;
		var v1 = ( p3 - p1 ) * 0.5;
		var t2 = t * t;
		var t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

}
