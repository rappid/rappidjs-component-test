(function ($) {
    /**
     * This fill plugin triggers an keyboard event after it has the value set
     */
    "use strict";

    if (!$) return;

    function triggerEventOnElement(element, event) {
        var ev = document.createEvent("MouseEvent");
        ev.initMouseEvent(
            event,
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/, null
        );

        element.dispatchEvent(ev);
    }


    $.fn.click = function () {
        triggerEventOnElement(this.get(0), "click");

        return this;
    };

    $.fn.blur = function () {
        triggerEventOnElement(this.get(0), "blur");

        return this;
    };

    $.fn.focus = function () {
        triggerEventOnElement(this.get(0), "focus");

        return this;
    }

})(jQuery);