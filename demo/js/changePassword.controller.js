'use strict';


angular.module("HMApp").controller("changeMyPasswordController", function($rootScope,$scope,$state,$ocLazyLoad,hmappService) {

    $scope.changeMyPassword=function(){
        hmappService.changeMyPassword($scope.newPassword,$scope.oldPassword).then(function(data){
            if(data!=null){
                if(data.code!=null){
                    if(data.code==0){
                        toastr.success("密码修改成功！","修改密码");
                        return;
                    }else if(data.code==-1){
                        toastr.error(data.msg,"修改密码");
                        return;
                    }
                }
            }
            toastr.error("密码修改失败！","修改密码");
        },function(){
            toastr.error("密码修改失败！","修改密码");
        })
    }
});


