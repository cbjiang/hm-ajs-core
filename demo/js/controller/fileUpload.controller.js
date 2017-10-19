'use strict';


angular.module("HMApp").controller("fileUploadController", function($rootScope,$scope,$state,$timeout,$ocLazyLoad,hmappService,testService) {

    $scope.$on('$viewContentLoaded', function() {

        $timeout(function(){
            $scope.fileDetailInfos=[{
                "dir": "test",
                "fileName": "000",
                //"fileType": "png",
                "saveName": "7793b452-39d0-4909-bc03-66c62addb333.png",
                "systemName": "testSystem"
            },{
                "dir": "test",
                "fileName": "%25B4%25F3%25D6%25DA%25D3%25B0%25D4%25BA%25C6%25B5%25B5%25C0%25BC%25DB%25B8%25F1%25B1%25ED0823.doc",
                //"fileType": "doc",
                "saveName": "6ce32adc-3836-47a0-a1c1-a2b4cd602005.doc",
                "systemName": "testSystem",
            }];

            $scope.fileInfos1=[{
                "dir": "test",
                "fileName": "000",
                //"fileType": "png",
                "saveName": "7793b452-39d0-4909-bc03-66c62addb333.png",
                "systemName": "testSystem"
            },{
                "dir": "test",
                "fileName": "%25B4%25F3%25D6%25DA%25D3%25B0%25D4%25BA%25C6%25B5%25B5%25C0%25BC%25DB%25B8%25F1%25B1%25ED0823.doc",
                //"fileType": "doc",
                "saveName": "6ce32adc-3836-47a0-a1c1-a2b4cd602005.doc",
                "systemName": "testSystem",
            }];

        },1000);

    });

    $scope.items=[{file:[{
        "dir": "test",
        "fileName": "001.png",
        //"fileType": "png",
        "saveName": "6ce32adc-3836-47a0-a1c1-a2b4cd602005.png",
        "systemName": "testSystem",
        "isCover": 0
    }]}]
    $scope.addItem=function(){
        console.log($scope.items);
        $scope.items.push({});
    }



    //$scope.fileDetailInfos=[{
    //    "dir": "test",
    //    "fileName": "000.png",
    //    "fileType": "png",
    //    "saveName": "7793b452-39d0-4909-bc03-66c62addb333.png",
    //    "systemName": "testSystem"
    //},{
    //    "dir": "test",
    //    "fileName": "%25B4%25F3%25D6%25DA%25D3%25B0%25D4%25BA%25C6%25B5%25B5%25C0%25BC%25DB%25B8%25F1%25B1%25ED0823.doc",
    //    "fileType": "doc",
    //    "saveName": "6ce32adc-3836-47a0-a1c1-a2b4cd602005.doc",
    //    "systemName": "testSystem",
    //}];

    $scope.imageDetailInfos=[{
        "dir": "test",
        "fileName": "001.png",
        //"fileType": "png",
        "saveName": "6ce32adc-3836-47a0-a1c1-a2b4cd602005.png",
        "systemName": "testSystem",
        "isCover": 0
    }, {
        "dir": "test",
        "fileName": "000.png",
        //"fileType": "png",
        "saveName": "7793b452-39d0-4909-bc03-66c62addb333.png",
        "systemName": "testSystem",
        "isCover": 1
    }];
});


