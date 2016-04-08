"use strict";
import mapboxgl from 'mapbox/mapbox-gl';
import now from 'utils/now';
import draw from 'utils/draw';

window.lastRefresh = now();
window.map = draw(mapboxgl);

setTimeout(function(){
    setInterval(
        function(){
            map.fire('move vehicles')
        }, 1000
    );
}, 3000);