/***
 Metronic AngularJS App Main Script
 ***/

angular.module("hm.appcore", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngStorage",
]);

if(hmappSystemConfig!=null){
    angular.module("hm.appcore").constant('SYSNAME', hmappSystemConfig.SYSNAME);
    angular.module("hm.appcore").constant('SYSCODE', hmappSystemConfig.SYSCODE);
    angular.module("hm.appcore").constant('VERSION', hmappSystemConfig.VERSION);
    angular.module("hm.appcore").constant('GATEWAYURL', hmappSystemConfig.GATEWAYURL);
    angular.module("hm.appcore").constant('LOGINURL', hmappSystemConfig.LOGINURL);
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

angular.module("hm.appcore").factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: 'hm/img/',
        layoutCssPath: 'hm/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

angular.module("hm.appcore").controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {

    });
}]);

angular.module("hm.appcore").run(['$rootScope', 'settings', '$state','$ocLazyLoad','$location','$localStorage','$sessionStorage','SYSNAME','LOGINURL',
    function($rootScope, settings, $state,$ocLazyLoad,$location,$localStorage,$sessionStorage,SYSNAME,LOGINURL) {
    var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
    if (!token) {
        window.location=$location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/'+LOGINURL;
    }
    $ocLazyLoad.load('hm.appcore');
    $rootScope.$state = $state; // state to be accessed from view
}]);