/***
 Metronic AngularJS App Main Script
 ***/

var HMApp = angular.module("HMApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngStorage",
    "ngFileUpload"
]);

HMApp.constant('COMMONSTATE', [
    {
        "name":"403",
        "url":"/403.html",
        "templateUrl":"hm/views/403.html",
        "data":{"pageTitle":"403 - 禁止访问: 访问被拒绝。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"HMApp",
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
            "name":"HMApp",
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
            "name":"HMApp",
            "files":[
            ]
        }
    },
]);

HMApp.factory('settings', ['$rootScope', function($rootScope) {
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

HMApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {

    });
}]);

HMApp.run(["$rootScope", "settings", "$state","$ocLazyLoad", function($rootScope, settings, $state,$ocLazyLoad) {
    //$ocLazyLoad.load('HMApp');
    $rootScope.$state = $state; // state to be accessed from view
}]);

function sleep(d){
    for(var t = Date.now();Date.now() - t <= d;);
}