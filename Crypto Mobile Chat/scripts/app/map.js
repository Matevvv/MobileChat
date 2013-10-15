var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        goBackToSessions: goBackToSessions    
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        var mapElement = $("#map")
        var currentPosition = new google.maps.LatLng(a.currentUser.buddyPosition.latitude,
        a.currentUser.buddyPosition.longitude);
        var map = new google.maps.Map(mapElement[0], {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: currentPosition,
            zoom: 15
        })
        
        var pin = new google.maps.Marker({
            position: currentPosition,
            draggable: false,
            map: map
        });
    }
    
    function goBackToSessions() {
        app.application.navigate("views/sessions-view.html#sessions-view");
    }
    
    a.map = {
        init: init
    }
})(app);