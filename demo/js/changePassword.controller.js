'use strict';


angular.module("HMApp").controller("changeMyPasswordController", function($rootScope,$scope,$state,$ocLazyLoad,hmappService) {

    //$scope.fileInfos=[{
    //    "dir": "test",
    //    "fileName": "%25B4%25F3%25D6%25DA%25D3%25B0%25D4%25BA%25C6%25B5%25B5%25C0%25BC%25DB%25B8%25F1%25B1%25ED0823.doc",
    //    "fileType": ".doc",
    //    "saveName": "6ce32adc-3836-47a0-a1c1-a2b4cd602005.doc",
    //    "systemName": "testSystem",
    //}, {
    //    "dir": "test",
    //    "fileName": "000.png",
    //    "fileType": ".png",
    //    "saveName": "7793b452-39d0-4909-bc03-66c62addb333.png",
    //    "systemName": "testSystem"
    //}];

    $scope.changeMyPassword=function(){
        console.log($scope.newPassword);
        hmappService.changeMyPassword($scope.newPassword).then(function(){
            toastr.success("密码修改成功！","修改密码");
        },function(){
            toastr.error("密码修改失败！","修改密码");
        })
    }
});


