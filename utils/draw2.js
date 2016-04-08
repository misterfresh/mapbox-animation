'use strict';
export default function draw(mapboxgl){
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v8',
        center: [-77.154, 38.899],
        zoom : 9,
        attributionControl: true
    });

    map.on('style.load', function() {
        map.addSource("vehicles", vehicles);

        map.addLayer({
            "id": "vehicles",
            "type": "symbol",
            "source": "vehicles",
            "layout": {
                "icon-image": "{marker-symbol}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
                "text-offset": [0, 1.1],
                "text-anchor": "top",
                "text-size": 10
            }
        });
        map.getSource('vehicles').animate(true);
    });
    map.on('move vehicles', function() {
        map.getSource('vehicles').setData(moveMarkers());
    });
    return map;
}

var vehicles = {
    "type": "geojson",
    "data": {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-76.93238901390978, 38.913188059745586]
            },
            "properties": {
                "title": "Bicycle",
                "marker-symbol": "bicycle"
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-77.13238901390978, 38.813188059745586]
            },
            "properties": {
                "title": "Car",
                "marker-symbol": "car"
            }
        }]
    }
};

function moveMarkers(){
    moveMarker(vehicles.data.features[0]);
    moveMarker(vehicles.data.features[1]);
    return vehicles.data;
}
function moveMarker(marker){
    var currentPosition = marker.properties.nextPosition ? marker.properties.nextPosition : marker.geometry.coordinates;
    marker.geometry.coordinates = [currentPosition[0], currentPosition[1]];
    marker.properties.nextPosition = updateCoordinates([currentPosition[0], currentPosition[1]]);
}
function updateCoordinates(coordinates){
    return [coordinates[0] + getRandomMove(), coordinates[1] + getRandomMove()];
}
function getRandomMove(){
    return (Math.random() - 0.5)/4;
}