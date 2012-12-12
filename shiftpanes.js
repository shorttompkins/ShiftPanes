/* File Created: December 3, 2012 */

function ShiftPanes(container, pane, delay, easing) {
    var paneTime = 500;
    if (delay !== null)
        paneTime = delay;

    var panes = [];
    var activePane = 0;
    var isShiftingPanes = false;
    var paneEase = 'swing';
    if (easing !== null)
        paneEase = easing;
    
    function initDimensions() {
        var lastLeft = 0;
        $(container).css({ 'height': $(container + ' ' + pane).height(), 'overflow': 'hidden', 'position': 'relative' });
        $(container + ' ' + pane).each(function (i, pane) {
            $(pane).removeClass('sipane_' + i).css({ 'position': 'absolute', 'width': 'auto', 'height': 'auto' });
            $(pane).addClass('sipane_' + i);
            $(pane).css({ 'position': 'absolute', 'width': $(container).width(), 'height': $(container).height() });
            $(pane).css({ 'left': lastLeft });
            panes[i] = pane;
            lastLeft += $(container).width();
        });
    }

    function handlePaneSwapping() {
        $('a.shift').on('click', function (e) {
            e.preventDefault();

            var gotoPane = 0;
            if ($(this).attr('rel') === 'previous') {
                gotoPane = activePane - 1;
                if (gotoPane < 0)
                    gotoPane = 0;
            } else if ($(this).attr('rel') === 'next') {
                gotoPane = activePane + 1;
                if (gotoPane > panes.length)
                    gotoPane = panes.length;
            }

            if ((gotoPane > activePane || gotoPane < activePane) && (gotoPane >= 0 && gotoPane <= panes.length - 1) && !isShiftingPanes)
                activePane = animatePaneSwap(gotoPane, activePane);
        });
    }

    function animatePaneSwap(g, a) {
        //animate (if the pane actually changed)
        isShiftingPanes = true;
        if (g > a) {
            //need to shift them ALL here:
            for (var p = 0; p < panes.length; p++) {
                if (p === g || p === a)
                    $('.sipane_' + p).stop().animate({ 'left': $('.sipane_' + p).position().left - $(container).width() }, { queue: true, duration: paneTime, easing: paneEase, complete: function () { isShiftingPanes = false; } });
                else
                    $('.sipane_' + p).css({ 'left': $('.sipane_' + p).position().left - $(container).width() });
            }
        } else if (g < a) {
            for (var p = 0; p < panes.length; p++) {
                if (p === g || p === a)
                    $('.sipane_' + p).stop().animate({ 'left': $('.sipane_' + p).position().left + $(container).width() }, { queue: true, duration: paneTime, easing: paneEase, complete: function () { isShiftingPanes = false; } });
                else
                    $('.sipane_' + p).css({ 'left': $('.sipane_' + p).position().left + $(container).width() });
            }
        }
        return g;
    }

    function init() {
        initDimensions();
        handlePaneSwapping();

        $(window).on('resize', function () { initDimensions(); });
    };
    init();
};
