

function fetchTrackInfoByCombined(combined, callback) {
    var url ='http://labs.echonest.com/SongServer/search?callback=?&q=' + combined;
    console.log("Fetching track", combined);
    getJSONP(url, function(data) { filter(data); callback(data); });
}

function fetchTrackInfoBySongID(sid, callback) {
    var url ='http://labs.echonest.com/SongServer/search?callback=?&sid=' + sid;
    console.log("Fetching track", sid);
    getJSONP(url, function(data) { filter(data); callback(data); });
}

function fetchTrackInfoByArtistAndTitle(artist, title, callback) {
    var url ='http://labs.echonest.com/SongServer/search?callback=?&artist=' + artist + '&title=' + title;
    console.log("Fetching track", artist, title);
    getJSONP(url, function(data) { filter(data); callback(data); });
}

function jq_fetchTrackInfoByArtistAndTitle(artist, title, callback) {
    var url ='http://labs.echonest.com/SongServer/search?callback=?';
    $.getJSON(url, { 'artist': artist, 'title': title}, 
        function(response) {    
            filter(data);
            callback(data); 
        });
}

function filter(data) {
    filterSegments(data.track);
    clusterSegments(data.track, 12, 'timbre_cluster', 'timbre');
    clusterSegments(data.track, 3, 'pitch_cluster', 'pitches');
    assignPitches(data.track);
}




function filterSegments(track) {
    var threshold = .3;
    var fsegs = [];
    // filtered segments are in fsegs. Use
    // fduration for the duration for filtered sedgments
    fsegs.push(track.analysis.segments[0]);
    fsegs[0].fduration = fsegs[0].duration;
    for (var i = 1; i < track.analysis.segments.length; i++) {
        var seg = track.analysis.segments[i];
        var last = fsegs[fsegs.length - 1];
        if (seg.confidence < threshold) {
            fsegs[fsegs.length -1].fduration += seg.duration;
            seg.fduration = 0
        } else {
            fsegs.push(seg);
            seg.fduration = seg.duration
        }
    }
    track.analysis.fsegments = fsegs;
    track.analysis.segments = fsegs;
}

function assignPitches(track) {
    var segs = track.analysis.segments;
    for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        seg.pitch_list = getPitchList(seg);
    }
}

function getPitchList(seg) {
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
        if (seg.pitches[i] > max * .50) {
            pitches.push(i);
        }
    }
    // if lots of the pitches are high, it is really just
    // noise so collapse those into a single pitch

    if (pitches.length > 4) {
        pitches = [ bestIndex ] ;
    }
    return pitches;
}

function isSimilar(seg1, seg2) {
    var threshold = 1;
    var distance = timbral_distance(seg1, seg2);
    return (distance < threshold);
}


function euclidean_distance(v1, v2) {
    var sum = 0;
    for (var i = 0; i < 3; i++) {
        var delta = v2[i] - v1[i];
        sum += delta * delta;
    }
    return Math.sqrt(sum);
}

function timbral_distance(s1, s2) {
    return euclidean_distance(s1.timbre, s2.timbre);
}


function clusterSegments(track, numClusters, fieldName, vecName) {
    var vname = vecName || 'timbre';
    var fname = fieldName || 'cluster';
    var maxLoops = 1000;

    function zeroArray(size) {
        var arry = [];
        for (var i = 0; i < size; i++) {
            arry.push(0);
        }
        return arry;
    }

    function reportClusteringStats() {
        var counts = zeroArray(numClusters);
        for (var i = 0; i < track.analysis.segments.length; i++) {
            var cluster = track.analysis.segments[i][fname];
            counts[cluster]++;
        }
        console.log('clustering stats');
        for (var i = 0; i < counts.length; i++) {
            console.log('clus', i, counts[i]);
        }
    }

    function sumArray(v1, v2) {
        for (var i = 0; i < v1.length; i++) {
            v1[i] += v2[i];
        }
        return v1;
    }

    function divArray(v1, scalar) {
        for (var i = 0; i < v1.length; i++) {
            v1[i] /= scalar
        }
        return v1;
    }
    function getCentroid(cluster) {
        var count = 0;
        var segs = track.analysis.segments;
        var vsum = zeroArray(segs[0][vname].length);

        for (var i = 0; i < segs.length; i++) {
            if (segs[i][fname] === cluster) {
                count++;
                vsum = sumArray(vsum, segs[i][vname]);
            }
        }

        vsum = divArray(vsum, count);
        return vsum;
    }

    function findNearestCluster(clusters, seg) {
        var shortestDistance = Number.MAX_VALUE;
        var bestCluster = -1;

        for (var i = 0; i < clusters.length; i++) {
            var distance = euclidean_distance(clusters[i], seg[vname]);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                bestCluster = i;
            }
        }
        return bestCluster;
    }

    // kmeans clusterer
    // use random initial assignments
    for (var i = 0; i < track.analysis.segments.length; i++) {
        track.analysis.segments[i][fname] = Math.floor(Math.random() * numClusters);
    }

    reportClusteringStats();

    while (maxLoops-- > 0) {
        // calculate cluster centroids
        var centroids = [];
        for (var i = 0; i < numClusters; i++) {
            centroids[i] = getCentroid(i);
        }
        // reassign segs to clusters
        var switches = 0;
        for (var i = 0; i < track.analysis.segments.length; i++) {
            var seg = track.analysis.segments[i];
            var oldCluster = seg[fname];
            var newCluster = findNearestCluster(centroids, seg);
            if (oldCluster !== newCluster) {
                switches++;
                seg[fname] = newCluster;
            }
        }
        if (switches == 0) {
            break;
        }
    }
    reportClusteringStats();
}

function getJSONP( url, callback ) {
    var ud = 'json' + ( Math.random() * 100 ).toString().replace( /\./g, '' );
    window[ ud ]= function ( o ) { callback && callback( o ); };

    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src = url.replace( 'callback=?','callback=' + ud );

    document.body.appendChild( script );
}


function test1() {
    fetchTrackInfoByArtistAndTitle('weezer', 'el scorcho', function(data) {
        console.log(data);
    });
}

function test2() {
    fetchTrackInfoByCombined('weezer el scorcho', function(data) {
        console.log(data);
    });
}


function analysisTest() {
    test1();
    //test2();
}
