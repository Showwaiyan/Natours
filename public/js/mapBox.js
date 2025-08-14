const locations = JSON.parse(document.getElementById("map").dataset.locations);

function initMap() {
  const bounds = locations.map((location) => location.coordinates.toReversed());
  const map = L.map("map").fitBounds(bounds, {
    padding: [100, 100],
  });
  map.scrollWheelZoom.disable();

  maplibregl.setRTLTextPlugin(
    "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
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
  });

  // Bound
}

// STEP 3: Call initMap when DOM is ready
document.addEventListener("DOMContentLoaded", initMap);
