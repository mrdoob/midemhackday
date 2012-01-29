var Bounce2Effect = function ( mesh ) {

	mesh.visible = false;

	var position = new THREE.Vector3();

	var path = [
		new THREE.Vector3( 0, 35, 0 ),
		new THREE.Vector3( 40, 25, 0 ),
		new THREE.Vector3( 78, 5, 0 )
	];


	this.show = function () {

		mesh.visible = true;

	};

	this.hide = function () {

		mesh.visible = false;

	};

	this.update = function ( progress ) {

		if ( progress < 0.5 ) {

			position.copy( path[ 1 ] );
			position.subSelf( path[ 0 ] );
			position.multiplyScalar( progress * 2 );
			position.addSelf( path[ 0 ] );

			position.y += Math.sin( Math.PI * progress * 2 ) * 40;

		} else {

			position.copy( path[ 2 ] );
			position.subSelf( path[ 1 ] );
			position.multiplyScalar( progress * 2 - 1 );
			position.addSelf( path[ 1 ] );

			position.y += Math.abs( Math.sin( Math.PI * ( progress * 2 - 1 ) ) ) * 20;

		}

		mesh.position.x = position.x;
		mesh.position.y = position.y;

	};

};
Bounce2Effect.prototype = new SequencerItem();
Bounce2Effect.prototype.constructor = Bounce2Effect;
