import os 
import sys
import cherrypy
import ConfigParser
import urllib
import urllib2
import simplejson as json
import webtools
import time
import datetime
import random
import pprint

from pyechonest import song as song_api, config
config.TRACE_API_CALLS=True
import collections
import hashlib

catalog='paulify'
rcatalog='id:' + catalog

class Server(object):
    def __init__(self, config):
        self.production_mode = config.getboolean('settings', 'production')
        self.cache_dir = '/lab/mir/data/cache'
        self.total = 0;
        self.cached = 0;


    def search(self, q='', artist='', title='', callback=''):
        if callback:
            cherrypy.response.headers['Content-Type']= 'text/javascript'
        else:
            cherrypy.response.headers['Content-Type']= 'application/json'
        print 'total', self.total, 'cached', self.cached, q, callback

        if len(artist) > 0:
            results = song_api.search(artist=artist,  title=title,\
                buckets=[rcatalog, 'tracks', 'audio_summary'], limit=True, results=1)
        else:
            results = song_api.search(combined=q,  \
                buckets=[rcatalog, 'tracks', 'audio_summary'], limit=True, results=1)

        response = {}
        if len(results) > 0:
            track = results[0].get_tracks(catalog)[0]
            id = track['id']
            results = self.read_from_cache(id)
            if results:
                print 'cache hit'
                return results
            else:
                print 'cache miss'
                response['status'] = 'ok'
                t = self.get_track(id)
                response['track'] = t
                results = to_json(response, callback)
                self.write_to_cache(id, results)
                return results
        else:
            response['status'] = 'not_found'
            return to_json(response, callback)
    search.exposed = True


    def get_track(self, id):
        track = {}
        rtrack = fetch_track(id)
        pprint.pprint(rtrack)
        track['id'] = rtrack['id']
        track['artist'] = rtrack['artist']
        track['title'] = rtrack['title']
        track['audio'] = rtrack['audio']
        track['summary'] = rtrack['audio_summary']
        track['analysis'] = self.get_analysis(rtrack)
        return track



    def get_analysis(self, rtrack):
        f = urllib.urlopen(rtrack['audio_summary']['analysis_url'])
        js = f.read()
        f.close()
        return json.loads(js)
    
    def read_from_cache(self, id):
        full_path = os.path.join(self.cache_dir, id)
        if os.path.exists(full_path):
            with open(full_path) as f:
                return f.read()
        else:
            return None;

    def write_to_cache(self, id, results):
        full_path = os.path.join(self.cache_dir, id)
        with open(full_path, 'w') as f:
            f.write(results)


def fetch_track(trid):
    url = 'http://developer.echonest.com/api/v4/track/profile?api_key=N6E4NIOVYMTHNDM8J&format=json&bucket=audio_summary&id=' + trid
    f = urllib.urlopen(url)
    js = f.read()
    print 'json', js
    f.close()
    response = json.loads(js)
    return response['response']['track']


def to_json(dict, callback=None):
    results =  json.dumps(dict, sort_keys=True, indent = 4) 
    if callback:
        results = callback + "(" + results + ")"
    return results

if __name__ == '__main__':
    urllib2.install_opener(urllib2.build_opener())
    conf_path = os.path.abspath('web.conf')
    print 'reading config from', conf_path
    cherrypy.config.update(conf_path)

    config = ConfigParser.ConfigParser()
    config.read(conf_path)
    production_mode = config.getboolean('settings', 'production')

    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Set up site-wide config first so we get a log if errors occur.

    if production_mode:
        print "Starting in production mode"
        cherrypy.config.update({'environment': 'production',
                                'log.error_file': 'simdemo.log',
                                'log.screen': True})
    else:
        print "Starting in development mode"
        cherrypy.config.update({'noenvironment': 'production',
                                'log.error_file': 'site.log',
                                'log.screen': True})

    conf = webtools.get_export_map_for_directory("static")
    cherrypy.quickstart(Server(config), '/SongServer', config=conf)

