'use strict';


angular.module("HMApp").controller("fileUploadController", function($rootScope,$scope,$state,$ocLazyLoad,hmappService,testService) {

    $scope.changeMyPassword=function(){
        console.log($scope.newPassword);
        hmappService.changeMyPassword($scope.newPassword).then(function(){
            toastr.success("密码修改成功！","修改密码");
        },function(){
            toastr.error("密码修改失败！","修改密码");
        })
    }
});


