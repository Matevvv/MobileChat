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
                for (var i in usersData)
                {
                    if (usersData[i].Username == a.currentUser.username){
                        usersData.splice(i, 1)
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
        
        var usersData = {
            AddedUsers: {
                Id: e.data.Id,
                DisplayName: e.data.DisplayName
            }
        }
        
        var sessions = Everlive.$.data("Sessions");
        sessions.create(usersData).then(
            function(successData){
                var newSession = successData.result;
                a.currentUser.sessions[newSession.Id] = newSession;
                a.currentUser.currentSessionId = newSession.Id;
                a.application.navigate("views/chat-view.html#chat-view");
            }
        );
    }
    
    a.allUsers = {
        init: init
    };
})(app);

