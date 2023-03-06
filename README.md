# split_mapgrid
A starter map grid template that displays WMS data using leaflet and split-grid.js. Based on bootstrap webpack example.

## Bootstrap w/ Webpack

Include [Bootstrap](https://getbootstrap.com)'s source Sass and individual JavaScript plugins with [Webpack](https://webpack.js.org).

### Edit in browser

- [ ] Todo: add https to geoserver, to ensure stackblitz can open the wms service  

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Theropod/split_mapgrid)

### How to use

```sh
git clone https://github.com/Theropod/split_mapgrid.git
npm install
npm start
```

## About the ArcGIS basemap layer in this project
### tile layer
arcgis light grey baselayer can be found [here](https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer), and tiles shoud be referenced as 
`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}
`
### vector layer
The [esri-leaflet-vector](https://developers.arcgis.com/esri-leaflet/api-reference/layers/vector-layer/) plugin offers vector base layers, but it cannot be imported directly into this project by npm or js files. You may need to install it manually as outlined in this [issue](https://github.com/Esri/esri-leaflet-vector/issues/31#issuecomment-390015282) and make adjustments for file location errors. The vector base layer is contained within the .leaflet-overlay-pane class, which has a different z-index than the tile base layers. To display it correctly, you'll need to set the z-index of this class to match that of the tile base layers.
