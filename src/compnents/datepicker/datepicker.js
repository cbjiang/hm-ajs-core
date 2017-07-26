/**
 * Created by cbjiang on 2017/6/19.
 */
angular.module('hm.datepicker').directive('datePickerInit',function(){
    return{
        link:function(socpe,element,attrs){
            (function($){
                $.fn.datetimepicker.dates['zh-CN'] = {
                    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
                    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    today: "今天",
                    suffix: [],
                    meridiem: ["上午", "下午"]
                };
            }(jQuery));
            element.datetimepicker({
                showDropdowns:true,
                language : "zh-CN",
                format:"yyyy-mm-dd",
                startView: 2,
                maxView:3,
                minView:2,
                autoclose : true,
                todayHighlight : true
            })
        }
    }
}).directive('timePickerInit',function(){
    return{
        link:function(socpe,element,attrs){
            element.timepicker({
                format: 'hh:ii',
                startView:0,
                minute:1,
                showMeridian:false
            })
        }
    }
}).directive('yearPickerInit',function(){
    return{
        link:function(socpe,element,attrs){
            element.datetimepicker({
                format:"yyyy",
                startView: 4,
                maxView:4,
                minView:4,
                autoclose : true

            })
        }
    }
});
