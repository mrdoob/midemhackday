var HitEffect = function ( mesh, displacement ) {

	var color = new THREE.Color().copy( mesh.material.color );
	var path = [ mesh.position.clone().addSelf( displacement ), mesh.position.clone() ]; 

	this.show = function () {

		mesh.position.copy( path[ 0 ] );
		mesh.material.color.setRGB( 1, 1, 1 );

	};

	this.hide = function () {

		mesh.position.copy( path[ 1 ] );
		mesh.material.color.copy( color );

	};

	this.update = function ( progress ) {

		var inverse = ( 1 - progress ) / 2;

		mesh.position.copy( path[ 1 ] );
		mesh.position.subSelf( path[ 0 ] );
		mesh.position.multiplyScalar( progress );
		mesh.position.addSelf( path[ 0 ] );

		mesh.material.color.setRGB( inverse + color.r, inverse + color.g, inverse + color.b );

	};

};
HitEffect.prototype = new SequencerItem();
HitEffect.prototype.constructor = HitEffect;
