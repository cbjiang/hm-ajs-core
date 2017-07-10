/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    HMApp.service('testService', testService);

    testService.$inject = ['$http','$q','$sessionStorage','$localStorage','SYSCODE','GATEWAYURL'];

    function testService () {
        var service= {
        };

        return service;

    }
})();
