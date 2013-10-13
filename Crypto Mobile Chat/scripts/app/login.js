var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        onLogin: onLogin,
        username: "BorisM",
        password: "qwerty",
        systemMessage: "",
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
    };
    
    function onLogin() {
        a.connectionChecker.checkNetworkState();
        var self = this;
        var username = self.get("username").trim();
        var password = self.get("password").trim();
        var userLoginData = {
            username: username,
            password: password,
            grant_type: "password"
        }
        
        httpRequester.postJson(app.baseUrl + "oauth/token", userLoginData).then(
            function(successData) {                               
                var userData = successData.Result;
                a.currentUser.accessToken = userData.access_token;
                a.currentUser.id = userData.principal_id;               
                a.currentUser.authHeader = {
                    Authorization : a.currentUser.accessToken
                };
                a.currentUser.addNewSession = function (newSessionId){
                    Everlive.$.data("Invitations").getById(newSessionId).then(function(successData){
                        a.currentUser.sessions[newSessionId] = successData.result;
                        a.dataPersister.keepCheckingForNewMessages(newSessionId)
                    });
                }
                var serviceUrl = app.baseUrl + "users/" + a.currentUser.id;
                httpRequester.getJson(serviceUrl, a.currentUser.authHeader).then(
                    function(successData){
                        var userDetails = successData.Result;
                        setUserDetails(userDetails);
                        a.application.navigate("views/profile-view.html#profile-view");
                    }
                );
                
                a.dataPersister.keepCheckingForSessions = setInterval(checkForNewSessions, 500);
                a.dataPersister.keepCheckingForNewMessages = keepCheckingForNewMessages;
            },
            function(errorData) {
                var errorObj = JSON.parse(errorData.responseText);
                self.set("systemMessage", errorObj.message);
            }
        );
    };
    
    function checkForNewSessions() {
        var invitations = Everlive.$.data("Invitations");
        invitations.get().then(function(successData){
            var invitationData = successData.result;
            for (var i in invitationData){
                if (invitationData[i].InvitedUser == app.currentUser.id){
                    var newSessionId = invitationData[i].Session;
                    invitations.destroySingle(invitationData[i].Id);
                    a.currentUser.addNewSession(newSessionId);
                }
            }
        });
        
    }
    
    
    function keepCheckingForNewMessages(newSessionId){
        setInterval(function(){
                return checkForNewMessage(newSessionId)
        }, 500);
    }
    
    function checkForNewMessage(newSessionId) {
        Everlive.$.data("Sessions").getById(newSessionId).then(function(successData){
            var sessionData = successData.result;
            if (sessionData.Messages && sessionData.Messages.length > a.currentUser.sessions[newSessionId].length){
                a.currentUser.sessions[newSessionId].Messages = sessionData.Messages;
            }
        })
    }
    
    function setUserDetails(userDetails) {
        a.currentUser.displayName = userDetails.DisplayName
        a.currentUser.username = userDetails.Username;
        
        if(userDetails.Image) {
            a.currentUser.imageSrc = a.baseUrl + "Files/" + userDetails.Image + "/Download";
        }
        else {
            a.currentUser.imageSrc = "styles/images/no-avatar.jpg";
        }       
    }
    
    a.login = {
        init: init
    }
})(app);