/***
 Metronic AngularJS App Main Script
 ***/

angular.module("hm.appcore", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngStorage",
]);

if(hmappSystemConfig!=null){
    angular.module("hm.appcore").constant('SYSNAME', hmappSystemConfig.SYSNAME);
    angular.module("hm.appcore").constant('SYSCODE', hmappSystemConfig.SYSCODE);
    angular.module("hm.appcore").constant('VERSION', hmappSystemConfig.VERSION);
    angular.module("hm.appcore").constant('GATEWAYURL', hmappSystemConfig.GATEWAYURL);
    angular.module("hm.appcore").constant('LOGINURL', hmappSystemConfig.LOGINURL);
    angular.module("hm.appcore").constant('INDEXSTATE', hmappSystemConfig.INDEXSTATE);
}

angular.module("hm.appcore").constant('COMMONSTATE', [
    {
        "name":"403",
        "url":"/403.html",
        "templateUrl":"hm/views/403.html",
        "data":{"pageTitle":"403 - 禁止访问: 访问被拒绝。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"hm.appcore",
            "files":[
            ]
        }
    },
    {
        "name":"404",
        "url":"/404.html",
        "templateUrl":"hm/views/404.html",
        "data":{"pageTitle":"404 - 找不到文件或目录。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"hm.appcore",
            "files":[
            ]
        }
    },
    {
        "name":"500",
        "url":"/500.html",
        "templateUrl":"hm/views/500.html",
        "data":{"pageTitle":"500 - 内部服务器错误。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"hm.appcore",
            "files":[
            ]
        }
    },
]);

angular.module("hm.appcore").factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: true, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: 'hm/img/',
        layoutCssPath: 'hm/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

angular.module("hm.appcore").controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {

    });
}]);

angular.module("hm.appcore").run(['$rootScope', 'settings', '$state','$ocLazyLoad','$location','$localStorage','$sessionStorage','SYSNAME','LOGINURL',
    function($rootScope, settings, $state,$ocLazyLoad,$location,$localStorage,$sessionStorage,SYSNAME,LOGINURL) {
    var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
    if (!token) {
        window.location=$location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/'+LOGINURL;
    }
    $ocLazyLoad.load('hm.appcore');
    $rootScope.$state = $state; // state to be accessed from view
}]);
/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    //延迟加载
    angular.module("hm.appcore").config(['$ocLazyLoadProvider','globalLazyLoad',function($ocLazyLoadProvider,globalLazyLoad) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
            modules: [
                {
                    name: 'hm.appcore',
                    insertBefore: '#ng_load_plugins_before',
                    files: globalLazyLoad.concat([

                    ])
                }
            ]
        });
    }]);

    angular.module("hm.appcore").config(['$controllerProvider',function($controllerProvider) {
        $controllerProvider.allowGlobals();
    }]);

    angular.module("hm.appcore").config(['$stateProvider', '$urlRouterProvider','INDEXSTATE','STATECONFIG','COMMONSTATE', function($stateProvider, $urlRouterProvider,INDEXSTATE,STATECONFIG,COMMONSTATE) {
        if(STATECONFIG!=null && STATECONFIG.length>0){

            if(INDEXSTATE!=""){
                $urlRouterProvider.otherwise(INDEXSTATE);
            }

            angular.forEach(STATECONFIG, function(stateInfo) {
                $stateProvider.state(stateInfo.name, {
                    url: stateInfo.url,
                    params: stateInfo.params,
                    templateUrl: stateInfo.templateUrl,
                    data: stateInfo.data,
                    controller: stateInfo.controller,
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load($.extend({serie: true},stateInfo.ocLazyLoad));
                        }]
                    }
                });
            });

            angular.forEach(COMMONSTATE, function(stateInfo) {
                $stateProvider.state(stateInfo.name, {
                    url: stateInfo.url,
                    params: stateInfo.params,
                    templateUrl: stateInfo.templateUrl,
                    data: stateInfo.data,
                    controller: stateInfo.controller,
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load($.extend({serie: true},stateInfo.ocLazyLoad));
                        }]
                    }
                });
            });
        }
    }]);

    angular.module("hm.appcore").provider('test', function() {
        console.log('instance test');
        var f = function(name) {
            alert("Hello, " + name);
        };
        this.$get = function() { //一定要有！
            return f;
        };
    });

})();




