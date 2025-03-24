// const socket = io();
 
 
// if(navigator.geolocation)
// {
//    navigator.geolocation.watchPosition((position) =>
//    {
//        const {latitude , longitude} = position.coords;
//        socket.emit("send-location",{latitude,longitude});
//    },
//    (error) =>
//    {
//        console.error(error);
//    },
//    {
//        enableHighAccuracy: true,
//        timeout:5000,//milisecon
//        maximumAge: 0,
//    }
// );
// }

// L.map("map"),setView([0,0], 10);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
//     attribution:"OpenStreetMap"
// }).addTo(map)

// const markers = {};

// socket.on("receive-location", (data)=>
// {
//     const {id, latitude, longitude} = data;
//     map.setView([latitude,longitude], 16);
//     if(markers[id])
//     {
//         markers[id].setLatLng([latitude, longitude]);

//     }
//     else
//     {
//        markers[id] = L.markers([latitude,longitude]).addTo(map);

//     }
// })

const socket = io();

// Get user's location
navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("send-location", { latitude, longitude });
  },
  () => console.error("Geolocation not supported"),
  { enableHighAccuracy: true }
);

// Setup map
const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

const markers = {};

// Receive location updates from server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`User: ${id}`).openPopup();
  }

  map.setView([latitude, longitude], 13);
});

socket.on("user-disconnected", (id) =>
{
    if(markers[id])
    {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});