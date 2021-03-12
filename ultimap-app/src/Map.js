import React, { useRef, useEffect, useState } from 'react';
//import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import * as mapboxgl from 'mapbox-gl'; //'@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import "./MapStyles.css";
require('dotenv').config()

// Mapbox access token.
mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [zoom, setZoom] = useState(5);

  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
  });

  // When location fetched successfully.
  function successLocation(position) {
    // Mapbox receives longitude & latitude from Geolocation API.
    setLongitude(position.coords.longitude);
    setLatitude(position.coords.latitude);
  }

  // When there is error fetching location, then the location with there coordinates is mocked.
  function errorLocation() {
    setLongitude(12.9716);
    setLatitude(77.5946);
  }

  // Gets fired up when the app loads.
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [latitude, longitude],
      zoom: zoom
    });

    // Add Zoom btn and compass.
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.on("move", () => {
      setLongitude(map.getCenter().longitude);
      setLatitude(map.getCenter().latitude);
      setZoom(map.getZoom().toFixed(2));
    });

    //This is used to add directions to the map interface
    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'cycling'
      });
     
      map.addControl(directions, "top-left");

    // Clean up on unmount.
    return () => map.remove(); 
    }, []); 

  return (
    <div>
      <div className="map__container" ref={mapContainerRef}></div>
    </div>
  );
};

export default Map;