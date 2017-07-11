'use strict';


angular.module("HMApp").controller("pageJumpController", function($rootScope,$scope,$state,$ocLazyLoad,hmState) {

    $scope.showChild1=function(){
        hmState.go('pageJump.childPage');
    }

    $("#boatLogDate").daterangepicker({
        startDate: moment().subtract("days", 29),
        endDate: moment(),
        ranges: {
            "今日": [moment(), moment()],
            "昨日": [moment().subtract("days", 1), moment().subtract("days", 1)],
            "最近7天": [moment().subtract("days", 6), moment()],
            "最近30天": [moment().subtract("days", 29), moment()],
            "本月": [moment().startOf("month"), moment().endOf("month")],
            "上月": [moment().subtract("month", 1).startOf("month"), moment().subtract("month", 1).endOf("month")]
        },
        showDropdowns:true,//在年月份选择框上面显示可以跳刀特定月份的选择
        linkedCalendars : false,
        separator : ' 至 ',
        locale : {
            applyLabel : '确定',
            cancelLabel : '取消',
            fromLabel : '起始时间',
            toLabel : '结束时间',
            customRangeLabel : '自定义',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ],
            firstDay : 1,
            format: "YYYY-MM-DD",
        }

    }, function(t, e) {
        $("#daterangepicker input").val(t.format("YYYY-MM-DD") + " 至 " + e.format("YYYY-MM-DD"));
    });
//    $('.daterange').daterangepicker(
//        {
//            format: 'YYYY-MM-DD',//控件中from和to 显示的日期格式
//            maxDate:myDate,
//            showDropdowns:true,//在年月份选择框上面显示可以跳刀特定月份的选择
//            showWeekNumbers : true, //是否显示第几周
//            ranges : {
////                      //'最近1小时': [moment().subtract('hours',1), moment()],
////                      '今日': [moment().startOf('day'), moment()],
////                      '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
//                '最近3日':[moment().subtract('days',2).startOf('day'),moment()],
//                '最近7日': [moment().subtract('days', 6), moment()],
//                '最近30日': [moment().subtract('days', 29), moment()]
//            },
//            opens : 'left', //日期选择框的弹出位置
//            buttonClasses : [ 'btn btn-default' ],
//            applyClass : 'btn-small btn-primary blue',
//            cancelClass : 'btn-small',
//            separator : ' 至 ',
//            locale : {
//                applyLabel : '确定',
//                cancelLabel : '取消',
//                fromLabel : '起始时间',
//                toLabel : '结束时间',
//                customRangeLabel : '自定义',
//                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
//                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
//                    '七月', '八月', '九月', '十月', '十一月', '十二月' ],
//                firstDay : 1
//            }
//        }
//    );

    $scope.refresh=function(){
        alert(1);
    }

});

