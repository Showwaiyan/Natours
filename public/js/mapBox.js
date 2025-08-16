import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@maplibre/maplibre-gl-leaflet";
import maplibregl from "maplibre-gl/dist/maplibre-gl.js";
import rtlTextPlugin from "@mapbox/mapbox-gl-rtl-text";

export function initMap(locations) {
  const bounds = locations.map((location) => location.coordinates.toReversed());
  const map = L.map("map").fitBounds(bounds);
  map.scrollWheelZoom.disable();

  maplibregl.setRTLTextPlugin(
    rtlTextPlugin,true
  );

  L.maplibreGL({
    style: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    crossOrigin: "",
  }).addTo(map);

  locations.forEach((location) => {
    // Icon
    const imgWidth = Math.round(200 / 7);
    const imgHeight = Math.round(250 / 7);
    const markerIcon = new L.icon({
      iconUrl: "/img/pin.png",
      iconSize: [imgWidth, imgHeight],
      iconAnchor: [Math.round(imgWidth / 2), imgHeight],
    });

    // Pop up
    const popUpContent = `Day-${location.day}: ${location.description}`;
    const customOptions = {
      maxWidth: 400,
      width: 200,
      className: "popupCustom",
      offset: [0, -26],
    };
    L.popup(customOptions)
      .setLatLng(location.coordinates.toReversed())
      .setContent(popUpContent)
      .addTo(map);

    L.marker(location.coordinates.toReversed(), { icon: markerIcon }).addTo(
      map,
    );
    console.log(location.coordinates.toReversed());
  });
}
