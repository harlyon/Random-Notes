import React, { Component } from 'react';
import axios from 'axios';

class Map extends Component {

    state = {
        venues: []
      }

      handleSubmit(query) {
        this.getVenues(query);
        this.props.onSubmit(this.state.value);
      }

      componentDidMount() {
        this.getVenues('pubs')
      }

      renderMap = (query) => {
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap")
        window.initMap = this.initMap
      }

      getVenues = (query) => {
        const endPoint = "https://api.foursquare.com/v2/venues/explore?"
        const parameters = {
          client_id: "PMHC2WA1VCBHVYOPPSJ0QSBYTLRF4PNJ04OWVWV0PZJ0QFIR",
          client_secret: "CULSZZ44YAEBOWBFGPB4BF5ISRXXSNYR0EE3JV3CNE2ZWHV0",
          query: query,
          near: "Johannesburg",
          v: "20182507"
        }

        axios.get(endPoint + new URLSearchParams(parameters))
          .then(response => {
            this.setState({
              venues: response.data.response.groups[0].items
            }, this.renderMap())
          })
          .catch(error => {
            console.log("ERROR!! " + error)
          })

      }

      initMap = (query) => {

        // Create A Map
        var map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: -26.204103, lng: 28.047304},
          zoom: 8
        })

        // Create An InfoWindow
        var infowindow = new window.google.maps.InfoWindow()

        // Display Dynamic Markers
        this.state.venues.map(item => {

          var contentString = `${item.venue.name}`

          // Create A Marker
          var marker = new window.google.maps.Marker({
            position: {lat: item.venue.location.lat , lng: item.venue.location.lng},
            map: map,
            title: item.venue.name
          })

          // Click on A Marker!
          marker.addListener('click', function() {

            // Change the content
            infowindow.setContent(contentString)

            // Open An InfoWindow
            infowindow.open(map, marker)
          })

        })



      }
    render() {
        return (
            <div>
                <div id="map"></div>
            </div>
        );
    }
}

function loadScript(url) {
    var index  = window.document.getElementsByTagName("script")[0]
    var script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
  }

export default Map;