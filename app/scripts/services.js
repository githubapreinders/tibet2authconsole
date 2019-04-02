(function(){

'use strict';
    var app = angular.module('claimapp');

    app.constant('API_URL', "http://localhost:3000");
    app.factory('StaticDataFactory', function($http, API_URL)
    {
        

        return{
            getAllTibcoQueues : getAllTibcoQueues,
            claimQueue : claimQueue,
            unClaimQueue :unClaimQueue
        };

        function claimQueue(queue,  claimrole, role)
        {
            var xmlstring = "<input><queue>" + queue + "</queue><claimrole>" + claimrole + "</claimrole><role>" + role + "</role></input>"
            console.log(xmlstring);
            return $http({method: 'POST',url: API_URL + '/claimqueue', data : xmlstring, headers: {"Content-Type" : 'application/xml'}})
            .then(function success(response)
            {
                return response;
            },function failure(failmessage)
            {
                return failmessage;
            });
        }

        function unClaimQueue(queue, claimrole, role)
        {
            var xmlstring = "<input><queue>" + queue + "</queue><claimrole>" + claimrole + "</claimrole><role>" + role + "</role></input>"
            console.log(xmlstring);
            return $http({method: 'POST',url: API_URL + '/unclaimqueue', data : xmlstring, headers: {"Content-Type" : 'application/xml'}})
            .then(function success(response)
            {

                return response;
            },function failure(failmessage)
            {
                return failmessage;
            });
        }

        function getAllTibcoQueues()
        {
          return $http.get(API_URL + '/getalltibcoqueues').then(function(data)
            {
                var afterCnv = xml.xmlToJSON(data.data)

                console.info("returnxing json from server with status ",afterCnv);
                return afterCnv;

            },function (error)
            {
              console.log("server error :", error );
            });
        }

    })

    .directive('customDirective', function($compile)
    {
        return {
        restrict:  'E',
        template:'<div  ng-bind-html="vm.htmlContent"></div>'
        };
    });

})();   