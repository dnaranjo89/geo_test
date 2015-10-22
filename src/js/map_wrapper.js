var AccesibleMap = {};

AccesibleMap.setup = function(){
    var map = L.map('map');
    var layer = Tangram.leafletLayer({
      scene: 'https://raw.githubusercontent.com/valhalla/valhalla-docs/master/examples/skin-and-bones-scene.yaml',
      attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | <a href="http://www.openstreetmap.org/about" target="_blank">&copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>',
    });
    layer.addTo(map);
    //map.setView([41.8758,-87.6189], 16);
    AccesibleMap.map = map;
};

AccesibleMap.draw_routes= function (){
    var waypoints,
        costing_options,
        mode;

    // Route 1
    waypoints = [
          L.latLng(39.474346, -6.375368),
          L.latLng(39.473924, -6.378133)
        ];
    costing_options = {};
    mode = "auto";
    //calculate_route(waypoints, mode, costing_options);

    // Route 2
    waypoints = [
          L.latLng(39.473684, -6.377592),
          L.latLng(39.473949, -6.378597)
        ];
    costing_options = {
        "pedestrian": {
            "step_penalty": 5000
        }
    };
    mode = "pedestrian";
    calculate_route(waypoints, mode, costing_options);
};

var calculate_route =  function (waypoints, mode, costing_options){
    var styles = [
            {color: 'white',opacity: 0.8, weight: 12},
            {color: '#2676C6', opacity: 1, weight: 6}
        ];
    styles[1].color = (mode == "pedestrian") ? '#76c626' : '#2676C6';

    L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
            styles: styles
        },
        router: L.Routing.valhalla('valhalla-dWJ_XBA', mode, costing_options),
        formatter: new L.Routing.Valhalla.Formatter(),
        summaryTemplate:'<div class="start">{name}</div><div class="info {transitmode}">{distance}, {time}</div>',
        routeWhileDragging: false
    }).addTo(AccesibleMap.map);
};