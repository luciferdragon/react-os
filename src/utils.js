export default {
    getOffsetLeft: function (elem) {
        var offsetLeft = 0;
        do {
            if (!isNaN(elem.offsetLeft)) {
                offsetLeft += elem.offsetLeft;
            }
        } while (elem = elem.offsetParent);

        return offsetLeft;
    },

    getOffsetTop: function (elem) {
        var offsetTop = 0;
        do {
            if (!isNaN(elem.offsetTop)) {
                offsetTop += elem.offsetTop;
            }
        } while (elem = elem.offsetParent);

        return offsetTop;
    },

    getOffset: function (elem) {
        var docElem, win, rect, doc;

        if (!elem) {
            return;
        }

        // Support: IE<=11+
        // Running getBoundingClientRect on a
        // disconnected node in IE throws an error
        if (!elem.getClientRects().length) {
            return {top: 0, left: 0};
        }

        rect = elem.getBoundingClientRect();

        // Make sure element is not hidden (display: none)
        if (rect.width || rect.height) {
            doc = elem.ownerDocument;
            win = window;
            docElem = doc.documentElement;

            return {
                top: rect.top + win.pageYOffset - docElem.clientTop,
                left: rect.left + win.pageXOffset - docElem.clientLeft
            };
        }

        // Return zeros for disconnected and hidden elements (gh-2310)
        return rect;
    },

    emptyFn: function () {
        return function () {
        }
    },

    nextTick: function (fn) {
        setTimeout(fn, 0);
    },

    findElementInEventPath: function (path, srcElement) {
        path = path || [];
        return path.find(el => el == srcElement);
    }
}
