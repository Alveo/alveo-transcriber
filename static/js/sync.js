angular.module('Alveo')
.component('sync', {
    controller: function($http) {
        function pull() {
            var vm = this;
            $http.get('/request-data').then(function(response) {
                console.log("Ajax done");
                vm.data = response.data.clips;
            });
        }
        function synctest() {
            // Can we connect?
        }
        this.$onInit = function() {
            console.log(this.data);
            this.pull();
        }
        function sync() {
            // Can we connect?
            console.log(this.data);
        }
        this.sync = sync;
        this.pull = pull;
        this.synctest = synctest;
    },
    bindings: {
        data: '=',
    },
});
