const locations = JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations);

function initMap() {
  const map = L.map("map").setView([53, 12], 5);

  maplibregl.setRTLTextPlugin('https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js');

L.maplibreGL({
                style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
                attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
            }).addTo(map)

  // STEP 2.3: Add markers
  // TODO: Add marker(s) with coordinates and popups
  // Example:
  // L.marker([lat, lng]).addTo(map).bindPopup("Popup text").openPopup();

  // STEP 2.4: Add event listeners
  // TODO: Handle map clicks, zoom events, etc.
  // map.on('click', (e) => { console.log(e.latlng); });

  // STEP 2.5: Add custom controls (optional)
  // TODO: Add search bar, layer switcher, etc.
}

// STEP 3: Call initMap when DOM is ready
document.addEventListener("DOMContentLoaded", initMap);
