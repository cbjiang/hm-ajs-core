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