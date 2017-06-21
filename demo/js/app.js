'use strict';


HMApp.constant('SYSCODE', "vcNiLigPepOzBHtV");
HMApp.constant('VERSION', "0.0.1-SNAPSHOT");

HMApp.constant('globalLazyLoad', [

]);
HMApp.constant('INDEXSTATE', "/demo");

HMApp.constant('STATECONFIG', [
  {
    "name":"demo",
    "url":"/demo",
    "templateUrl":"view/demo.html",
    "data":{"pageTitle":"收款流水-游船"},
    "controller":"demoController",
    "ocLazyLoad":{
      "name":"HMApp",
      insertBefore: '#ng_load_plugins_before',
      "files":[
          "js/demo.controller.js",
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

HMApp.controller('leftController', ['$scope', '$rootScope','$window', function($scope, $rootScope,$window) {
  $scope.$on('$viewContentLoaded', function() {

  });
    $scope.reloadRoute = function () {
        $window.location.reload();
    };

  initMenu();
  function initMenu(){
    if($("#jquery-accordion-menu").length>0){
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
    }else{
      setTimeout(function(){initMenu()},100);
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

