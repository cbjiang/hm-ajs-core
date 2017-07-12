
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
                    console.log('$stateChangeStart');
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
                    console.log('$stateChangeSuccess');
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

angular.module("hm.appcore").factory("hmState",['$state',function($state){

    function go(url,params,callback){
        $('.main-view').removeClass('active');
        $state.go(url,params);
        $('.child-view').addClass('active');
        if(typeof callback == 'function'){
            callback();
        }
    }

    function back(callback){
        $('.child-view').removeClass('active');
        $('.main-view').addClass('active');
        window.history.back();
        if(typeof callback == 'function'){
            callback();
        }
    }

    return{
        go:go,
        back:back,
    }

}]);

angular.module("hm.appcore").directive("hmStateGoBack",['$window',function( $window ) {
    return {
        link:function( scope, element, attrs ){
            element.on('click',function(e){
                $('.child-view').removeClass('active');
                $('.main-view').addClass('active');
                $window.history.back();
                e.stopPropagation();
            })
        }
    }
}]);

angular.module("hm.appcore").directive("hmFormPoints",function() {
    return {
        require: '?ngModel',
        restrict : 'A',
        scope:{
            ngModel: '='
        },
        link:function( scope, element, attrs, ngModel ){
            ngModel.$render = function() {
                element.val(ngModel.$viewValue || '');
                var point=parseInt(ngModel.$viewValue);
                contentTr.find('li').slice(0,point).addClass('active');
            };
            var total=attrs["total"]==null?5:parseInt(attrs["total"]);
            var temp='<li class="point-item"></li>';
            var str='';
            for(var i=0;i<total;i++){
                str+=temp;
            }
            var contentTr = angular.element('<ul class="point-bar">'+str+'</ul>');
            contentTr.insertAfter(element);
            element.addClass('hide');

            contentTr.find('li').hover(function(){
                $(this).addClass('hover');
                $(this).prevAll().addClass('hover');
            },function(){
                contentTr.find('li').removeClass('hover');
            })

            contentTr.find('li').on('click',function(){
                contentTr.find('li').removeClass('active');
                $(this).addClass('active');
                $(this).prevAll().addClass('active');

                element.val($(this).prevAll().length+1).trigger('change');
            })

            contentTr.on('dblclick',function(){
                contentTr.find('li').removeClass('active');

                element.val(0).trigger('change');
            })
        }
    }
});

angular.module("hm.appcore").directive("hmWordNum",function() {
    return {
        require: '?ngModel',
        restrict : 'A',
        scope:{
            ngModel: '='
        },
        link:function( scope, element, attrs, ngModel ){
            var tip;
            console.log(ngModel);
            ngModel.$render = function() {
                element.val(ngModel.$viewValue || '');
                tip=$('<span style="position:absolute;top:'+(element.position().top+element.height()-20)+'px;left:'+
                    (element.position().left+element.width()+20)+'px">'+
                    (ngModel.$viewValue==null?0:ngModel.$viewValue.length)+'/'+attrs.hmWordNum+'</span>').appendTo('body');
            };

            element.on('keyup',function(){
                tip.remove();
                tip=$('<span style="position:absolute;top:'+(element.position().top+element.height()-20)+'px;left:'+
                    (element.position().left+element.width()+20)+'px">'+
                    (ngModel.$viewValue==null?0:ngModel.$viewValue.length)+'/'+attrs.hmWordNum+'</span>').appendTo('body');
            })

            element.on('resize',function(e){
                tip.remove();
                tip=$('<span style="position:absolute;top:'+(element.position().top+element.height()-20)+'px;left:'+
                    (element.position().left+element.width()+20)+'px">'+
                    (ngModel.$viewValue==null?0:ngModel.$viewValue.length)+'/'+attrs.hmWordNum+'</span>').appendTo('body');
                e.stopPropagation();
            })

            element.parents().on('resize',function(e){
                tip.remove();
                tip=$('<span style="position:absolute;top:'+(element.position().top+element.height()-20)+'px;left:'+
                    (element.position().left+element.width()+20)+'px">'+
                    (ngModel.$viewValue==null?0:ngModel.$viewValue.length)+'/'+attrs.hmWordNum+'</span>').appendTo('body');
                e.stopPropagation();
            })

            scope.$on('$destroy', function() {
                console.log("destroy");
                tip.remove();
            });

        }
    }
});

