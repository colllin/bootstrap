$(function () {

    module('popover plugin')

      test('should be defined on jquery object', function () {
        var div = $('<div></div>')
        ok(div.popover, 'popover method is defined')
      })

    module('popover', {
      setup: function() {

        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _popoverPlugin = $.fn.popover.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        // Usage: $('.my-selector').popover('show') becomes _popover( $('.my-selector'), 'show' )
        window._popover = function($el, args) {
          return _popoverPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._popover.plugin = _popoverPlugin

      },
      teardown: function() {

        // Re-attach as jQuery plugin
        $.fn.popover = window._popover.plugin
        delete window._popover
        
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.popover, 'popover was set back to undefined (org value)')
      })

      test('should return element', function () {
        var div = $('<div></div>')
        ok(_popover(div) == div, 'document.body returned')
      })

      test('should render popover element', function () {
        $.support.transition = false
        var popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>')
          .appendTo('#qunit-fixture')
        
        _popover(popover, 'show')

        ok($('.popover').length, 'popover was inserted')
        _popover(popover, 'hide')
        ok(!$('.popover').length, 'popover removed')
      })

      test('should store popover instance in popover data object', function () {
        $.support.transition = false
        var popover = $('<a href="#" title="mdo" data-content="http://twitter.com/mdo">@mdo</a>')

        _popover(popover)

        ok(!!popover.data('bs.popover'), 'popover instance exists')
      })

      test('should get title and content from options', function () {
        $.support.transition = false
        var popover = $('<a href="#">@fat</a>')
          .appendTo('#qunit-fixture')

        _popover(popover, {
            title: function () {
              return '@fat'
            },
            content: function () {
              return 'loves writing tests （╯°□°）╯︵ ┻━┻'
            }
          })

        _popover(popover, 'show')

        ok($('.popover').length, 'popover was inserted')
        equal($('.popover .popover-title').text(), '@fat', 'title correctly inserted')
        equal($('.popover .popover-content').text(), 'loves writing tests （╯°□°）╯︵ ┻━┻', 'content correctly inserted')

        _popover(popover, 'hide')
        ok(!$('.popover').length, 'popover was removed')
        $('#qunit-fixture').empty()
      })

      test('should get title and content from attributes', function () {
        $.support.transition = false
        var popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>')
          .appendTo('#qunit-fixture')
          
        _popover(popover)
        _popover(popover, 'show')

        ok($('.popover').length, 'popover was inserted')
        equal($('.popover .popover-title').text(), '@mdo', 'title correctly inserted')
        equal($('.popover .popover-content').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')

        _popover(popover, 'hide')
        ok(!$('.popover').length, 'popover was removed')
        $('#qunit-fixture').empty()
      })


      test('should get title and content from attributes #2', function () {
        $.support.transition = false
        var popover = $('<a href="#" title="@mdo" data-content="loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻" >@mdo</a>')
          .appendTo('#qunit-fixture')

        _popover(popover, {
          title: 'ignored title option',
          content: 'ignored content option'
        })
        _popover(popover, 'show')

        ok($('.popover').length, 'popover was inserted')
        equal($('.popover .popover-title').text(), '@mdo', 'title correctly inserted')
        equal($('.popover .popover-content').text(), 'loves data attributes (づ｡◕‿‿◕｡)づ ︵ ┻━┻', 'content correctly inserted')

        _popover(popover, 'hide')
        ok(!$('.popover').length, 'popover was removed')
        $('#qunit-fixture').empty()
      })

      test('should respect custom classes', function () {
        $.support.transition = false
        var popover = $('<a href="#">@fat</a>')
          .appendTo('#qunit-fixture')

        _popover(popover, {
          title: 'Test',
          content: 'Test',
          template: '<div class="popover foobar"><div class="arrow"></div><div class="inner"><h3 class="title"></h3><div class="content"><p></p></div></div></div>'
        })

        _popover(popover, 'show')

        ok($('.popover').length, 'popover was inserted')
        ok($('.popover').hasClass('foobar'), 'custom class is present')

        _popover(popover, 'hide')
        ok(!$('.popover').length, 'popover was removed')
        $('#qunit-fixture').empty()
      })

      test('should destroy popover', function () {
        var popover = $('<div/>')
        popover
          .on('click.foo', function () {})
        _popover(popover, {trigger: 'hover'})

        ok(popover.data('bs.popover'), 'popover has data')
        ok($._data(popover[0], 'events').mouseover && $._data(popover[0], 'events').mouseout, 'popover has hover event')
        ok($._data(popover[0], 'events').click[0].namespace == 'foo', 'popover has extra click.foo event')
        _popover(popover, 'show')
        _popover(popover, 'destroy')
        ok(!popover.hasClass('in'), 'popover is hidden')
        ok(!popover.data('popover'), 'popover does not have data')
        ok($._data(popover[0],'events').click[0].namespace == 'foo', 'popover still has click.foo')
        ok(!$._data(popover[0], 'events').mouseover && !$._data(popover[0], 'events').mouseout, 'popover does not have any events')
      })

})
