var Machine1 = function ( sequencer ) {

	var container = new THREE.Object3D();
	container.position.x = -50;
	container.position.z = - ( 12 / 2 ) * 10;

	var drums = [];

	var shape = [

		new THREE.Vector3( 6, 0, 0 ),
		new THREE.Vector3( 8, 0, 20 ),
		new THREE.Vector3( 9, 0, 27 ),
		new THREE.Vector3( 10, 0, 33 ),
		new THREE.Vector3( 8, 0, 33 ),
		new THREE.Vector3( 5, 0, 0 )

	];

	var cannon = new THREE.LatheGeometry( shape, 20 )
	var cylinder = new THREE.CylinderGeometry( 5, 5, 1, 20 );

	var path = "files/cubemap/";
	var format = '.jpg';
	var urls = [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
	];

	var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
	reflectionCube.format = THREE.RGBFormat;

	var material = new THREE.MeshPhongMaterial( { color: 0xff8020, ambient: 0x202020, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );

	for ( var i = 0, l = 12; i < l; i ++ ) {

		var mesh = new THREE.Mesh( cylinder, material );
		mesh.position.x = 100;
		mesh.position.y = 50;
		mesh.position.z = i * 10;
		mesh.rotation.z = 45 * Math.PI / 180;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		container.add( mesh );

		drums.push( mesh );

		var mesh = new THREE.Mesh( cannon, material );
		mesh.position.x = 0;
		mesh.position.y = 50;
		mesh.position.z = i * 10;
		mesh.rotation.x = 90 * Math.PI / 180;
		mesh.rotation.y = 127 * Math.PI / 180;
		mesh.scale.set( 0.5, 0.5, 0.5 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		container.add( mesh );

		var mesh = new THREE.Mesh( cannon, material );
		mesh.position.x = 17;
		mesh.position.y = 0;
		mesh.position.z = i * 10;
		mesh.rotation.x = 90 * Math.PI / 180;
		mesh.rotation.y = 150 * Math.PI / 180;
		mesh.scale.set( 0.5, 0.5, 0.5 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		container.add( mesh );

	}

	var geometry = new THREE.SphereGeometry( 2 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, ambient: 0x808080, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );

	for ( var i = 0, l = 100; i < l; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.y = 50;
		mesh.position.z = Math.floor( Math.random() * 12 ) * 10;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		container.add( mesh );

		var effect = new Bounce1Effect( mesh );
		sequencer.add( effect, i / 8, i / 8 + 1 );

	}	

	return container;

}
