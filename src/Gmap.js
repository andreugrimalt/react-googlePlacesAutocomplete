import React, { Component } from 'react';

export default class Gmap extends Component {

  componentDidMount(){
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places";
    script.async = false;
    document.body.appendChild(script);
    var that=this
    script.onload=function(){
      console.log("loaded");

      const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(that.props.lat), lng: parseFloat(that.props.lng)},
        zoom: 13
      });

      var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));

      var types = document.getElementById('type-selector');
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(/** @type {google.maps.Icon} */({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br><strong>Address: </strong>' + address + '<br/>' + '<strong>Latitude: </strong>'+place.geometry.location.lat()+'<br/>'+'<strong>Longitude: </strong>'+place.geometry.location.lng());
        infowindow.open(map, marker);
      });


      const markerCoordinates=new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(that.props.lat, that.props.lng)
      });
      marker.setPosition({lat:parseFloat(that.props.lat), lng:parseFloat(that.props.lng)});
      markerCoordinates.setVisible(true);
    }


  }

  render() {
    var mapStyle = {
      width:500,
      height:500
    };

    return (
      <div>
        <input id="pac-input" className="controls" type="text" placeholder="Enter a location"></input>
        <div id="map" style={mapStyle}></div>
      </div>
    );
  }
}
