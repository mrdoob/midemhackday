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

    /*
	var geometry = new THREE.SphereGeometry( 2 );

	for ( var i = 0, l = 100; i < l; i ++ ) {

		var effect = new TestEffect( geometry );
		effect.object.position.z = Math.floor( Math.random() * 12 ) * 10;
		machine1.add( effect.object );

		sequencer.add( effect, i / 8, i / 8 + 1 );

	}
    */

	/*
	var cube = new THREE.Mesh( new THREE.CubeGeometry( 10, 10, 10 ), new THREE.MeshNormalMaterial() );
	scene.add( cube );
	*/

	renderer = new THREE.WebGLRenderer( { alpha: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
    fetchTrackInfoBySongID('SOMMETY12A8C1368FE',    // chopin score: 5
    //fetchTrackInfoBySongID('SOBRCCG12B0B8099F8',    // justice score: 5
    //fetchTrackInfoBySongID('SOUBKFT12A6701F07A',
        function(data) {
            var segs = data.track.analysis.segments;
            audio.src = data.track.audio;
            var getColor = normalizeColor(data.track);
            var geometry = new THREE.SphereGeometry(2);
            for (var i = 0; i < segs.length; i++) {
                var seg = segs[i];
                var pitches = getPitches(seg);
                for (var j = 0; j < pitches.length; j++) {
                    var effect = new TestEffect( geometry);
                    effect.object.position.z = Math.floor( pitches[j]  ) * 10;
                    machine1.add( effect.object );
                    sequencer.add( effect, seg.start - 0.5, seg.start + 0.5);
                }
            }
            audio.play();
        });
}

function getSize(seg) {
    var loud = seg.loudness_max;
    var min = -60;
    var max = 0;
    var size = (loud - min) / (max - min) * 5 + .2;
    return size;
}

function getPitches(seg) {
    var max = 0;
    var bestIndex = 0;
    for (var i = 0; i < seg.pitches.length; i++) {
        if (seg.pitches[i] > max) {
            max = seg.pitches[i];
            bestIndex = i;
        }
    }

    var pitches = [];
    for (var i = 0; i < seg.pitches.length; i++) {
        if (seg.pitches[i] > max * .75) {
            pitches.push(i);
        }
    }
    return pitches;
}

function normalizeColor(track) {
    var cmin = [100,100,100];
    var cmax = [-100,-100,-100];

    var qlist = track.analysis.segments;
    for (var i = 0; i < qlist.length; i++) {
        for (var j = 0; j < 3; j++) {
            var t = qlist[i].timbre[j];

            if (t < cmin[j]) {
                cmin[j] = t;
            }
            if (t > cmax[j]) {
                cmax[j] = t;
            }
        }
    }
    return function(seg) {
        var results = []
        for (var i = 0; i < 3; i++) {
            var t = seg.timbre[i];
            var norm = (t - cmin[i]) / (cmax[i] - cmin[i]);
            results[i] = norm * 255;
        }
        return results[0] * 256 * 256 * 256 + results[1] * 256 * 256 + results[2] * 256
    };
}

function getColor(seg) {
    var results = []
    for (var i = 0; i < 3; i++) {
        var t = seg.timbre[i];
        var norm = (t - cmin[i]) / (cmax[i] - cmin[i]);
        results[i] = norm * 255;
    }
    return to_rgb(results[0], results[1], results[2]);
}

function to_rgb(r, g, b) { 
    return "#" + convert(r) + convert(g) + convert(b); 
}

function convert(value) { 
    var integer = Math.round(value);
    var str = Number(integer).toString(16); 
    return str.length == 1 ? "0" + str : str; 
};

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
