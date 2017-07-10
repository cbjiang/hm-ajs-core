'use strict';


angular.module("HMApp").controller("childPageController", function($rootScope,$scope,$state,$ocLazyLoad,hmState) {

    $scope.random=Math.random();

    $scope.save=function(){
        hmState.back(function(){
            $scope.refresh();
        })
    }

});


