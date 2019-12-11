var classification_eez = function (feature, resolution){
  const territory1 = feature.get('territory1')
  var layercolor
  if (territory1 === "Germany") {
  layercolor='rgb(0, 255, 191, 0.5)';
  }
  else if (territory1 === "Russia" ) {
  layercolor='rgb(0, 255, 0, 0.5)';
  }
  else if (territory1 === "Sweden") {
  layercolor='	rgb(0, 191, 255, 0.5)';
  }
  else if (territory1 === "Latvia") {
  layercolor='rgb(0, 128, 255, 0.5)';
  }
  else if (territory1 === "Estonia") {
  layercolor='rgb(0, 64, 255, 0.5)';
  }
  else if (territory1 === "Poland") {
  layercolor='rgb	rgb(0, 0, 255, 0.5)';
  }
  else if (territory1 === "Finland") {
  layercolor='rgb(64, 0, 255, 0.5)';
  }
  else if (territory1 === "Denmark") {
  layercolor='rgb(128, 0, 255, 0.5)';
  }
  else if (territory1 === "Lithuania") {
  layercolor='rgb(191, 0, 255, 0.5)';
  }
  else {
  layercolor='rgb(0, 50, 0, 0.5)';
  }
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0)',
      width: 0.5
    }),
    fill: new ol.style.Fill({
      color: layercolor
    })
  })
};

var eez = new ol.layer.Vector({
  title: 'EEZ',
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'static/EEZ _BALTIC _SEA.geojson',
  }),
  style: classification_eez
});

var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  eez
]

var map = new ol.Map({
  controls: new ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }).extend([
    new ol.control.ScaleLine()
  ]),
  target: 'map_eez',
  layers: layers,
  view: new ol.View({
    center: ol.proj.fromLonLat([20.064049, 59.954122]),
    zoom: 5
  })
});

map.addControl(new ol.control.LayerSwitcher());

// Popups
var
    container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    offset: [0, -10]
});

map.addOverlay(overlay);

map.on('click', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        // Work only if the click on the layer
        if (layer == eez) {
        return feature;
        }
    });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        // Show us the property of the feature
        var content = '<p>' + 'Sustainability: ' + ((1-feature.get('fuzzyvalue'))*100).toFixed(2).toString() + '%' + '</p>';
        content_element.innerHTML = content;
        overlay.setPosition(coord);

        console.info(feature.getProperties());
    }
});

// Change the cursor if on targer layer
map.on('pointermove', function(e) {
  if (e.dragging) return;

  var pixel = e.map.getEventPixel(e.originalEvent);
  var hit = false;
  e.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (layer === eez) {
          hit = true;
     }
  });

  e.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
