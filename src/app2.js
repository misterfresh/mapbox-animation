"use strict";
import mapboxgl from 'mapbox/mapbox-gl';
import now from 'utils/now';
import draw from 'utils/draw';

window.lastRefresh = now();
mapboxgl.accessToken = 'pk.eyJ1IjoibWlzdGVyZnJlc2giLCJhIjoiYlFEbUhkYyJ9.zW0qmGPMmZsKPmmPwz2F1w';
window.map = draw(mapboxgl);

setTimeout(function(){
    setInterval(
        function(){
            map.fire('move vehicles')
        }, 1000
    );
}, 3000);