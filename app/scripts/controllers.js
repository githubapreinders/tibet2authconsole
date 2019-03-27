(function ()
{
    'use strict';

    angular.module('confab')
    .controller('IndexController', function (StaticDataFactory, $sce)
    {

        console.log('IndexController');
        var vm = this;
        
        vm.submitForm = submitForm;
        
        
        vm.getLandingPage = getLandingPage;
        vm.message = "Claim Application";
        vm.htmlContent = "Filling this container with some server side html";

        getqueues();
        
        function getqueues()
        {
            vm.queues = StaticDataFactory.getQueues();
            console.log("reading...", vm.queues);
        }
        
        
        function submitForm()
        {
        	vm.distortedText = "";
        }

        function getLandingPage()
        {
            StaticDataFactory.getLandingPage().then(function(data)
            {
                vm.htmlContent = $sce.trustAsHtml(data.data);
            },
            function(error)
            {
                console.log("error..." , err);
            });
        }

    });

})();


