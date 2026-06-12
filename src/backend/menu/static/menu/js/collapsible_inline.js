(function() {
    "use strict";
    var $;

    function initToggle($el) {
        if ($el.hasClass("empty-form")) return;
        if ($el.find(".menuproduct-toggle-btn").length) return;

        var $h3 = $el.find("> h3");
        var $children = $el.children().not("h3");
        $children.wrapAll('<div class="menuproduct-form-body collapsed"></div>');
        var $formBody = $el.find(".menuproduct-form-body");
        var $btn = $('<span class="menuproduct-toggle-btn"></span>');
        $btn.on("click", function(e) {
            e.stopPropagation();
            $formBody.toggleClass("collapsed");
            $btn.toggleClass("expanded");
        });
        $h3.prepend($btn);
    }

    function init() {
        var $group = $("#products-group");
        if (!$group.length) return;

        $group.find(".inline-related").each(function() {
            initToggle($(this));
        });

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    var $node = $(node);
                    if ($node.hasClass("inline-related")) {
                        initToggle($node);
                    }
                    $node.find(".inline-related").each(function() {
                        initToggle($(this));
                    });
                });
            });
        });
        observer.observe($group[0], { childList: true, subtree: true });
    }

    var check = setInterval(function() {
        if (typeof django !== "undefined" && django.jQuery) {
            clearInterval(check);
            $ = django.jQuery;
            $(function() {
                init();
            });
        }
    }, 10);
})();