angular.module("hm.appcore").directive( "ngDoLogout", [ '$location','$localStorage','$sessionStorage', function( $location,$localStorage,$sessionStorage ) {
    return {
        link: function( scope, element, attrs ) {
            element.bind( "click", function() {
                doLogout();
            });
        }
    }

    function doLogout(){
        delete $localStorage.authenticationToken;
        delete $sessionStorage.authenticationToken;
        delete $sessionStorage.userInfo;
        window.location.reload();
    }
}]);

angular.module("hm.appcore").directive('ngSpinnerBar', ['$rootScope', '$location', '$localStorage', '$sessionStorage', '$state', 'SYSNAME', 'LOGINURL',
    function($rootScope,$location,$localStorage,$sessionStorage,$state,SYSNAME,LOGINURL) {
        return {
            link: function(scope, element, attrs) {

                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    if($location.absUrl()!=LOGINURL){
                        var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
                        if (!token) {
                            window.location=$location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/'+LOGINURL;
                        }
                    }
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    setTimeout(function(){
                        matchMenu(function(){
                            element.addClass('hide'); // hide spinner bar
                            $('body').removeClass('page-on-load'); // remove page loading indicator

                            // auto scorll to page top
                            //setTimeout(function () {
                            //    FrameAPI.scrollTop(); // scroll to the top on content load
                            //}, $rootScope.settings.layout.pageAutoScrollOnLoad);
                        })
                    },1000)
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

function matchMenu(callback){
    if($('#jquery-accordion-menu').find('li').length>0){
        Layout.setSidebarMenuActiveLink('match');
        callback();
    }else{
        setTimeout(function(){matchMenu(callback)},100);
    }
}


// Handle global LINK click
angular.module("hm.appcore").directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});


// Handle Dropdown Hover Plugin Integration
angular.module("hm.appcore").directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});


angular.module("hm.appcore").directive( "ngPageUtil", ['$compile',function( $compile ) {

    var _watchers=[]

    return {
        link:function( scope, element, attrs ){
            refresh(scope,element);
            _watchers.push(scope.$watch('total',function(newValue,oldValue,scope){
                refresh(scope,element);
            }));
            scope.$on('$destroy', function() {
                while (_watchers.length) {
                    _watchers.shift()();
                }
            });
        }
    }

    function refresh(scope,element){
        element.empty();
        var page=scope.page;
        var total=scope.total;
        if(total==null){
            setTimeout(function(){refresh(scope,element)},100);
            return;
        }
        var size=scope.size;

        var lastPage=Math.ceil(total/size);
        var numFrom=(page-1)*size+1;
        var numTo=page*size>total?total:page*size;

        var infoTemp='<p>当前显示<span>'+numFrom+'到'+numTo+'</span>条，共<span>'+total+'</span>条记录</p>';
        $(element[0]).append(infoTemp);

        var pageItemTemp='<li ng-class="{\'active\':page=={pageNum}}"><a ng-click="loadPage({page})">{pageStr}</a></li>';
        var ellipsisItemTemp='<li class="disabled"><a>...</a></li>';
        var previous='<li class="{disabled}"><a ng-click="loadPage({page})" aria-label="Previous"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></a></li>';
        var next='<li class="{disabled}"><a ng-click="loadPage({page})" aria-label="Next"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></a></li>';
        var str='';
        if(page==1){
            str=str+previous.replace('{disabled}','disabled').replace('{page}',1);
        }else{
            str=str+previous.replace('{disabled}','').replace('{page}',page-1);
        }
        if(lastPage<=7){
            for(var i=0;i<lastPage;i++){
                str=str+pageItemTemp.replace('{pageNum}',i+1).replace('{page}',i+1).replace('{pageStr}',i+1);
            }
        }else{
            str=str+pageItemTemp.replace('{pageNum}',1).replace('{page}',1).replace('{pageStr}',1);
            if(page<=4){
                str=str+pageItemTemp.replace('{pageNum}',2).replace('{page}',2).replace('{pageStr}',2);
                str=str+pageItemTemp.replace('{pageNum}',3).replace('{page}',3).replace('{pageStr}',3);
                str=str+pageItemTemp.replace('{pageNum}',4).replace('{page}',4).replace('{pageStr}',4);
                str=str+pageItemTemp.replace('{pageNum}',5).replace('{page}',5).replace('{pageStr}',5);
                str=str+ellipsisItemTemp;
            }else if(page>=lastPage-3){
                str=str+ellipsisItemTemp;
                str=str+pageItemTemp.replace('{pageNum}',lastPage-4).replace('{page}',lastPage-4).replace('{pageStr}',lastPage-4);
                str=str+pageItemTemp.replace('{pageNum}',lastPage-3).replace('{page}',lastPage-3).replace('{pageStr}',lastPage-3);
                str=str+pageItemTemp.replace('{pageNum}',lastPage-2).replace('{page}',lastPage-2).replace('{pageStr}',lastPage-2);
                str=str+pageItemTemp.replace('{pageNum}',lastPage-1).replace('{page}',lastPage-1).replace('{pageStr}',lastPage-1);
            }else{
                str=str+ellipsisItemTemp;
                str=str+pageItemTemp.replace('{pageNum}',page-1).replace('{page}',page-1).replace('{pageStr}',page-1);
                str=str+pageItemTemp.replace('{pageNum}',page).replace('{page}',page).replace('{pageStr}',page);
                str=str+pageItemTemp.replace('{pageNum}',page+1).replace('{page}',page+1).replace('{pageStr}',page+1);
                str=str+ellipsisItemTemp;
            }
            str=str+pageItemTemp.replace('{pageNum}',lastPage).replace('{page}',lastPage).replace('{pageStr}',lastPage);
        }
        if(page==lastPage){
            str=str+next.replace('{disabled}','disabled').replace('{page}',lastPage);
        }else{
            str=str+next.replace('{disabled}','').replace('{page}',page+1);
        }
        $(element[0]).append($compile('<ul  class="pagination">'+str+'</ul>')(scope));
        element.find('li').on('click',function(){
            if(!$(this).hasClass('disabled')){
                refresh(scope,element);
            }
        });

    }

}]);

angular.module("hm.appcore").directive( "ngGoBack", ['$window',function( $window ) {
    return {
        link:function( scope, element, attrs ){
            element.on('click',function(e){
                $window.history.back();
                e.stopPropagation();
            })
        }
    }
}]);

var outClass,inClass;
angular.module("hm.appcore").factory("hmState",['$state',function($state){

    var i=0;

    function getClass(animation){
        switch(animation) {

            case 1:
                outClass = 'hm-page-moveToLeftFade';
                inClass = 'hm-page-moveFromRightFade';
                break;
            case 2:
                outClass = 'hm-page-moveToTopFade';
                inClass = 'hm-page-moveFromBottomFade';
                break;
            case 3:
                outClass = 'hm-page-moveToBottomFade';
                inClass = 'hm-page-moveFromTopFade';
                break;
            case 4:
                outClass = 'hm-page-scaleDown';
                inClass = 'hm-page-scaleUpDown hm-page-delay300';
                break;
            case 5:
                outClass = 'hm-page-scaleDownUp';
                inClass = 'hm-page-scaleUp hm-page-delay300';
                break;
            case 6:
                outClass = 'hm-page-moveToLeft hm-page-ontop';
                inClass = 'hm-page-scaleUp';
                break;
            case 7:
                outClass = 'hm-page-scaleDownCenter';
                inClass = 'hm-page-scaleUpCenter hm-page-delay400';
                break;
            case 8:
                outClass = 'hm-page-rotateBottomSideFirst';
                inClass = 'hm-page-moveFromBottom hm-page-delay200 hm-page-ontop';
                break;
            case 9:
                outClass = 'hm-page-flipOutRight';
                inClass = 'hm-page-flipInLeft hm-page-delay500';
                break;
            case 10:
                outClass = 'hm-page-flipOutLeft';
                inClass = 'hm-page-flipInRight hm-page-delay500';
                break;
            case 11:
                outClass = 'hm-page-flipOutTop';
                inClass = 'hm-page-flipInBottom hm-page-delay500';
                break;
            case 12:
                outClass = 'hm-page-flipOutBottom';
                inClass = 'hm-page-flipInTop hm-page-delay500';
                break;
            case 13:
                outClass = 'hm-page-rotateFall hm-page-ontop';
                inClass = 'hm-page-scaleUp';
                break;
            case 14:
                outClass = 'hm-page-rotateOutNewspaper';
                inClass = 'hm-page-rotateInNewspaper hm-page-delay500';
                break;
            case 15:
                outClass = 'hm-page-rotatePushLeft';
                inClass = 'hm-page-rotatePullRight hm-page-delay180';
                break;
            case 16:
                outClass = 'hm-page-rotatePushRight';
                inClass = 'hm-page-rotatePullLeft hm-page-delay180';
                break;
            case 17:
                outClass = 'hm-page-rotatePushTop';
                inClass = 'hm-page-rotatePullBottom hm-page-delay180';
                break;
            case 18:
                outClass = 'hm-page-rotatePushBottom';
                inClass = 'hm-page-rotatePullTop hm-page-delay180';
                break;
            case 19:
                outClass = 'hm-page-moveToRightFade';
                inClass = 'hm-page-rotateUnfoldLeft';
                break;
            case 20:
                outClass = 'hm-page-moveToLeftFade';
                inClass = 'hm-page-rotateUnfoldRight';
                break;
            case 21:
                outClass = 'hm-page-moveToBottomFade';
                inClass = 'hm-page-rotateUnfoldTop';
                break;
            case 22:
                outClass = 'hm-page-moveToTopFade';
                inClass = 'hm-page-rotateUnfoldBottom';
                break;
            case 23:
                outClass = 'hm-page-rotateRoomLeftOut hm-page-ontop';
                inClass = 'hm-page-rotateRoomLeftIn';
                break;
            case 24:
                outClass = 'hm-page-rotateRoomRightOut hm-page-ontop';
                inClass = 'hm-page-rotateRoomRightIn';
                break;
            case 25:
                outClass = 'hm-page-rotateRoomTopOut hm-page-ontop';
                inClass = 'hm-page-rotateRoomTopIn';
                break;
            case 26:
                outClass = 'hm-page-rotateRoomBottomOut hm-page-ontop';
                inClass = 'hm-page-rotateRoomBottomIn';
                break;
            case 27:
                outClass = 'hm-page-rotateCubeLeftOut hm-page-ontop';
                inClass = 'hm-page-rotateCubeLeftIn';
                break;
            case 28:
                outClass = 'hm-page-rotateCubeRightOut hm-page-ontop';
                inClass = 'hm-page-rotateCubeRightIn';
                break;
            case 29:
                outClass = 'hm-page-rotateCubeTopOut hm-page-ontop';
                inClass = 'hm-page-rotateCubeTopIn';
                break;
            case 30:
                outClass = 'hm-page-rotateCubeBottomOut hm-page-ontop';
                inClass = 'hm-page-rotateCubeBottomIn';
                break;
            case 31:
                outClass = 'hm-page-rotateCarouselLeftOut hm-page-ontop';
                inClass = 'hm-page-rotateCarouselLeftIn';
                break;
            case 32:
                outClass = 'hm-page-rotateCarouselRightOut hm-page-ontop';
                inClass = 'hm-page-rotateCarouselRightIn';
                break;
            case 33:
                outClass = 'hm-page-rotateCarouselTopOut hm-page-ontop';
                inClass = 'hm-page-rotateCarouselTopIn';
                break;
            case 34:
                outClass = 'hm-page-rotateCarouselBottomOut hm-page-ontop';
                inClass = 'hm-page-rotateCarouselBottomIn';
                break;
            case 35:
                outClass = 'hm-page-rotateSidesOut';
                inClass = 'hm-page-rotateSidesIn hm-page-delay200';
                break;
            case 36:
                outClass = 'hm-page-rotateSlideOut';
                inClass = 'hm-page-rotateSlideIn';
                break;
        }
    }

    function go(url,params,callback){
        if(i==36){
            i=0
        }
        getClass(++i);
        $('.main-view').toggleClass().addClass('main-view hm-page').addClass(outClass);
        $state.go(url,params);
        $('.child-view').toggleClass().addClass('child-view hm-page').addClass(inClass).addClass('hm-page-current');
        console.log('go');
        setTimeout(function(){
            $('.main-view').removeClass('hm-page-current');
            if(typeof callback == 'function'){
                callback();
            }
        },600)

    }

    return{
        go:go,
    }

}]);

angular.module("hm.appcore").directive("hmStateGoBack",['$window',function( $window ) {
    return {
        link:function( scope, element, attrs ){
            element.on('click',function(e){
                $('.child-view').toggleClass().addClass('child-view hm-page').addClass(outClass);
                $('.main-view').toggleClass().addClass('main-view hm-page').addClass(inClass).addClass('hm-page-current');
                setTimeout(function(){
                    $('.child-view').removeClass('hm-page-current');
                    if(typeof callback == 'function'){
                        callback();
                    }
                },600)
                $window.history.back();
                e.stopPropagation();
            })
        }
    }
}]);


/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    angular.module("hm.appcore").service('hmappService', hmappService);

    hmappService.$inject = ['$http','$q','$sessionStorage','$localStorage','SYSCODE','GATEWAYURL'];

    function hmappService ($http,$q,$sessionStorage,$localStorage,SYSCODE,GATEWAYURL) {
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
                    delete $localStorage.authenticationToken;
                    delete $sessionStorage.authenticationToken;
                    delete $sessionStorage.userInfo;
                    setTimeout(function(){window.location.reload();},2000);
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

/**
 * Created by cbjiang on 2017/5/22.
 */

var Layout = function () {

    var handleSidebarMenuActiveLink = function(mode, el) {
        var url = location.hash.toLowerCase();

        var menu = $('#jquery-accordion-menu');

        if (mode === 'click' || mode === 'set') {
            el = $(el);
        } else if (mode === 'match') {
            var aList=menu.find("li > a");
            menu.find("li > a").each(function() {
                var path = $(this).attr("href")==null?'':$(this).attr("href").toLowerCase();
                // url match condition
                if (path.length > 1 && url.substr(1, path.length - 1) == path.substr(1)) {
                    el = $(this);
                    return;
                }
            });
        }
        if (!el || el.size() == 0) {
            return;
        }
        if (el.attr('href').toLowerCase() === 'javascript:;' || el.attr('href').toLowerCase() === '#') {
            return;
        }
        menu.find('li.active').removeClass('active');
        el.parents('li').each(function () {
            $(this).addClass('active');
            $(this).find('> a').addClass('submenu-indicator-minus');

            if ($(this).find('ul.submenu').size() > 0) {
                $(this).find('ul.submenu').css('display','block')
            }
        });
    };

    return {

        setSidebarMenuActiveLink: function(mode, el) {
            handleSidebarMenuActiveLink(mode, el);
        },

    };

}();
/**
 * Created by cbjiang on 2017/2/28.
 */

(function() {
    'use strict';

    //http拦截器
    angular.module("hm.appcore").config(['$httpProvider',function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
    }]);

})();

/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    angular.module("hm.appcore").factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', '$location', '$localStorage', '$sessionStorage','SYSNAME','LOGINURL'];

    function authInterceptor ($rootScope, $q, $location, $localStorage, $sessionStorage,SYSNAME,LOGINURL) {
        var service = {
            request: request
        };

        return service;

        function request (config) {
            /*jshint camelcase: false */
            config.headers = config.headers || {};
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }else{
                window.location=$location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/'+LOGINURL;
            }
            return config;
        }
    }
})();

(function() {
    'use strict';

    angular.module("hm.appcore").factory('authExpiredInterceptor', authExpiredInterceptor);

    authExpiredInterceptor.$inject = ['$rootScope', '$q', '$injector', '$localStorage', '$sessionStorage'];

    function authExpiredInterceptor($rootScope, $q, $injector, $localStorage, $sessionStorage) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            if (response.status === 401) {
                delete $localStorage.authenticationToken;
                delete $sessionStorage.authenticationToken;
                delete $sessionStorage.userInfo;
                window.location.reload();
            }
            return $q.reject(response);
        }
    }
})();
