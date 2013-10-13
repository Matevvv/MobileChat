var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        username: "",
        imageSrc: ""
    });
    
    
    function init(e){
        kendo.bind(e.view.element, viewModel);
        a.currentUser.view = "views/profile-view.html#profile-view";
        viewModel.set("imageSrc", a.currentUser.imageSrc);
        viewModel.set("username", a.currentUser.displayName);
    };
    
    
    a.profile = {
        init: init
    }
    
})(app);