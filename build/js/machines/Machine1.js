var Machine1 = function ( sequencer, data, filter ) {

	var container = new THREE.Object3D();
	container.position.x = - 50;
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

	var cannon = new THREE.LatheGeometry( shape, 20 );
	var cylinder = new THREE.CylinderGeometry( 4, 5, 1, 20 );

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

		// low

		var mesh = new THREE.Mesh( cylinder, new THREE.MeshPhongMaterial( { color: 0xff8020, ambient: 0x202020, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } ) );
		mesh.position.x = 95;
		mesh.position.y = 45;
		mesh.position.z = i * 10;
		mesh.rotation.z = 45 * Math.PI / 180;
		mesh.scale.set( 0.5, 0.5, 0.5 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		container.add( mesh );

		drums.push( mesh );

		// medium

		var mesh = new THREE.Mesh( cylinder, new THREE.MeshPhongMaterial( { color: 0xff8020, ambient: 0x202020, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } ) );
		mesh.position.x = 100;
		mesh.position.y = 50;
		mesh.position.z = i * 10;
		mesh.rotation.z = 45 * Math.PI / 180;
		mesh.scale.set( 0.65, 0.65, 0.65 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		container.add( mesh );

		drums.push( mesh );

		// high

		var mesh = new THREE.Mesh( cylinder, new THREE.MeshPhongMaterial( { color: 0xff8020, ambient: 0x202020, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } ) );
		mesh.position.x = 105;
		mesh.position.y = 55;
		mesh.position.z = i * 10;
		mesh.rotation.z = 45 * Math.PI / 180;
		mesh.scale.set( 0.9, 0.9, 0.9 );
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

	//

	var geometry = new THREE.IcosahedronGeometry( 1.5, 2 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, ambient: 0x808080, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );

	var segs = data.track.analysis.segments;

    if (!filter || filter(seg)) {
        for (var i = 0; i < segs.length; i++) {

            var seg = segs[i];
            var volume = Math.floor( Math.random() * 3 ); // 0-2

            for (var j = 0; j < seg.pitch_list.length; j++) {

                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.y = 50;
                mesh.position.z = Math.floor( seg.pitch_list[j] ) * 10;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                container.add( mesh );

                var effect = new Bounce1Effect( mesh, volume );
                sequencer.add( effect, seg.start - 0.5, seg.start + 0.5);

                var effect = new BrightenEffect( drums[ Math.floor( seg.pitch_list[j] ) * 3 + volume ] );
                sequencer.add( effect, seg.start, seg.start + 0.5);

            }

        }
    }

	return container;

}
