'use strict';

angular.module("hm.appcore").constant('globalLazyLoad', [
    'js/service/test.service.js'
]);

angular.module("hm.appcore").constant('STATECONFIG', [
    {
        "name":"fileUpload",
        "url":"/fileUpload",
        "templateUrl":"view/fileUpload.html",
        "data":{"pageTitle":"上传附件"},
        "controller":"fileUploadController",
        "ocLazyLoad":{
          "name":"HMApp",
          insertBefore: '#ng_load_plugins_before',
          "files":[
              "js/controller/fileUpload.controller.js",
          ]
        }
    },
    {
        "name":"changePassword",
        "url":"/changePassword",
        "templateUrl":"view/changePassword.html",
        "data":{"pageTitle":"修改密码"},
        "controller":"changeMyPasswordController",
        "ocLazyLoad":{
            "name":"HMApp",
            insertBefore: '#ng_load_plugins_before',
            "files":[
                "js/controller/changePassword.controller.js",
            ]
        }
    },
    {
        "name":"pageJump",
        "url":"/pageJump",
        "templateUrl":"view/pageJump.html",
        "data":{"pageTitle":"修改密码"},
        "controller":"pageJumpController",
        "ocLazyLoad":{
            "name":"HMApp",
            insertBefore: '#ng_load_plugins_before',
            "files":[
                "js/controller/pageJump.controller.js",
            ]
        }
    },
    {
        "name":"pageJump.childPage",
        "url":"/childPage",
        "templateUrl":"view/childPage.html",
        "data":{"pageTitle":"修改密码"},
        "controller":"childPageController",
        "ocLazyLoad":{
            "name":"HMApp",
            insertBefore: '#ng_load_plugins_before',
            "files":[
                "js/controller/childPage.controller.js",
            ]
        }
    },
]);

var HMApp=angular.module("HMApp",[
    "hm.appcore",
    "hm.fileupload",
]);

HMApp.controller('headerController', ['$scope', '$rootScope','$sessionStorage','hmappService', function($scope, $rootScope,$sessionStorage,hmappService) {
    $scope.$on('$viewContentLoaded', function() {

    });
    //加载用户信息
    //if($sessionStorage.userInfo==null){
    //    hmappService.getUserInfo().then(function(data){
    //        $sessionStorage.userInfo=data;
    //        $scope.userId=$sessionStorage.userInfo.loginId;
    //        $scope.roleName=$sessionStorage.userInfo.groupName;
    //    })
    //}else{
    //    $scope.userId=$sessionStorage.userInfo.loginId;
    //    $scope.roleName=$sessionStorage.userInfo.groupName;
    //}
}]);

HMApp.controller('leftController', ['$scope', '$rootScope','$window','$state','hmappService','INDEXSTATE', function($scope, $rootScope,$window,$state,hmappService,INDEXSTATE) {

    $scope.$on('$viewContentLoaded', function() {

    });
    //加载菜单信息
    //hmappService.getSidebarInfo(function(data,status,headers,config){
    //    $scope.menuInfos=data;
    //    console.log('菜单信息');
    //    console.log(data);
    //    initMenu(function(){
    //        $($("#jquery-accordion-menu").find('a[href!="javascript:void(0);"]')[0]).click();
    //    });
    //
    //})
    initMenu(function(){
        $($("#jquery-accordion-menu").find('a[href!="javascript:void(0);"]')[0]).click();
    });


    function initMenu(callback){
        console.log('$("#jquery-accordion-menu").length='+$("#jquery-accordion-menu").find('li').length)
        if($("#jquery-accordion-menu").find('li').length>0){
            $("#jquery-accordion-menu").jqueryAccordionMenu();
            $("#demo-list li").click(function(){
                $("#demo-list li.active").removeClass("active")
                $(this).parents('li').each(function () {
                    $(this).addClass('active');
                });
                $(this).addClass("active");
            });

            changeMainHeight();
            $("#jquery-accordion-menu").resize(function(){
                changeMainHeight();
            })
            if(typeof callback=='function'){
                callback();
            }
        }else{
            setTimeout(function(){
                initMenu()
                if(typeof callback=='function'){
                    callback();
                }
            },1000);
        }
    }

    function changeMainHeight(){
        var defaultHeight=700;
        $('#hm-app-main').css('min-height',(($("#jquery-accordion-menu").height()+20)>defaultHeight?$("#jquery-accordion-menu").height()+20:defaultHeight)+'px');
    }

}]);

HMApp.directive( "doExport", [ '$location','$localStorage','$sessionStorage', function( $location,$localStorage,$sessionStorage ) {
    return {
        link: function( scope, element, attrs ) {
            element.bind( "click", function() {
                method(attrs.doExport)
            });
        }
    }
}]);

