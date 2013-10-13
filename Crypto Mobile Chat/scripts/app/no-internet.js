var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        onBackButtonClick: onBackButtonClick    
    });
    
    function init(e){
        kendo.bind(e.view.element, viewModel);
    }
    
    function onBackButtonClick(){
        a.application.navigate(a.currentUser.view);
    }
    
    a.noInternet = {
        init: init
    }
    
})(app);