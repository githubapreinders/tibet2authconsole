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
        vm.showinfomodal = showinfomodal;
        vm.erase = erase;

        //Global variables
        vm.selectedbusinessdomain = "";
        vm.selectedservapp = "";
        vm.itemselected  = "false";
        vm.selectedLdapGroup = "";
        vm.selectedManagementRole = "" ;

        vm.message = "Claim Application";
        vm.message2 = "My Claimed Queues";
        vm.dummy = "dummy informatie voor de ingelogde user";
        vm.ldapgroup = "BeheerSectie4";
        vm.claimRoles = [];
        vm.myclaimedroles = {
            "claimedrecords": {
              "record": [
                {
                  "bd": "bd-dummy",
                  "sa": "sa-dummy",
                  "cr": "piet puk",
                  "q": [
                    "q1",
                    "q2",
                    "q3",
                    "q9",
                    "q10",
                    "q11",
                    "q12",
                    "q13",
                    "q14"
                  ]
                },
                {
                  "bd": "bd-dummy2",
                  "sa": "sa-dummy2",
                  "cr": "piet puk",
                  "q": [
                    "q4",
                    "q5",
                    "q6"
                  ]
                },
                {
                  "bd": "bd-dummy3",
                  "sa": "sa-dummy3",
                  "cr": "rol3",
                  "q": [
                    "q7",
                    "q8",
                    "q9"
                  ]
                }
              ]
            }
          }

          console.log("nieuw project Get Claimed Records",vm.myclaimedroles.claimedrecords.record);

        //Initialisation
        getqueues();
        getclaimrolelist();
        // getclaimedrecordslist();
       
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
            vm.queues.forEach(function(queueobject)
            {
                if(queueobject.name.toUpperCase().includes(current.toUpperCase()))
                {
                    vm.queuelistFiltered.push(queueobject.name);
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
            var qnamearray = vm.selecteditem.split('.');
            switch(qnamearray[0].toUpperCase())
            {
	            case "ESB" :
	            {
	            	console.log("esb");
	            	if(qnamearray.length === 9)
	            	{
	            		vm.selectedservapp = vm.selecteditem.split('.')[6];
	            	}
	            	if(qnamearray.length === 8)
	            	{
	            		vm.selectedservapp = vm.selecteditem.split('.')[5];
	            	}
	            	break;

	            }
	            case "P2P" :
	            {
	            	console.log("p2p");
	            	vm.selectedservapp = vm.selecteditem.split('.')[3];
	            	break;
	            }
            }

            vm.selectedbusinessdomain = vm.selecteditem.split('.')[1];

        	console.log("businessunit: ", vm.selectedbusinessdomain);
            console.log("servappname: ", vm.selectedservapp);

            var appobj = {};

            vm.queuelistFiltered.forEach(function(item)
            {
                if(item.split('.')[1] === vm.selectedbusinessdomain && item.includes('.' + vm.selectedservapp + '.'))
                {
                	appobj[item] = 'true';
                }
            })

            vm.applist = [];
            Object.keys(appobj).forEach(function(key)
            {
            		vm.applist.push(key);
            });

        }

        //Getting a list of all available claim roles
        function getclaimrolelist()
        {
            StaticDataFactory.GetClaimRoleList().then(function(data)
            {
                vm.claimRoles = data.roles.role;
                console.log("ClaimRoles die binnenkomen:", data.roles.role[1]);
            });
        }

        //Getting a list of all my claimed records
        // function getclaimedrecordslist()
        // {
        //     StaticDataFactory.GetClaimedRecordsList().then(function(data)
        //     {
        //         vm.claimedRoles = data.roles.role;
        //         console.log("ClaimRecords die binnenkomen:", data.roles.role[1]);
        //     });
        // }

        //Getting all the available Tibco queues
        function getqueues()
        {
            StaticDataFactory.getAllTibcoQueues().then(function(data)
            {
                vm.queues = data.queues.queue;
                document.getElementById("enterq").focus();
                console.log("asd" , vm.queues[0].name);
            });
        }

        function claimQueue()
        {
            Pace.start();
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
            	showResultDialog(res);
            }, function (error)
            {
            	showResultDialog(error);
            });
        }

        function showResultDialog(serverreponse)
        {
            var modalInstance = $uibModal.open(
            {
                templateUrl : "./views/claimresponse.html",
                controller : "showResultDialog as vm2",
                size : "lg",
                resolve : {response : function ()
                    {
                        return serverreponse;
                    }}
            });
            modalInstance.result.then(
            function success(resp) {

            }, function failure(err) {

            });
        }

        function showinfomodal()
        {
        	console.log("show info....");
        	showResultDialog({data: "Some info about the application."})
        }

    })

    .controller('showResultDialog', function($uibModalInstance, response)
    {
        console.log("loading results...");
        var vm2 = this;
        vm2.message = response.data;
        vm2.closeModal = closeModal;

        function closeModal()
        {
           $uibModalInstance.dismiss();
        }
    })

})();


