var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        users: [],
        startNewSession: startNewSession
    });
    
    function init(е){
        kendo.bind(е.view.element, viewModel);
        a.currentUser.view = "views/all-users-view.html#all-users-view";
        
        httpRequester.getJson(a.baseUrl + "users").then(
            function(successData){
                var usersData = successData.Result;
                for (var i = 0; i < usersData.length; i++)
                {
                    if (usersData[i].Username == a.currentUser.username){
                        usersData.splice(i, 1);
                        i--;
                    }
                    else {
                        if(usersData[i].Image){
                            var imageSrc = a.baseUrl + "Files/" + usersData[i].Image + "/Download";
                            usersData[i].ImageSrc = imageSrc;                                              
                        }
                        else{
                            usersData[i].ImageSrc = "styles/images/no-avatar.jpg";
                        }
                    }
                }
                viewModel.set("users", usersData);
            }
        );
    };
    
    function startNewSession(e) {
        
        var userSessions = a.currentUser.sessions;
         for(var i in userSessions){
            userSessions[i].AddedUsers = userSessions[i].AddedUsers || [];
            if (userSessions[i].AddedUsers.Id == e.data.Id || userSessions[i].CreatedBy == e.data.Id){
                a.currentUser.currentSessionId = i;
                a.application.navigate("views/chat-view.html#chat-view");
                return;
            }
        } 
        
        var usersData = {
            AddedUsers: {
                Id: e.data.Id,
                DisplayName: e.data.DisplayName,
                Position: e.data.Position
            }
        }
        
        var sessions = Everlive.$.data("Sessions");
        sessions.create(usersData).then(
            function(successData){
                var newSession = successData.result;
                newSession.AddedUsers = usersData.AddedUsers;
                newSession.ChatBuddy = usersData.AddedUsers;
                newSession.CreatedBy = a.currentUser.id;
                Everlive.$.data("Invitations").create({InvitedUser: e.data.Id, Session: newSession.Id});
                a.currentUser.sessions[newSession.Id] = newSession;
                a.dataPersister.keepCheckingForNewMessages(newSession.Id)
                a.currentUser.currentSessionId = newSession.Id;
                a.application.navigate("views/chat-view.html#chat-view");
            }
        );
    }
    
    a.allUsers = {
        init: init
    };
})(app);

