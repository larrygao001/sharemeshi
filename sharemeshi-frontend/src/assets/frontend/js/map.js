"use strict";
/* global document */
jQuery(document).ready(function () {
    /***
     Adding Google Map.
     ***/

    /* Calling goMap() function, initializing map and adding markers. */
    jQuery('#road_map.directory-map').goMap({
        maptype: 'ROADMAP',
        latitude: 51.450711,
        longitude: 0.2760004,
        zoom: 12,
        scaleControl: true,
        scrollwheel: false,
//        group: 'category',
        markers: [
//            Markers for Doctor Search
            {latitude: 51.511622, longitude: -0.150375, icon: 'images/map/5.png', html: {
                    content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},   
            {latitude: 51.524440, longitude: -0.241699, icon: 'images/map/3.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.537388, longitude: -0.077033, icon: 'images/map/6.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},    
            {latitude: 51.508930, longitude: -0.347543, icon: 'images/map/2.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.508550, longitude: -0.008712, icon: 'images/map/8.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
            {latitude: 51.549831, longitude: -0.304971, icon: 'images/map/1.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
            {latitude: 51.486562, longitude: -0.310364, icon: 'images/map/4.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
            {latitude: 51.482473, longitude: -0.094542, icon: 'images/map/7.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
            
        ]

    });
    

    /* Calling goMap() function, initializing map and adding markers. */
    jQuery('#road_map').goMap({
        maptype: 'ROADMAP',
        latitude: 51.450711,
        longitude: 0.2760004,
        zoom: 13,
        scaleControl: true,
        scrollwheel: false,
//        group: 'category',
        markers: [
//            Markers for Doctor Search
            {latitude: 51.5131094, longitude: -0.176425, icon: 'images/mapicon/1.png', html: {
                    content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.511218, longitude: -0.147124, icon: 'images/mapicon/2.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.515918, longitude: -0.219050, icon: 'images/mapicon/3.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.4941563, longitude: -0.1710176, icon: 'images/mapicon/4.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.5238585, longitude: -0.0950225, icon: 'images/mapicon/5.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.4965787, longitude: -0.1169972, icon: 'images/mapicon/6.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
			{latitude: 51.5096738, longitude: -0.2753873, icon: 'images/mapicon/6.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.4965787, longitude: -0.199223, icon: 'images/mapicon/7.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.4925041, longitude: -0.2363018, icon: 'images/mapicon/8.png', html: {
                     content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
                }},
            {latitude: 51.5202758, longitude: -0.118047, icon: 'images/mapicon/1.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
			{latitude: 51.5249492, longitude: -0.2450565, icon: 'images/mapicon/1.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
			{latitude: 51.532054, longitude: -0.1639875, icon: 'images/mapicon/8.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
			{latitude: 51.5082309, longitude: -0.076872, icon: 'images/mapicon/3.png', html: {
                 content: '<h5>ThemeRegion Ads Portal.</h5>Lorem ipsum dolor sit amet,<br/> consectetur adipisicing elit sed <br /><a href="#">Visit Store</a>'
            }},
            
        ]

    });
    
   
   
});


 // -------------------------------------------------------------
    //   Google Map 
    // -------------------------------------------------------------  

    (function(){

        var map;

        map = new GMaps({
            el: '#gmap',
            lat: 48.8612228,
            lng: 2.313042,
            scrollwheel:false,
            zoom: 6,
            zoomControl : true,
            panControl : true,
            streetViewControl : true,
            mapTypeControl: false,
            overviewMapControl: true,
            clickable: false
        });

        var image = '';
        map.addMarker({
            lat: 48.8612228,
            lng: 2.313042,
            icon: image,
            animation: google.maps.Animation.DROP,
            verticalAlign: 'bottom',
            horizontalAlign: 'center',
            backgroundColor: '#d3cfcf',
        });


        var styles = [ 

        {
            "featureType": "road",
            "stylers": [
            { "color": "#969696" }
            ]
        },{
            "featureType": "water",
            "stylers": [
            { "color": "#cecece" }
            ]
        },{
            "featureType": "landscape",
            "stylers": [
            { "color": "#efefef" }
            ]
        },{
            "elementType": "labels.text.fill",
            "stylers": [
            { "color": "#555555" }
            ]
        },{
            "featureType": "poi",
            "stylers": [
            { "color": "#cfcfcf" }
            ]
        },{
            "elementType": "labels.text",
            "stylers": [
            { "saturation": 1 },
            { "weight": 0.1 },
            { "color": "#848484" }
            ]
        }

        ];

        map.addStyle({
            styledMapName:"Styled Map",
            styles: styles,
            mapTypeId: "map_style"  
        });

        map.setStyle("map_style");
    }()); 