'use strict';

HMApp.constant('globalLazyLoad', [
    'js/test.service.js'
]);

HMApp.constant('STATECONFIG', [
    {
        "name":"fileUpload",
        "url":"/fileUpload",
        "templateUrl":"view/fileUpload.html",
        "data":{"pageTitle":"控件-上传附件"},
        "controller":"fileUploadController",
        "ocLazyLoad":{
          "name":"HMApp",
          insertBefore: '#ng_load_plugins_before',
          "files":[
              "js/fileUpload.controller.js",
          ]
        }
    },
    {
        "name":"changePassword",
        "url":"/changePassword",
        "templateUrl":"view/changePassword.html",
        "data":{"pageTitle":"控件-上传附件"},
        "controller":"changeMyPasswordController",
        "ocLazyLoad":{
            "name":"HMApp",
            insertBefore: '#ng_load_plugins_before',
            "files":[
                "js/changePassword.controller.js",
            ]
        }
    },
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

HMApp.controller('leftController', ['$scope', '$rootScope','$window','$state','INDEXSTATE', function($scope, $rootScope,$window,$state,INDEXSTATE) {

    $scope.$on('$viewContentLoaded', function() {

    });
    $scope.reloadRoute = function () {
        $window.location.reload();
    };

    initMenu(function(){
        if(INDEXSTATE=="" && $state.current.name==""){
            $($("#jquery-accordion-menu").find('a[href!="javascript:void(0);"]')[0]).click();
        }
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

