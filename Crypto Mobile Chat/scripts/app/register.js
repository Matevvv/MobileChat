var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        username: "",
        nickname: "",
        password: "",
        email: "",
        systemMessage: "",
        onRegister: onRegister
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
    };
    
    function onRegister() {
        var self = this;
        
        var username = self.get("username").trim();
        var nickname = self.get("nickname").trim();        
        var password = self.get("password").trim();
        var email = self.get("email").trim();
        
        var newUser = {
            Username: username,
            Password: password,
            DisplayName: nickname,
            Email: email
        };
        
        httpRequester.postJson(app.baseUrl + "Users", newUser).then(
            function(successData){
                self.set("systemMessage", "User registered. You can log in now.");            
            }, 
            function(errorData){
                var errorObj = JSON.parse(errorData.responseText);
                self.set("systemMessage", errorObj.message);
            });
    }
    
    a.register = {
        init: init
    }
})(app);