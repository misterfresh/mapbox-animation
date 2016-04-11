Animate a GeoJSON source easily with Mapbox GL

```bash
npm install mapbox-animation
```

## Usage

```js
var mapboxgl = require('mapbox-animation');  //Use just like mapbox-gl
map.getSource('vehicles').animate(1000);  //To activate animation for this source with a delay of 1000ms
var vehiclesPositions = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-76.93238901390978, 38.913188059745586]
        },
        "properties": {
            "title": "Bicycle",
            "marker-symbol": "bicycle",
            "nextPosition": [-76.83238901390978, 38.813188059745586]
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-77.13238901390978, 38.813188059745586]
        },
        "properties": {
            "title": "Car",
            "marker-symbol": "car",
            "nextPosition": [-76.97238901390978, 38.973188059745586]
        }
    }]
};

map.getSource('vehicles').setData(vehiclesPositions);  //markers will animate

```

After running the animate method, set the "nextPosition" property, and the markers will smoothly transition to the specified coordinates.

## Live Demo
[Mapbox animation live demo](http://misterfresh.github.io/mapbox-animation/)
The code of the demo is in the "example" folder.

## Mapbox-gl extension
This module is mapbox-gl, extended with a new "animate" method for GeoJSON sources.

```js
GeoJSONSource.animate(delay, transitionStyle);
```

The delay parameter is the duration of the transition. It is optional and defaults to false (no animation).
The transition style parameter is optional, it defaults to "linear". Other available styles are "none", "bezier", "midpoints", and "circle". These other styles will only work if the "previousPosition" property is also set, because they require three points.

## Performance

The following layer options seemed to give the best performance:

```js
 map.addLayer({
    "id": "layerId",
    "type": "symbol",
    "source": "sourceId",
    "layout": {
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "text-allow-overlap": true,
        "text-optional": true,
    }
});
```

Animations were very smooth on iPhone 6S, average on 2 year-old macbook Air, and choppy on the retina macbook pro. 

For more information, refer to the official mapbox-gl-js repository.