angular.module('Alveo')
.component('session', {
    controller: function($http) {
        function login() {
            this.loggedin = true;
        }
        function logout() {
            this.loggedin = false;
            $http.get('/logout')
            // $scope.svars.selecting = true;
        }
        this.logout = logout;
        this.login = login;
    },
    bindings: {
        loggedin: '=',
        template: '@'
    },
    templateUrl: function ($element, $attrs) {
        var templates = {
            'logout': '/static/logout.html',
            'login': '/static/login.html',
        }
        return templates[$attrs.template];
    }
});
