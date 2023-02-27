// Leaflet Map settings
import 'leaflet';
import 'leaflet.sync'
// using spilt-grid.js
import Split from 'split-grid';
// using downloaded esri-leaflet-vector.js, because webpack version is not functioning
// import * as vector from './esri-leaflet-vector/EsriLeafletVector';

/**
 * grid settings. add 4 grids
 */
Split({
    columnGutters: [{
        track: 1,
        element: document.querySelector('.gutter-col-1'),
    }],
    rowGutters: [{
        track: 1,
        element: document.querySelector('.gutter-row-1'),
    }],
    onDragEnd: () => {
        // console.log('drag ended')
        // update submaps state when drag end
        submaps.forEach(submap => {
            submap.invalidateSize();
        });
    }
})

/**
 * map settings
 */
// array of 4 maps
const submaps = []
const layerControls = []

// function to get all active overlays
function getActiveOverlays(layer_control) {
    let active = []
    // Iterate all layers in control
    layer_control._layers.forEach(function (obj) {
        // Check if it's an overlay and added to the map
        if (obj.overlay && layer_control._map.hasLayer(obj.layer)) {
            // Push layer to active array
            active.push(obj);
        }
    });

    // Return array
    return active;
}

// function to set legend popup
function popupLegendGraphic(container_index) {
    // get the name of the top overlay layer
    let toplayer = getActiveOverlays(layerControls[container_index]).at(-1)
    let layertitle = toplayer['name']
    let layername = toplayer['layer']['options']['layers'];
    // url is based on layername
    let getLegendUrl = 'http://47.116.78.194:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=40&HEIGHT=25&LAYER=' + layername
    // set the image source to getlengend url
    document.getElementById("legend-img").src = getLegendUrl;
    // set legend model title
    document.getElementById("staticBackdropLabel").innerHTML = layertitle;
}

function setupMap(container_ids) {
    container_ids.forEach((container_id, container_index) => {
        // init submap in the grid
        let submap = L.map(container_id).setView([41, -75], 6);

        // basemap layers
        let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(submap);

        let esri_lightgray = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',{
            maxZoom: 19,
        }).addTo(submap);

        // let esri_vectorbasemap = vector.vectorBasemapLayer("ArcGIS:LightGray", {
        //     apikey: "your_ArcGIS_api_key"
        //   }).addTo(submap);

        // basemap layergroup
        let baseMaps = {
            'OpenStreetMap': osm,
            'Esri Lightgray': esri_lightgray
            // 'esri basemap': esri_vectorbasemap
        }

        // data layers (overlay map layers)
        let ugli = L.tileLayer.wms('http://47.116.78.194:8080/geoserver/noda/wms', {
            layers: 'noda:ugli-translate-compressed',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
        });
        // data layers (overlay map layers)
        let summer_lst_max_2013 = L.tileLayer.wms('http://47.116.78.194:8080/geoserver/noda/wms', {
            layers: 'sdei-global-summer-lst-2013_day-max-global',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
        });
        // data layers (overlay map layers)
        let anthropogenic_biomes_2000 = L.tileLayer.wms('http://47.116.78.194:8080/geoserver/noda/wms', {
            layers: 'noda:anthromes-anthropogenic-biomes-world-v2-2000',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
        });
        // data layers (overlay map layers)
        let gpwv4_popdensity_2015 = L.tileLayer.wms('http://47.116.78.194:8080/geoserver/noda/wms', {
            layers: 'noda:gpw-v4-population-density_2015',
            format: 'image/png',
            transparent: true,
            opacity: 0.6
        });
        // overlaymaps layergroup
        let overlayMaps = {
            "Updatable Gridded Lightweight Impervious Population": ugli,
            "LST: Summer Daytime Maximum Temperature 2013": summer_lst_max_2013,
            "Anthropogenic Biomes v2: 2000": anthropogenic_biomes_2000,
            "GPWv4: Population Density - 2015": gpwv4_popdensity_2015
        }
        // choose one overlay map to add to the submap
        let submap_keys = Object.keys(overlayMaps)
        overlayMaps[submap_keys[container_index]].addTo(submap)

        // add and push layercontrol
        let layerControl = L.control.layers(baseMaps, overlayMaps).addTo(submap);
        layerControls.push(layerControl);
        // push submap to submaps array
        submaps.push(submap);

        // add legend control button event listener
        let button_selector = '#' + container_id + ' button'
        document.querySelector(button_selector).addEventListener("click",
            function () { popupLegendGraphic(container_index) });
    });
    // use leaflet.sync to sync all 4 maps
    submaps.forEach(submap => {
        submaps.forEach(submap2 => {
            if (submap == submap2) { }
            else { submap.sync(submap2) }
        });
    })
}

setupMap(['map1', 'map2', 'map3', 'map4'])