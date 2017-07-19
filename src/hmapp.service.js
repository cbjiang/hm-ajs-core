/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    angular.module("hm.appcore").service('hmappService', hmappService);

    hmappService.$inject = ['$http','$q','auth','SYSCODE','GATEWAYURL'];

    function hmappService ($http,$q,auth,SYSCODE,GATEWAYURL) {
        var service= {
            getSidebarInfo:getBar,
            getUserInfo:getUserInfo,
            changeMyPassword:changeMyPassword,
        };

        return service;

        function getBar(callback){
            if($sessionStorage.userInfo==null){
                getUserInfo().then(function(data){
                    $sessionStorage.userInfo=data;
                    getSidebarInfo(callback)
                })
            }else{
                getSidebarInfo(callback)
            }
        }

        function getSidebarInfo(callback){
            $http({
                method:'GET',
                url:GATEWAYURL+'hmmsuser/api/tb_users/queryMenu',
                params:{
                    loginId:$sessionStorage.userInfo.loginId,
                    sysKey:SYSCODE
                },
                data:{}
            }).success(function(data,status,headers,config){
                if(data.list.length==0){
                    $('.page-spinner-bar').removeClass('hide');
                    $('body').addClass('page-on-load');
                    toastr.error('您没有权限进入该系统!', '登陆失败')
                    setTimeout(function(){
                        auth.doLogout();
                    },2000);
                }

                callback(data.list,status,headers,config);
            }).error(function(data,status,headers,config){
                callback(data,status,headers,config);
            })
        }

        function getUserInfo(){
            var deferred = $q.defer();
            $http({
                method:'GET',
                url:GATEWAYURL+'hmmsuser/api/tb_user',
                params:{},
                data:{}
            }).success(function(data,status,headers,config){
                deferred.resolve(data);
            }).error(function(data,status,headers,config){
                deferred.reject(data);
            })
            return deferred.promise;
        }

        function changeMyPassword(password,oldPassowrd){
            var deferred = $q.defer();
            $http({
                method:'POST',
                url:GATEWAYURL+'api/account/change_my_password',
                params:{},
                data:{
                    password:password,
                    oldPassword:oldPassowrd
                }
            }).success(function(data,status,headers,config){
                deferred.resolve(data);
            }).error(function(data,status,headers,config){
                deferred.reject(data);
            })
            return deferred.promise;
        }
    }
})();
