/***
 Metronic AngularJS App Main Script
 ***/

angular.module("hm.appcore", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngStorage",
    "ngCookies",
]);

if(hmappSystemConfig!=null){
    angular.module("hm.appcore").constant('SYSNAME', hmappSystemConfig.SYSNAME);
    angular.module("hm.appcore").constant('SYSCODE', hmappSystemConfig.SYSCODE);
    angular.module("hm.appcore").constant('VERSION', hmappSystemConfig.VERSION);
    angular.module("hm.appcore").constant('GATEWAYURL', hmappSystemConfig.GATEWAYURL);
    angular.module("hm.appcore").constant('LOGINURL', hmappSystemConfig.LOGINURL);
    angular.module("hm.appcore").constant('LOGOUTURL', hmappSystemConfig.LOGOUTURL);
    angular.module("hm.appcore").constant('INDEXURL', hmappSystemConfig.INDEXURL);
}

angular.module("hm.appcore").constant('COMMONSTATE', [
    {
        "name":"403",
        "url":"/403.html",
        "templateUrl":"hm/views/403.html",
        "data":{"pageTitle":"403 - 禁止访问: 访问被拒绝。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"hm.appcore",
            "files":[
            ]
        }
    },
    {
        "name":"404",
        "url":"/404.html",
        "templateUrl":"hm/views/404.html",
        "data":{"pageTitle":"404 - 找不到文件或目录。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"hm.appcore",
            "files":[
            ]
        }
    },
    {
        "name":"500",
        "url":"/500.html",
        "templateUrl":"hm/views/500.html",
        "data":{"pageTitle":"500 - 内部服务器错误。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"hm.appcore",
            "files":[
            ]
        }
    },
]);

angular.module("hm.appcore").controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {

    });
    console.log('AppController');
}]);

angular.module("hm.appcore").run(['$rootScope', '$state','$ocLazyLoad','$location','auth',function($rootScope, $state,$ocLazyLoad,$location,auth) {
    console.log('do run');
    //检查url参数
    auth.saveToken();
    $ocLazyLoad.load('hm.appcore');
    $rootScope.$state = $state; // state to be accessed from view
}]);