$(function () {

    module('tab plugin')

      test('should be defined on jquery object', function () {
        ok($(document.body).tab, 'tabs method is defined')
      })

    module('tabs', {
      setup: function() {
        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _tabPlugin = $.fn.tab.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        window._tab = function($el, args) {
          return _tabPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._tab.plugin = _tabPlugin
      },
      teardown: function() {
        // Re-attach as jQuery plugin
        $.fn.tab = window._tab.plugin
        delete window._tab
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.tab, 'tab was set back to undefined (org value)')
      })

      test('should return element', function () {
        ok(_tab( $(document.body) )[0] == document.body, 'document.body returned')
      })

      test('should activate element by tab id', function () {
        var tabsHTML = '<ul class="tabs">' +
            '<li><a href="#home">Home</a></li>' +
            '<li><a href="#profile">Profile</a></li>' +
            '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo('#qunit-fixture')

        var last = $(tabsHTML).find('li:last a')
        _tab(last, 'show')
        equal($('#qunit-fixture').find('.active').attr('id'), 'profile')

        var first = $(tabsHTML).find('li:first a')
        _tab(first, 'show')
        equal($('#qunit-fixture').find('.active').attr('id'), 'home')
      })

      test('should activate element by tab id', function () {
        var pillsHTML = '<ul class="pills">' +
            '<li><a href="#home">Home</a></li>' +
            '<li><a href="#profile">Profile</a></li>' +
            '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo('#qunit-fixture')

        var last = $(pillsHTML).find('li:last a')
        _tab(last, 'show')
        equal($('#qunit-fixture').find('.active').attr('id'), 'profile')

        var first = $(pillsHTML).find('li:first a')
        _tab(first, 'show')
        equal($('#qunit-fixture').find('.active').attr('id'), 'home')
      })


      test('should not fire closed when close is prevented', function () {
        $.support.transition = false
        stop();
        var div = $('<div class="tab"/>')
        div
          .on('show.bs.tab', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .on('shown.bs.tab', function () {
            ok(false);
          })

        _tab(div, 'show')
      })

      test('show and shown events should reference correct relatedTarget', function () {
        var dropHTML = '<ul class="drop">' +
            '<li class="dropdown"><a data-toggle="dropdown" href="#">1</a>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="#1-1" data-toggle="tab">1-1</a></li>' +
            '<li><a href="#1-2" data-toggle="tab">1-2</a></li>' +
            '</ul>' +
            '</li>' +
            '</ul>'

        var ul = $(dropHTML)
        var first = ul.find('ul>li:first a')
        _tab(first, 'show')

        var last = ul.find('ul>li:last a')
        last
          .on('show', function (event) {
            equal(event.relatedTarget.hash, '#1-1')
          })
          .on('shown', function (event) {
            equal(event.relatedTarget.hash, '#1-1')
          })
        _tab(last, 'show')
      })

})
