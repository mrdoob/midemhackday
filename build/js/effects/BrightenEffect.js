var BrightenEffect = function ( mesh ) {

	var color = new THREE.Color().copy( mesh.material.color );

	this.show = function () {

		mesh.material.color.setRGB( 1, 1, 1 );

	};

	this.hide = function () {

		mesh.material.color.copy( color );

	};

	this.update = function ( progress ) {

		var inverse = ( 1 - progress ) / 2;

		mesh.material.color.setRGB( inverse + color.r, inverse + color.g, inverse + color.b );

	};

};
BrightenEffect.prototype = new SequencerItem();
BrightenEffect.prototype.constructor = BrightenEffect;
