(function ($) {
    /**
     * This fill plugin selects the value and triggers an change event
     */
    "use strict";

    if (!$) return;

    function fireEvent(element, event) {
        var evt;
        if (document.createEventObject) {
            // dispatch for IE
            evt = document.createEventObject();
            return element.fireEvent('on' + event, evt)
        }
        else {
            // dispatch for firefox + others
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        }
    }

    $.fn.fillSelect = function (value) {
        this.find('option').removeAttr('selected');
        this.find('option[value="' + value + '"]').attr('selected', true);

        fireEvent(this.get(0), "change");

        return this;
    };

})(jQuery);