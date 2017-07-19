/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    //延迟加载
    angular.module("hm.appcore").config(['$ocLazyLoadProvider','globalLazyLoad',function($ocLazyLoadProvider,globalLazyLoad) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
            modules: [
                {
                    name: 'hm.appcore',
                    insertBefore: '#ng_load_plugins_before',
                    files: globalLazyLoad.concat([

                    ])
                }
            ]
        });
    }]);

    angular.module("hm.appcore").config(['$controllerProvider',function($controllerProvider) {
        $controllerProvider.allowGlobals();
    }]);

    angular.module("hm.appcore").config(['$stateProvider', '$urlRouterProvider','STATECONFIG','COMMONSTATE', function($stateProvider, $urlRouterProvider,STATECONFIG,COMMONSTATE) {
        if(STATECONFIG!=null && STATECONFIG.length>0){

            angular.forEach(STATECONFIG, function(stateInfo) {
                $stateProvider.state(stateInfo.name, {
                    url: stateInfo.url,
                    params: stateInfo.params,
                    templateUrl: stateInfo.templateUrl,
                    data: stateInfo.data,
                    controller: stateInfo.controller,
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load($.extend({serie: true},stateInfo.ocLazyLoad));
                        }]
                    }
                });
            });

            angular.forEach(COMMONSTATE, function(stateInfo) {
                $stateProvider.state(stateInfo.name, {
                    url: stateInfo.url,
                    params: stateInfo.params,
                    templateUrl: stateInfo.templateUrl,
                    data: stateInfo.data,
                    controller: stateInfo.controller,
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load($.extend({serie: true},stateInfo.ocLazyLoad));
                        }]
                    }
                });
            });

        }
    }]);

})();


