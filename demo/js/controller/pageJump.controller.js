'use strict';


angular.module("HMApp").controller("pageJumpController", function($rootScope,$scope,$state,$ocLazyLoad,hmState) {

    $scope.showChild1=function(){
        hmState.go('pageJump.childPage');
    }

});

