var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        sessions: []
    });
    
    function init(e){
        kendo.bind(e.view.element, viewModel);
        sessions = a.currentUser.sessions;
        viewModel.set("sessions", sessions);    
    }
    
    var sessions;
    
    a.sessions = {
        init: init
    }
})(app);