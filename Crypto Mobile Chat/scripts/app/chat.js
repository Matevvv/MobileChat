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
        
        var checkForMessages = setInterval(function(){
            var currentMessages = currentSession.Messages;
            for (var i in currentMessages) {
                if (currentMessages[i].CreatedOn > lastSentMessage) {
                    viewModel.get("messages").push(currentMessages[i]);
                    lastSentMessage = currentMessages[i].CreatedOn;
                }           
            }
        }, 2000);

    }
    
    var sessionId;
    var lastSentMessage = new Date(1900, 9, 9);
    var currentSession;
    
    function goToSessionView(){

        a.application.navigate("views/sessions-view.html#sessions-view");
        clearInterval(a.dataPersister.checkForMessages);
    }
    function postMessage() {
        var text = viewModel.get("messageText");
        if (text.length == 0)
        {
            return;
        }
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