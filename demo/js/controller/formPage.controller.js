'use strict';


angular.module("HMApp").controller("formPageController", function($rootScope,$scope,$state,$ocLazyLoad,hmState) {

    $scope.point=3;

    $scope.pointChange=function(){
        console.log($(this));
    }

    $scope.textarea1='abc'

});

