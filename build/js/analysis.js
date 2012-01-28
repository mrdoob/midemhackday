

function fetchTrackInfoByCombined(combined, callback) {
    var url ='http://labs.echonest.com/SongServer/search?callback=?&q=' + combined;
    getJSONP(url, callback);
}

function fetchTrackInfoByArtistAndTitle(artist, title, callback) {
    var url ='http://labs.echonest.com/SongServer/search?callback=?&artist=' + artist + '&title=' + title;
    getJSONP(url, callback);
}

function jq_fetchTrackInfoByArtistAndTitle(artist, title, callback) {
    var url ='http://labs.echonest.com/SongServer/search?callback=?';
    $.getJSON(url, { 'artist': artist, 'title': title}, function(data) { callback(data); });
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
