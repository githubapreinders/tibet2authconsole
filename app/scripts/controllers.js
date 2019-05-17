(function () {
    'use strict';

    angular.module('claimapp')
        .controller('IndexController', function (StaticDataFactory, $scope, $uibModal, $timeout) {

            console.log('IndexController');
            var vm = this;

            //Available function calles
            vm.unClaimQueue = unClaimQueue;
            vm.claimQueue = claimQueue;
            vm.selectQueue = selectQueue;
            vm.showResultDialog = showResultDialog;
            vm.showinfomodal = showinfomodal;
            vm.showinfomodal2 = showinfomodal2;
            vm.erase = erase;

            //Global variables
            vm.selectedbusinessdomain = "";
            vm.selectedservapp = "";
            vm.itemselected = "false";
            vm.selectedLdapGroup = "";
            vm.selectedManagementRole = "";
            vm.disableButton = false;
            vm.message = "Claim Application";
            vm.message2 = "My Claimed Applications";
            vm.dummy = "dummy informatie voor de ingelogde user";
            vm.ldapgroup = "BeheerSectie4";
            vm.claimRoles = [];

            //Initialisation, making sure this happens after services.js initialises the API-urls.
            $timeout(function()
            {
                getAvailableRoles();
                getqueues();
                getclaimedrecordslist();
            },0);
            

            //Watching the inputbox for keystrokes, adding it to a filtered list.
            $scope.$watch(function () {
                return vm.inputbox;
            },
                function (current, original) {
                    if (vm.queues === undefined) {
                        return;
                    }
                    if (current.length < 2) {
                        return;
                    }
                    vm.queuelistFiltered = [];
                    vm.queues.forEach(function (queueobject) {
                        if (queueobject.name.toUpperCase().includes(current.toUpperCase())) {
                            vm.queuelistFiltered.push(queueobject.name);
                        }
                    });

                }, true);

            function erase() {
                vm.inputbox = "";
                document.getElementById("enterq").focus();
                vm.selecteditem = "";
            }

            //Responding to the dropdown. The displayed list will contain the queues with the same businessdomain and applicationname.
            function selectQueue(index) {
                if (vm.selecteditem === null) return;

                var qnamearray = vm.selecteditem.split('.');
                switch (qnamearray[0].toUpperCase()) {
                    case "ESB":
                        {
                            vm.selectedservapp = vm.selecteditem.split('.')[3];
                            break;

                        }
                    case "DS":
                        {
                            vm.selectedservapp = vm.selecteditem.split('.')[2];
                            break;

                        }
                    case "P2P":
                        {
                            vm.selectedservapp = vm.selecteditem.split('.')[2];
                            break;
                        }
                }

                vm.selectedbusinessdomain = vm.selecteditem.split('.')[1];
                var appobj = {};
                console.log("length of filteredlist: ", vm.queuelistFiltered.length);
                vm.applist = [];
                console.log(vm.selectedbusinessdomain, vm.selectedservapp);
                vm.queues.forEach(function (item) {
                    // console.log(item);
                    if (item.servapplname === vm.selectedservapp && item.businessdomain === vm.selectedbusinessdomain) {
                        vm.applist.push(item.name);
                    }
                });
            }

            //Getting a list of all available claim roles
            function getAvailableRoles() {
                StaticDataFactory.getAvailableRoles().then(function (data) {
                    vm.claimRoles = data.roles.role;
                    vm.selectedManagementRole = vm.claimRoles[0];
                    console.log("ClaimRoles die binnenkomen:", elem);
                });
            }

            // Getting a list of all my claimed records
            function getclaimedrecordslist() {
                StaticDataFactory.GetClaimedRecordsList().then(function (data) {
                    vm.claimedRecords = data.claimedrecords;
                    console.log("ClaimRecords die binnenkomen:", data.claimedrecords);
                });
            }

            //Getting all the available Tibco queues
            function getqueues() {
                StaticDataFactory.getAllTibcoQueues().then(function (data) {
                    vm.queues = data.queues.queue;
                    document.getElementById("enterq").focus();
                    console.log("asd", vm.queues[0].name);
                });
            }

            function claimQueue() {
                vm.disableButton = !vm.disableButton;
                Pace.start();
                console.log(vm.selectedbusinessdomain, vm.selectedservapp, vm.selectedLdapGroup, vm.selectedManagementRole);

                if (vm.selectedLdapGroup.length === 0 || vm.selectedManagementRole.length === 0) {
                    alert("Please fill in the form");
                    vm.disableButton = !vm.disableButton;
                    return;
                }
                return StaticDataFactory.claimQueue(vm.selectedbusinessdomain, vm.selectedservapp, vm.selectedLdapGroup, vm.selectedManagementRole).then(function (res) {
                    showResultDialog(res);
                    getclaimedrecordslist();
                    vm.disableButton = !vm.disableButton;
                }, function (error) {
                    showResultDialog(error);
                });
            }

            function unClaimQueue(index) {
                vm.disableButton = !vm.disableButton;
                var itemtodelete = vm.claimedRecords.record[index];
                console.log(itemtodelete)
                return StaticDataFactory.unClaimQueue(itemtodelete.businessdomain, itemtodelete.servapplname, itemtodelete.role, itemtodelete.claimrole)
                    .then(function (res) {

                        vm.claimedRecords.record.splice(index, 1);
                        showResultDialog(res);
                        vm.disableButton = !vm.disableButton;
                    }, function (error) {
                        showResultDialog(error);
                    });
            }

            function showResultDialog(serverreponse) {
                var modalInstance = $uibModal.open(
                    {
                        templateUrl: "./views/claimresponse.html",
                        controller: "showResultDialog as vm2",
                        size: "lg",
                        resolve: {
                            response: function () {
                                return serverreponse;
                            }
                        }
                    });
                modalInstance.result.then(
                    function success(resp) {

                    }, function failure(err) {

                    });
            }

            function showinfomodal() {
                var modalInstance = $uibModal.open(
                    {
                        templateUrl: "./views/infomodal.html",
                        controller: "showInfoModal as vm3",
                        size: "lg"

                    });
                modalInstance.result.then(
                    function success(resp) {

                    }, function failure(err) {

                    });

            }

            function showinfomodal2() {
                console.log("show info my claimed queues....");
                showResultDialog({ data: "Some info about show info my claimed queues." })
            }

        })

        //info modal rechts bovenin
        .controller('showInfoModal', function ($uibModalInstance) {
            console.log("laat info modal zien...");

            var vm3 = this;
            vm3.closeModal = closeModal;

            function closeModal() {
                $uibModalInstance.dismiss();
            }
        })

        .controller('showResultDialog', function ($uibModalInstance, response) {
            console.log("loading results...");
            var vm2 = this;
            vm2.message = response.data;
            vm2.closeModal = closeModal;

            function closeModal() {
                $uibModalInstance.dismiss();
            }
        })

})();


