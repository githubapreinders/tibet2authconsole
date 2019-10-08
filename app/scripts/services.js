(function () {
    'use strict';
    var app = angular.module('claimapp');    
        
    app.factory('urlfactory', function()
    {
        var API_URL="";
        return{
            getApiUrl:getApiUrl           
        };

        function getApiUrl()
    {
        var theurl = window.location.hostname;
        
        switch(theurl)
        {
            
            case "localhost" :
            {
                API_URL = "http://localhost:80/ija_tibet2/api";
                console.log("theurl ", API_URL);
                break;
            }
            //Development environment url
            case "srdzzapp0329.insim.biz":
            {
                API_URL =  "https://srdzzapp0329.insim.biz/ija_tibet2/api";
                console.log("dev url ", API_URL); 
                break;
            }
            //Test environment url
            case "srtzzapp0301.insim.biz":
            {
                API_URL = "https://srtzzapp0301.insim.biz/ija_tibet2/api"; 
                break;
            }
            //Acceptance environment url 1
            case "srazzapp0384.insim.biz":
            {
                API_URL =  "https://srazzapp0384.insim.biz/ija_tibet2/api"; 
                break;
            }
            //Acceptance environment url 2
            case "srazzapp0385.insim.biz":
            {
                API_URL = "https://srazzapp0385.insim.biz/ija_tibet2/api"; 
                break;
            }
            //Production environment url 1
            case "srazzapp0430.insim.biz":
            {
                API_URL =  "https://srazzapp0430.insim.biz/ija_tibet2/api"; 
                break;
            }                
            //Production environment url 2
            case "https://srazzapp0431.insim.biz":
            {
                API_URL = "https://srazzapp0431.insim.biz/ija_tibet2/api"; 
                break;
            }                
            default :
            {
                API_URL = "http://localhost:80/ija_tibet2/api";
                break;
            }
            
        }
        return API_URL;
    }

    });




    app.factory('StaticDataFactory', function ( $http,urlfactory) {        
        return {
            getAllTibcoQueues: getAllTibcoQueues,
            claimQueue: claimQueue,
            unClaimQueue: unClaimQueue,
            getAvailableRoles: getAvailableRoles,
            GetClaimedRecordsList: GetClaimedRecordsList
        };

            
        
        
        function claimQueue(businessdomain, servapplname, role, claimrole)
        {
            var xmlstring = "<input><businessdomain>" + businessdomain + "</businessdomain><servapplname>" + servapplname + "</servapplname><claimrole>" +  claimrole + "</claimrole><role>" + role + "</role></input>";
            return $http({method: 'POST',url: urlfactory.getApiUrl() + '/claimqueue', data : xmlstring, headers: {"Content-Type" : 'application/xml'}})
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
            return $http({ method: 'POST', url: urlfactory.getApiUrl() + '/unclaimapplications', data: xmlstring, headers: { "Content-Type": 'application/xml' } })
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
          return $http.get(urlfactory.getApiUrl() + '/getalltibcoqueues').then(function(data)
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
          return $http.get(urlfactory.getApiUrl() + '/getavailableroles').then(function(data)
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
            return $http.get(urlfactory.getApiUrl() + '/getclaimedrecords').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data) ;
                // console.log("converting.....", afterCnv.claimedrecords.record.queue);
                
                if (afterCnv.claimedrecords.record.queue === 'dummy')
                {
                    return;
                }

                afterCnv.claimedrecords.record.splice(0,1);
                
                var removeindexes = [];
                afterCnv.claimedrecords.record.forEach( function(element, index)
                {
                    if (element.queue === 'dummy')
                    {
                        removeindexes.push(index);
                    }
                    else
                    {
                        element.queue.splice(0,1);   
                    }
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