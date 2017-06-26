angular.module('Alveo')
.component('annotator', {
    controller: function() {
        function complete() {
            this.selecting = true;
        }
        this.complete = complete;
    },
    bindings: {
        selecting: '=',
        clip: '=',
    },
    templateUrl: 'static/annotator.html'
});
