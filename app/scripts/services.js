(function () {

    'use strict';
    var app = angular.module('claimapp');
    
    app.constant('API_URL', "http://localhost:80/ija_tibet2/api");
    app.factory('StaticDataFactory', function ($http, API_URL) {        
        getApiUrl();
        return {
            getAllTibcoQueues: getAllTibcoQueues,
            claimQueue: claimQueue,
            unClaimQueue: unClaimQueue,
            getAvailableRoles: getAvailableRoles,
            GetClaimedRecordsList: GetClaimedRecordsList
        };

        function getApiUrl()
        {
            var theurl = window.location.hostname;
            switch(theurl)
            {
                case "localhost" :
                {
                    app.constant('API_URL', "http://localhost:80/ija_tibet2/api");
                    break;
                }
                //Development environment url
                case "srdzzapp0329.insim.biz":
                {
                    app.constant('API_URL', "https://srdzzapp0329.insim.biz/ija_tibet2/api"); 
                    break;
                }
                //Test environment url
                case "srtzzapp0301.insim.biz":
                {
                    app.constant('API_URL', "https://srtzzapp0301.insim.biz/ija_tibet2/api"); 
                    break;
                }
                //Acceptance environment url 1
                case "srazzapp0384.insim.biz":
                {
                    app.constant('API_URL', "https://srazzapp0384.insim.biz/ija_tibet2/api"); 
                    break;
                }
                //Acceptance environment url 2
                case "srazzapp0385.insim.biz":
                {
                    app.constant('API_URL', "https://srazzapp0385.insim.biz/ija_tibet2/api"); 
                    break;
                }
                //Production environment url 1
                case "srazzapp0430.insim.biz":
                {
                    app.constant('API_URL', "https://srazzapp0430.insim.biz/ija_tibet2/api"); 
                    break;
                }                
                //Production environment url 2
                case "srazzapp0431.insim.biz":
                {
                    app.constant('API_URL', "https://srazzapp0431.insim.biz/ija_tibet2/api"); 
                    break;
                }                
                default :
                {
                    app.constant('API_URL', "http://localhost:80/ija_tibet2/api");
                    break;
                }
            }
        }        
        
        
        function claimQueue(businessdomain, servapplname, role, claimrole)
        {
            var xmlstring = "<input><businessdomain>" + businessdomain + "</businessdomain><servapplname>" + servapplname + "</servapplname><claimrole>" +  claimrole + "</claimrole><role>" + role + "</role></input>";
            return $http({method: 'POST',url: API_URL + '/claimqueue', data : xmlstring, headers: {"Content-Type" : 'application/xml'}})
            .then(function success(response)
            {
                return response;
            },function failure(failmessage)
            {
            	return failmessage;
            });
        }

        function unClaimQueue(businessdomain, servapplname,  role, claimrole)
        {
            var xmlstring = "<input><businessdomain>" + businessdomain + "</businessdomain><servapplname>" + servapplname + "</servapplname><claimrole>" +  claimrole + "</claimrole><role>" + role + "</role></input>";
            console.log(xmlstring);
            return $http({ method: 'POST', url: API_URL + '/unclaimapplications', data: xmlstring, headers: { "Content-Type": 'application/xml' } })
                .then(function success(response) {
                    console.log('reply from server:', response.data);
                    return response;
                }, function failure(failmessage) {
                    console.log('fail from server:', failmessage.data);
                    return failmessage;
                });
        }

        function getAllTibcoQueues()
        {
          return $http.get(API_URL + '/getalltibcoqueues').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data);

                console.info("returning json from server with status ", afterCnv);
                return afterCnv;

            }, function (error) {
                console.log("server error :", error);
            });
        }

        function getAvailableRoles()
        {
          return $http.get(API_URL + '/getavailableroles').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data);

                console.log("functie get claimrolelist ophalen", afterCnv);
                return afterCnv;

            }, function (error) {
                console.log("server error :", error);
                return error;
            });
        }

        function GetClaimedRecordsList()
        {
            return $http.get(API_URL + '/getclaimedrecords').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data) ;
                console.log("converting.....", afterCnv.claimedrecords.record.length);
                afterCnv.claimedrecords.record.splice(0,1);
                console.log("converting", afterCnv.claimedrecords.record.length);
                
                afterCnv.claimedrecords.record.forEach( function(element)
                {
                    element.queue.splice(0,1);   
                });               
                console.log("alle claimed records na conversie naar json", afterCnv.claimedrecords.record);
                return afterCnv;
            },function (error)
            {
              console.log("server error :", error );
              return error;
            });
        }
    });

})();   