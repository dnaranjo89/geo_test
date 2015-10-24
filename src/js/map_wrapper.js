var AccesibleMap = {};

AccesibleMap.setup = function(){
    var map = L.map('map');
    var layer = Tangram.leafletLayer({
      scene: 'https://raw.githubusercontent.com/valhalla/valhalla-docs/master/examples/skin-and-bones-scene.yaml',
      attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | <a href="http://www.openstreetmap.org/about" target="_blank">&copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
    });
    layer.addTo(map);

    // Focus map on Caceres
    map.setView([39.472499, -6.376273], 15);
    AccesibleMap.map = map;
};


AccesibleMap.test_route = function(){
    var origen = L.latLng(39.474346, -6.375368);
    var parking = L.latLng(39.473684, -6.377592);
    var destination = L.latLng(39.473949, -6.378597);
    var step_penalty = 5000;
    AccesibleMap.draw_complete_route(origen, parking, destination, step_penalty);
};

AccesibleMap.draw_complete_route = function (origen, parking, destination, step_penalty){
    AccesibleMap.calculate_route_auto(origen, parking).addTo(AccesibleMap.map);
    AccesibleMap.calculate_route_pedestrian(parking, destination, step_penalty).addTo(AccesibleMap.map);
};

AccesibleMap.calculate_route_auto = function(origen, destination){
    var waypoints = [origen, destination];
    var costing_options = {};
    var mode = "auto";
    return AccesibleMap.calculate_route(waypoints, mode, costing_options);
}

AccesibleMap.calculate_route_pedestrian = function(origen, destination, step_penalty){
    var waypoints = [origen, destination];
    var costing_options = {
        "pedestrian": {
            "step_penalty": step_penalty
        }
    };
    var mode = "pedestrian";
    return AccesibleMap.calculate_route(waypoints, mode, costing_options);
};

AccesibleMap.calculate_route = function (waypoints, mode, costing_options){
    var styles = [
            {color: 'white',opacity: 0.8, weight: 12},
            {color: '#2676C6', opacity: 1, weight: 6}
        ];
    styles[1].color = (mode == "pedestrian") ? '#76c626' : '#2676C6';

    return L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
            styles: styles
        },
        router: L.Routing.valhalla('valhalla-dWJ_XBA', mode, costing_options),
        formatter: new L.Routing.Valhalla.Formatter(),
        summaryTemplate:'<div class="start">{name}</div><div class="info {transitmode}">{distance}, {time}</div>',
        routeWhileDragging: false
    });
};