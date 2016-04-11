Animate a GeoJSON source easily with Mapbox GL

## Usage

```js

map.getSource('vehicles').animate(true);  //To activate animation for this source
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

Just set the "nextPosition" property, run the animate method, and the markers will smoothly transition to the specified coordinates!

## Live Demo
[Mapbox animation live demo](http://misterfresh.github.io/mapbox-animation/)

## Installation

```bash
git clone https://github.com/misterfresh/mapbox-animation.git
cd mapbox-animation
npm install
```

In src/app.js set your API KEY.
```bash
npm start
```
You should now see markers animating in your browser at the address localhost:3000.

For more information, refer to the official mapbox-gl-js repository.