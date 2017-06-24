/**
 * Created by cbjiang on 2017/2/28.
 */

(function() {
    'use strict';

    //http拦截器
    HMApp.config(['$httpProvider',function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
    }]);

})();
