(function(){

'use strict';
    var app = angular.module('claimapp');

    app.constant('API_URL', "http://localhost:80/ija_tibet2/api");
    app.factory('StaticDataFactory', function($http, API_URL)
    {
        

        return{
            getAllTibcoQueues : getAllTibcoQueues,
            claimQueue : claimQueue,
            unClaimQueue :unClaimQueue,
            GetClaimRoleList : GetClaimRoleList, 
            GetClaimedRecordsList : GetClaimedRecordsList
        };

        function claimQueue(businessdomain, servapplname, role, claimrole)
        {
            var xmlstring = "<input><businessdomain>" + businessdomain + "</businessdomain><servapplname>" + servapplname + "</servapplname><claimrole>" +  claimrole + "</claimrole><role>" + role + "</role></input>"
            return $http({method: 'POST',url: API_URL + '/claimqueue', data : xmlstring, headers: {"Content-Type" : 'application/xml'}})
            .then(function success(response)
            {
                return response;
            },function failure(failmessage)
            {
            	return failmessage;
            });
        }

        function unClaimQueue(businessdomain, servapplname,  role, claimrole,)
        {
            var xmlstring = "<input><businessdomain>" + businessdomain + "</businessdomain><servapplname>" + servapplname + "</servapplname><claimrole>" +  claimrole + "</claimrole><role>" + role + "</role></input>"
            console.log(xmlstring);
            return $http({method: 'POST',url: API_URL + '/unclaimapplications', data : xmlstring, headers: {"Content-Type" : 'application/xml'}})
            .then(function success(response)
            {
            	console.log('reply from server:' , response.data);
                return response;
            },function failure(failmessage)
            {
            	console.log('fail from server:', failmessage.data);
                return failmessage;
            });
        }

        function getAllTibcoQueues()
        {
          return $http.get(API_URL + '/getalltibcoqueues').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data)

                console.info("returning json from server with status ",afterCnv);
                return afterCnv;

            },function (error)
            {
              console.log("server error :", error );
            });
        }

        function GetClaimRoleList()
        {
          return $http.get(API_URL + '/getclaimrolelist').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data)

                console.log("functie get claimrolelist ophalen", afterCnv);
                return afterCnv;

            },function (error)
            {
              console.log("server error :", error );
              return error;
            });
        }

        function GetClaimedRecordsList()
        {
            return $http.get(API_URL + '/getclaimedrecords').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data)
                
                console.log("alle claimed records na conversie naar json", afterCnv.claimedrecords.record.length);
                if(afterCnv.claimedrecords.record.hasOwnProperty('length'))
                {
                    return afterCnv;
                }
                else
                {
                    var newobj = [];
                    newobj.push(afterCnv.claimedrecords.record);
                    afterCnv.claimedrecords.record = newobj;
                    console.log(afterCnv);
                    return afterCnv;
                }

            },function (error)
            {
              console.log("server error :", error );
              return error;
            });
        }

    })

})();   