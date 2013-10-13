var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        messages: [],
        messageText: "",
        postMessage: postMessage,
        goToSessionView: goToSessionView
    });
    
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        
        sessionId = a.currentUser.currentSessionId;
        sessions = Everlive.$.data("Sessions");
        sessions.setup.token = a.currentUser.accessToken;
        messages = Everlive.$.data("Messages");
        messages.setup.token = a.currentUser.accessToken;
        
        currentSession = a.currentUser.sessions[a.currentUser.currentSessionId];
        if (!currentSession.Messages){
            currentSession.Messages = [];
        }
        viewModel.set("messages", currentSession.Messages);
        
        a.dataPersister.checkForMessages = setInterval(function(){
            sessions.getById(sessionId).then(function(successData){
                var sessionData = successData.result;
                if (sessionData.Messages) {
                    for (var i in sessionData.Messages){
                        if (sessionData.Messages[i].CreatedOn > lastSentMessage){
                            viewModel.get("messages").push(sessionData.Messages[i]);
                            lastSentMessage = sessionData.Messages[i].CreatedOn;
                        }                      
                    }                   
                }
            });
        }, 1000);

    }
    
    var sessionId;
    var lastSentMessage = new Date(1900, 9, 9);
    
    
    function goToSessionView(){
        a.application.navigate("views/sessions-view.html#sessions-view");
        clearInterval(a.dataPersister.checkForMessages);
    }
    function postMessage() {
        var newMessage = {
            Content: viewModel.get("messageText"),
            CreatedBy: {
                Id: a.currentUser.id,
                DisplayName: a.currentUser.displayName,
                ImageSrc: a.currentUser.imageSrc
            },
            CreatedOn: new Date()
        } 
         
        sessions.getById(sessionId).then(function(successData){
            var sessionData = successData.result;
            if (!sessionData.Messages){
                sessionData.Messages = [];
            }           
            sessionData.Messages.push(newMessage);
            sessions.updateSingle(sessionData);
        })   
    }
    
    a.chat = {
        init: init
    };
})(app);