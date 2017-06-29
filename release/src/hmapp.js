/***
 Metronic AngularJS App Main Script
 ***/

var HMApp = angular.module("HMApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngStorage",
    "hm.fileupload"
]);

if(hmappSystemConfig!=null){
    HMApp.constant('SYSNAME', hmappSystemConfig.SYSNAME);
    HMApp.constant('SYSCODE', hmappSystemConfig.SYSCODE);
    HMApp.constant('VERSION', hmappSystemConfig.VERSION);
    HMApp.constant('GATEWAYURL', hmappSystemConfig.GATEWAYURL);
    HMApp.constant('LOGINURL', hmappSystemConfig.LOGINURL);
    HMApp.constant('INDEXSTATE', hmappSystemConfig.INDEXSTATE);

    //HMApp.constant('FILESERVICE',hmappSystemConfig.FILESERVICE);
    //HMApp.constant('FILESYSTEMNAME',hmappSystemConfig.FILESYSTEMNAME);
    //HMApp.constant('FILEDIRNAME',hmappSystemConfig.FILEDIRNAME);
}

HMApp.constant('COMMONSTATE', [
    {
        "name":"403",
        "url":"/403.html",
        "templateUrl":"hm/views/403.html",
        "data":{"pageTitle":"403 - 禁止访问: 访问被拒绝。"},
        "controller":"",
        "ocLazyLoad":{
            "name":"HMApp",
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
            "name":"HMApp",
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
            "name":"HMApp",
            "files":[
            ]
        }
    },
]);

HMApp.factory('settings', ['$rootScope', function($rootScope) {
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

HMApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {

    });
}]);

HMApp.run(['$rootScope', 'settings', '$state','$ocLazyLoad','$location','$localStorage','$sessionStorage','SYSNAME','LOGINURL','globalLazyLoad',
    function($rootScope, settings, $state,$ocLazyLoad,$location,$localStorage,$sessionStorage,SYSNAME,LOGINURL,globalLazyLoad) {
    var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
    if (!token) {
        window.location=$location.protocol()+'://'+$location.host()+':'+$location.port()+'/'+SYSNAME+'/'+LOGINURL;
    }
    $ocLazyLoad.load('HMApp');
    $rootScope.$state = $state; // state to be accessed from view
}]);
/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    //延迟加载
    HMApp.config(['$ocLazyLoadProvider','globalLazyLoad',function($ocLazyLoadProvider,globalLazyLoad) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
            modules: [
                {
                    name: 'HMApp',
                    insertBefore: '#ng_load_plugins_before',
                    files: globalLazyLoad.concat([

                    ])
                }
            ]
        });
    }]);

    HMApp.config(['$controllerProvider',function($controllerProvider) {
        $controllerProvider.allowGlobals();
    }]);

    HMApp.config(['$stateProvider', '$urlRouterProvider','INDEXSTATE','STATECONFIG','COMMONSTATE', function($stateProvider, $urlRouterProvider,INDEXSTATE,STATECONFIG,COMMONSTATE) {
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

})();




HMApp.directive( "ngDoLogout", [ '$location','$localStorage','$sessionStorage', function( $location,$localStorage,$sessionStorage ) {
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

HMApp.directive('ngSpinnerBar', ['$rootScope', '$location', '$localStorage', '$sessionStorage', '$state', 'SYSNAME', 'LOGINURL',
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
HMApp.directive('a', function() {
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
HMApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});


HMApp.directive( "ngPageUtil", ['$compile',function( $compile ) {

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

        var infoTemp='<p>显示 <span>'+numFrom+' 到 '+numTo+'</span>条，共 <span>'+total+'</span> 条记录</p>';
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

HMApp.directive( "ngGoBack", ['$window',function( $window ) {
    return {
        link:function( scope, element, attrs ){
            element.on('click',function(e){
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

    HMApp.service('hmappService', hmappService);

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

        function changeMyPassword(password){
            var deferred = $q.defer();
            $http({
                method:'GET',
                url:GATEWAYURL+'api/account/change_password',
                params:{},
                data:password
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
                var path = $(this).attr("href").toLowerCase();
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
    HMApp.config(['$httpProvider',function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
    }]);

})();

/**
 * Created by cbjiang on 2017/2/22.
 */

(function() {
    'use strict';

    HMApp.factory('authInterceptor', authInterceptor);

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

    HMApp.factory('authExpiredInterceptor', authExpiredInterceptor);

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
