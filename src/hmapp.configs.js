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

    angular.module("hm.appcore").config(['$stateProvider', '$urlRouterProvider','INDEXSTATE','STATECONFIG','COMMONSTATE', function($stateProvider, $urlRouterProvider,INDEXSTATE,STATECONFIG,COMMONSTATE) {
        if(STATECONFIG!=null && STATECONFIG.length>0){

            if(INDEXSTATE!=""){
                $urlRouterProvider.otherwise(INDEXSTATE);
            }

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

    angular.module("hm.appcore").provider('test', function() {
        console.log('instance test');
        var f = function(name) {
            alert("Hello, " + name);
        };
        this.$get = function() { //一定要有！
            return f;
        };
    });

})();


