angular.module('Alveo', ['ngStorage'])
.controller('AlveoController', function AlveoController($scope, $localStorage) {
    this.loggedin = false;
    this.cache = $localStorage.$default({
            'selecting': true,
            'clip': 0,
            'host_addr': "127.0.0.1:5000",
            'clips': [],
    });
});
