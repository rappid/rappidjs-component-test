(function ($) {
    /**
     * This fill plugin triggers an keyboard event after it has the value set
     */
    "use strict";

    if (!$) return;


    $.fn.fill = function (value) {
        this.val(value);

        var e = document.createEvent("KeyboardEvent");
        e.initEvent("input");

        this.get(0).dispatchEvent(e);

        return this;
    };

})(jQuery);