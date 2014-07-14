(function ($) {
    /**
     * This fill plugin triggers an keyboard event after it has the value set
     */
    "use strict";

    if (!$) return;

    function triggerEventOnElement(element, event) {
        for (var i = 0; i < element.length; i++) {
            var ev = document.createEvent("MouseEvent");
            ev.initMouseEvent(
                event,
                true /* bubble */, true /* cancelable */,
                window, null,
                0, 0, 0, 0, /* coordinates */
                false, false, false, false, /* modifier keys */
                0 /*left*/, null
            );

            element.get(i).dispatchEvent(ev);
        }
    }


    $.fn.click = function () {
        triggerEventOnElement(this, "click");

        return this;
    };

    $.fn.blur = function () {
        triggerEventOnElement(this, "blur");

        return this;
    };

    $.fn.focus = function () {
        triggerEventOnElement(this, "focus");

        return this;
    }

})(jQuery);