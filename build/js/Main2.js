var scene, camera, renderer;
var timer, sequencer;
var audio = document.createElement('audio');

init();
animate();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = 0;
	camera.position.y = 250;
	camera.position.z = 200;
	camera.lookAt( scene.position );
	scene.add( camera );

	var ambient = new THREE.AmbientLight( 0x606060 );
	scene.add( ambient );

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 0 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.25 );
	light.position.set( 0, -1, 0 );
	scene.add( light );

	timer = new Timer();
	timer.loop = true;
	timer.play();

	sequencer = new Sequencer();

	// Machine 1

	var machine1 = new THREE.Object3D();
	machine1.position.x = -50;
	machine1.position.z = - ( 12 / 2 ) * 10;
	scene.add( machine1 );

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
	var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );

	for ( var i = 0, l = 12; i < l; i ++ ) {

		var mesh = new THREE.Mesh( cylinder, material );
		mesh.position.x = 100;
		mesh.position.y = 50;
		mesh.position.z = i * 10;
		mesh.rotation.z = 45 * Math.PI / 180;
		machine1.add( mesh );

		var mesh = new THREE.Mesh( cannon, material );
		mesh.position.x = 0;
		mesh.position.y = 50;
		mesh.position.z = i * 10;
		mesh.rotation.x = 90 * Math.PI / 180;
		mesh.rotation.y = 127 * Math.PI / 180;
		mesh.scale.set( 0.5, 0.5, 0.5 );
		machine1.add( mesh );

		var mesh = new THREE.Mesh( cannon, material );
		mesh.position.x = 17;
		mesh.position.y = 0;
		mesh.position.z = i * 10;
		mesh.rotation.x = 90 * Math.PI / 180;
		mesh.rotation.y = 150 * Math.PI / 180;
		mesh.scale.set( 0.5, 0.5, 0.5 );
		machine1.add( mesh );

	}


	renderer = new THREE.WebGLRenderer( { alpha: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

    //var songID = 'SOMAJBN12B20E5E531';    // beatles score: 5
    //var songID = 'SODPFTL12B0B80BE1A';    // moonlight score: 5
    //var songID = 'SOCNYQF12B0B8067D4';    // chopin2 score: 8
    //var songID = 'SOPNOJG12B0B808F24';    // vivaldi score: 4
    //var songID = 'SOUBKFT12A6701F07A';
    var songID = 'SOBRCCG12B0B8099F8';    // justice score: 5
    //var songID = 'SOMMETY12A8C1368FE';    // chopin score: 8

    fetchTrackInfoBySongID(songID,    
        function(data) {
            var segs = data.track.analysis.segments;
            audio.src = data.track.audio;
            var geometry = new THREE.SphereGeometry(2);
            for (var i = 0; i < segs.length; i++) {
                var seg = segs[i];
                for (var j = 0; j < seg.pitch_list.length; j++) {
                    var effect = new TestEffect( geometry);
                    effect.object.position.z = Math.floor( seg.pitch_list[j]  ) * 10;
                    machine1.add( effect.object );
                    sequencer.add( effect, seg.start - 0.5, seg.start + 0.5);
                }
            }
            audio.play();
        });
}


function animate() {
	requestAnimationFrame( animate );
	update();
}

function update() {

	camera.position.x = Math.cos( timer.currentTime / 4 ) * 100;
	camera.position.z = Math.sin( timer.currentTime / 4 ) * 100;
	camera.lookAt( scene.position );
	// camera.position.z = - timer.currentTime * 10 + 100;

	sequencer.update( audio.currentTime );
	renderer.render( scene, camera );

}
