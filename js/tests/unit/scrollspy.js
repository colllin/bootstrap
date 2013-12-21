$(function () {

    module('scrollspy plugin')

      test('should be defined on jquery object', function () {
        ok($(document.body).scrollspy, 'scrollspy method is defined')
      })

    module('scrollspy', {
      setup: function() {
        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _scrollspyPlugin = $.fn.scrollspy.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        window._scrollspy = function($el, args) {
          return _scrollspyPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._scrollspy.plugin = _scrollspyPlugin
      },
      teardown: function() {
        // Re-attach as jQuery plugin
        $.fn.scrollspy = window._scrollspy.plugin
        delete window._scrollspy
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.scrollspy, 'scrollspy was set back to undefined (org value)')
      })

      test('should return element', function () {
        ok(_scrollspy( $(document.body) )[0] == document.body, 'document.body returned')
      })

      test('should switch active class on scroll', function () {
        var sectionHTML = '<div id="masthead"></div>'
            $section = $(sectionHTML).append('#qunit-fixture'),
            topbarHTML = '<div class="topbar">' +
            '<div class="topbar-inner">' +
            '<div class="container">' +
            '<h3><a href="#">Bootstrap</a></h3>' +
            '<li><a href="#masthead">Overview</a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>',
            $topbar = $(topbarHTML)

        _scrollspy($topbar)

        ok($topbar.find('.active', true))
      })

})
