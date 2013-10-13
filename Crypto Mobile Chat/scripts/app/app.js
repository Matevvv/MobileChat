(function (global) {

    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, { initial: "login-view" });
    }, false);

    app.baseUrl = "https://api.everlive.com/v1/6K3ixEAKDyY5R1RC/";
    app.currentUser = {};
    app.el = new Everlive("6K3ixEAKDyY5R1RC");
    app.currentUser.logOut = function() {
        app.currentUser = {};
        app.application.navigate("#login-view");
    }
    
    app.currentUser.view = "#login-view";
    
    app.currentUser.sessions = [];
    
    app.storage = window.localStorage;
    
    app.connectionChecker = {
        checkNetworkState: function(){ 
            setInterval(function() {
                var networkState = navigator.connection.type;
                if (networkState == Connection.NONE){
                    app.application.navigate("views/no-internet-view.html#no-internet-view");
                }
            }, 5000)
        }
    };
    
    app.dataPersister = {};
        
    })(window);