(function ()
{
    'use strict';

    angular.module('claimapp')
    .controller('IndexController', function (StaticDataFactory, $scope, $uibModal)
    {

        console.log('IndexController');
        var vm = this;

        //Available function calles
        vm.unClaimQueue = unClaimQueue;
        vm.claimQueue = claimQueue;
        vm.selectQueue = selectQueue;
        vm.showResultDialog = showResultDialog;
        vm.erase = erase;

        //Global variables
        vm.selectedbusinessdomain = "";
        vm.selectedservapp = "";
        vm.itemselected  = "false";
        vm.selectedLdapGroup = "";
        vm.selectedManagementRole = "";

        vm.message = "Claim Application";
        vm.ldapgroup = "BeheerSectie4"
        vm.claimroles = ["rol1","rol2","rol3","rol4","rol5"];

        //Initialisation
        getqueues();


        //Watching the inputbox for keystrokes, adding it to a filtered list.
        $scope.$watch(function()
        {
            return vm.inputbox;
        },
        function(current, original)
        {
            if(vm.queues === undefined)
            {
                return;
            }
            if(current.length < 2)
            {
                return;
            }
            vm.queuelistFiltered=[];
            vm.queues.forEach(function(word)
            {
                if(word.toUpperCase().includes(current.toUpperCase()))
                {
                    vm.queuelistFiltered.push(word);
                }
            });

        },true);

        function erase()
        {
            vm.inputbox = "";
            document.getElementById("enterq").focus();
            vm.selecteditem = "";
        }

        //Responding to the dropdown. The displayed list will contain the queues with the same businessdomain and applicationname.
        function selectQueue(index)
        {
            console.log("businessunit: ", vm.selecteditem.split('.')[1]);
            console.log("servappname: ", vm.selecteditem.split('.')[vm.selecteditem.split('.').length-3]);
            vm.selectedbusinessdomain = vm.selecteditem.split('.')[1];
            vm.selectedservapp = vm.selecteditem.split('.')[vm.selecteditem.split('.').length-3];
            vm.applist = [];

            vm.queuelistFiltered.forEach(function(item)
            {
                if(item.split('.')[1] === vm.selectedbusinessdomain && item.split('.')[vm.selecteditem.split('.').length-3] === vm.selectedservapp)
                {
                    vm.applist.push(item);
                }
            })
        }

        //Getting all the available Tibco queues
        function getqueues()
        {
            StaticDataFactory.getAllTibcoQueues().then(function(data)
            {
                vm.queues = data.queues.queueName;
                document.getElementById("enterq").focus();
            });
        }

        function claimQueue()
        {
            console.log(vm.selecteditem, vm.selectedLdapGroup, vm.selectedManagementRole);

            if (vm.selectedLdapGroup.length === 0 || vm.selectedManagementRole.length === 0 )
            {
                alert("Please fill in the form");
                return;
            }
            return StaticDataFactory.claimQueue(vm.selecteditem,  vm.selectedManagementRole,vm.selectedLdapGroup).then(function(res)
            {
                showResultDialog(res);
            }, function(error)
            {
                showResultDialog(error);
            });
        }

        function unClaimQueue()
        {
            return StaticDataFactory.unClaimQueue(vm.selecteditem,  vm.selectedManagementRole,vm.selectedLdapGroup)
            .then(function(res)
            {
                console.log("returning unclaim" ,res);
            });
        }


        function showResultDialog(serverreponse)
        {

            var modalInstance = $uibModal.open(
            {
                templateUrl : "./views/claimresponse.html",
                controller : "showResultDialog as vm2",
                size : "md",
                resolve : {response : function ()
                    {
                        return serverreponse;
                    }}
            });
            modalInstance.result.then(
            function success(resp) {
                // console.log("response: " , resp);
                vm.iaf_url = resp.iaf_url;
                login(resp.username, resp.password);
            }, function failure(err) {
                // console.log("no result from modal...");
            });
        }






    })

    .controller('showResultDialog', function($uibModalInstance, response)
    {
        console.log("loading results...");
        var vm2 = this;
        vm2.message = response.data.message;
        vm2.closeModal = closeModal;

        function closeModal()
        {
           $uibModalInstance.dismiss();
        }
    })

})();


