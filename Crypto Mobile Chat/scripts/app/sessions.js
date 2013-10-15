var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        sessions: [],
        goToChat: goToChat,
        goToPosition: goToPosition
    });
    
    function init(e){
        kendo.bind(e.view.element, viewModel);
        userSessions = a.currentUser.sessions;
        var count = 0;
        for (var i in userSessions){
            sessionModels[count] = userSessions[i];
            count++;
        }
        viewModel.set("sessions", sessionModels);    
    }
    
    var userSessions;
    var sessionModels = [];
    
    function goToChat(e) {
        a.currentUser.currentSessionId = e.data.Id;
        a.application.navigate("views/chat-view.html#chat-view");
    }
    
    function goToPosition(e){
        var position = e.data.ChatBuddy.Position;
        a.currentUser.buddyPosition = position;
        a.application.navigate("views/map-view.html#map-view");
    }
    
    a.sessions = {
        init: init
    }
})(app);