var Machine2 = function ( sequencer, data, filter ) {

	var container = new THREE.Object3D();

	var groups = [], drums = [];

	var shape = [

		new THREE.Vector3( 6, 0, 0 ),
		new THREE.Vector3( 6, 0, 1 ),
		new THREE.Vector3( 5, 0, 3 ),
		new THREE.Vector3( 9, 0, 31 ),
		new THREE.Vector3( 10, 0, 32 ),
		new THREE.Vector3( 10, 0, 33 ),
		new THREE.Vector3( 8, 0, 33 ),
		new THREE.Vector3( 4, 0, 0 )

	];

	var cannon = new THREE.LatheGeometry( shape, 20 );
	var pad = new THREE.CubeGeometry( 15, 1, 3 );

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

	var mesh = new THREE.Mesh( cannon, material );
	mesh.position.y = 20;
	mesh.rotation.x = 90 * Math.PI / 180;
	mesh.rotation.y = Math.PI;
	mesh.scale.set( 0.75, 0.75, 0.75 );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	container.add( mesh );

	var mesh = new THREE.Mesh( cannon, material );
	mesh.position.y = 15;
	mesh.rotation.x = 90 * Math.PI / 180;
	mesh.rotation.y = Math.PI;
	mesh.scale.set( 0.75, 0.75, 0.75 );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	container.add( mesh );


	for ( var i = 0, l = 40; i < l; i ++ ) {

		var group = new THREE.Object3D();
		group.rotation.y = ( i / l ) * Math.PI * 2;
		// group.rotation.z = Math.random() * Math.PI / 8;
		container.add( group );

		groups.push( group );

		var mesh = new THREE.Mesh( pad, new THREE.MeshPhongMaterial( { color: 0xff8020, ambient: 0x202020, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } ) );
		mesh.position.x = 40;
		mesh.position.y = 25;
		mesh.scale.x = ( i / l ) + 1;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		group.add( mesh );

		drums.push( mesh );

		var mesh = new THREE.Mesh( cannon, material );
		mesh.position.x = 75;
		mesh.position.y = 0;
		// mesh.position.z = i * 10;
		mesh.rotation.x = 90 * Math.PI / 180;
		mesh.rotation.y = Math.PI;
		mesh.scale.set( 0.5, 0.5, 0.5 );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		group.add( mesh );		

	}

	//

	var geometry = new THREE.IcosahedronGeometry( 1.5, 2 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, ambient: 0x808080, envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.25 } );

	var displacement = new THREE.Vector3( 0, - 1.5, 0 );

	var segs = data.track.analysis.segments;

    for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if (!filter || filter(seg)) {
            for (var j = 0; j < seg.pitch_list.length; j++) {
                //var note = Math.floor( Math.random() * 40 );
                var rnote = Math.floor( seg.pitch_list[j] );
                var volume = seg.loudness_bucket;
                var mesh = new THREE.Mesh( geometry, material );
                var note = rnote + (volume  * 12);
                var note = note % 40;

                mesh.position.y = 50;
                // mesh.position.z = Math.floor( seg.pitch_list[j] ) * 10;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                groups[ note ].add( mesh );

                var effect = new Bounce2Effect( mesh );
                sequencer.add( effect, seg.start - 0.9, seg.start + 0.9 );

                var effect = new HitEffect( drums[ note ], displacement ); // Math.floor( seg.pitch_list[j] )
                sequencer.add( effect, seg.start, seg.start + 0.5);

            }

        }
    }
	return container;
}
