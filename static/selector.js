angular.module('Alveo')
.component('selector', {
    controller: function($http) {
        function edit(id) {
            this.selecting = false;
            this.clip = id;
        }
        this.edit = edit;
    },
    bindings: {
        selecting: '=',
        clip: '=',
        clips: '<',
    },
    templateUrl: 'static/selector.html'
})
.filter('durationFormat', function () {
return function (input) {
    var seconds = Math.floor((input % 60000) / 1000);
    var minutes = Math.floor(input / 60000);

    var formatted = (minutes > 0 ? minutes+' minutes': '');
    formatted += (seconds > 0 ? ' '+seconds+' seconds': '');

    return formatted;
};});
