const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      console.log(position);
      socket.emit("sendLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      alert(error.message);
      console.error(error);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 3000 }
  );
}

let map = L.map("map").setView([23.07538562556142, 76.85916821464775], 20);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markers = {};

socket.on("receiveLocation", (data) => {
  console.log(data);
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);

  if (!markers[id]) {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  } else {
    markers[id].setLatLng([latitude, longitude]);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
