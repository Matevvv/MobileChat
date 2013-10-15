var app = app || {};

(function(a){
    var viewModel = kendo.observable({
        username: "",
        imageSrc: "",
        changeImage: changeImage
    });
    
    
    function init(e){
        kendo.bind(e.view.element, viewModel);
        a.currentUser.view = "views/profile-view.html#profile-view";
        viewModel.set("username", a.currentUser.displayName);
        Everlive.$.data("Users").getById(a.currentUser.id).then(function(successData){
            var currentUser = successData.result;
            
            if(currentUser.Image) {
                a.currentUser.imageSrc = a.baseUrl + "Files/" + currentUser.Image + "/Download";
            }
            else {
                a.currentUser.imageSrc = "styles/images/no-avatar.jpg";
            } 
            viewModel.set("imageSrc", a.currentUser.imageSrc);
        });
    };
    
    function changeImage() {
        var pictureData;
        navigator.camera.getPicture( setPicture, function(){}, {
               quality: 20,
               destinationType: Camera.DestinationType.DATA_URL,
               targetWidth: 100,
               targetHeight: 100,
               encodingType: Camera.EncodingType.PNG,
           });
        
        function setPicture(pictureData){
            var imgFile = {
               FileName: a.currentUser.username + "-avatar.png",
               ContentType: "img/png",
               base64: pictureData
            };
            Everlive.$.Files.create(imgFile, function(successData){
               var fileId = successData.result.Id;
               var imageUrl = successData.result.Uri;
               Everlive.$.data("Users").updateSingle({Id: a.currentUser.id, Image: fileId});
               viewModel.set("imageSrc", imageUrl);
            })
        } 
    }
    
    a.profile = {
        init: init
    }
    
})(app);