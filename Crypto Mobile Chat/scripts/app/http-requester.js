var httpRequester = (function(){
    function getJson(url, header){
        var promise = RSVP.Promise(function(resolve, reject){
            $.ajax({
                url: url,
                type: "get",
                datatype: "json",
                headers: JSON.stringify(header),
                contentType: "application/json",
                timeout: 5000,
                success: function(successData){
                    resolve(successData);
                },
                error: function(errorData){
                    reject(errorData);    
                }
            });    
        });
        
        return promise;
    }
    
    function postJson(url, postData, header) {
        var promise = RSVP.Promise(function(resolve, reject){
            $.ajax({
                url: url,
                type: "post",
                datatype: "json",
                headers: JSON.stringify(header),
                contentType: "application/json",
                data: JSON.stringify(postData),
                timeout: 5000,
                success: function(successData){
                    resolve(successData);
                },
                error: function(errorData){
                    reject(errorData);    
                }
            });    
        });
        
        return promise;
    }
    
    return {
        getJson: getJson,
        postJson: postJson
    };
})();