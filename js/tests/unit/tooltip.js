$(function () {

    module('tooltip plugin')

      test('should be defined on jquery object', function () {
        var div = $('<div></div>')
        ok(div.tooltip, 'popover method is defined')
      })

      test('should expose default settings', function () {
        ok(!!$.fn.tooltip.Constructor.DEFAULTS, 'defaults is defined')
      })

    module('tooltip', {
      setup: function() {
        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _tooltipPlugin = $.fn.tooltip.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        window._tooltip = function($el, args) {
          return _tooltipPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._tooltip.plugin = _tooltipPlugin
      },
      teardown: function() {
        // Re-attach as jQuery plugin
        $.fn.tooltip = window._tooltip.plugin
        delete window._tooltip
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.tooltip, 'tooltip was set back to undefined (org value)')
      })

      test('should return element', function () {
        var div = $('<div></div>')
        ok(_tooltip(div) == div, 'document.body returned')
      })

      test('should empty title attribute', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
        _tooltip(tooltip)
        ok(tooltip.attr('title') === '', 'title attribute was emptied')
      })

      test('should add data attribute for referencing original title', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
        _tooltip(tooltip)
        equal(tooltip.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
      })

      test('should place tooltips relative to placement option', function () {
        $.support.transition = false
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, {placement: 'bottom'})
        _tooltip(tooltip, 'show')

        ok($('.tooltip').is('.fade.bottom.in'), 'has correct classes applied')
        _tooltip(tooltip, 'hide')
      })

      test('should allow html entities', function () {
        $.support.transition = false
        var tooltip = $('<a href="#" rel="tooltip" title="<b>@fat</b>"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, {html: true})
        _tooltip(tooltip, 'show')

        ok($('.tooltip b').length, 'b tag was inserted')
        _tooltip(tooltip, 'hide')
        ok(!$('.tooltip').length, 'tooltip removed')
      })

      test('should respect custom classes', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, { template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'})
        _tooltip(tooltip, 'show')

        ok($('.tooltip').hasClass('some-class'), 'custom class is present')
        _tooltip(tooltip, 'hide')
        ok(!$('.tooltip').length, 'tooltip removed')
      })

      test('should fire show event', function () {
        stop()
        var tooltip = $('<div title="tooltip title"></div>')
          .on('show.bs.tooltip', function () {
            ok(true, 'show was called')
            start()
          })

        _tooltip(tooltip, 'show')
      })

      test('should fire shown event', function () {
        stop()
        var tooltip = $('<div title="tooltip title"></div>')
          .on('shown.bs.tooltip', function () {
            ok(true, 'shown was called')
            start()
          })

        _tooltip(tooltip, 'show')
      })

      test('should not fire shown event when default prevented', function () {
        stop()
        var tooltip = $('<div title="tooltip title"></div>')
          .on('show.bs.tooltip', function (e) {
            e.preventDefault()
            ok(true, 'show was called')
            start()
          })
          .on('shown.bs.tooltip', function () {
            ok(false, 'shown was called')
          })

        _tooltip(tooltip, 'show')
      })

      test('should fire hide event', function () {
        stop()
        var tooltip = $('<div title="tooltip title"></div>')
          .on('shown.bs.tooltip', function () {
            _tooltip($(this), 'hide')
          })
          .on('hide.bs.tooltip', function () {
            ok(true, 'hide was called')
            start()
          })

        _tooltip(tooltip, 'show')
      })

      test('should fire hidden event', function () {
        stop()
        var tooltip = $('<div title="tooltip title"></div>')
          .on('shown.bs.tooltip', function () {
            _tooltip($(this), 'hide')
          })
          .on('hidden.bs.tooltip', function () {
            ok(true, 'hidden was called')
            start()
          })

        _tooltip(tooltip, 'show')
      })

      test('should not fire hidden event when default prevented', function () {
        stop()
        var tooltip = $('<div title="tooltip title"></div>')
          .on('shown.bs.tooltip', function () {
            _tooltip($(this), 'hide')
          })
          .on('hide.bs.tooltip', function (e) {
            e.preventDefault()
            ok(true, 'hide was called')
            start()
          })
          .on('hidden.bs.tooltip', function () {
            ok(false, 'hidden was called')
          })

        _tooltip(tooltip, 'show')
      })

      test('should not show tooltip if leave event occurs before delay expires', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, { delay: 200 })

        stop()

        tooltip.trigger('mouseenter')

        setTimeout(function () {
          ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
            start()
          }, 200)
        }, 100)
      })

      test('should not show tooltip if leave event occurs before delay expires, even if hide delay is 0', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, { delay: { show: 200, hide: 0} })

        stop()

        tooltip.trigger('mouseenter')

        setTimeout(function () {
          ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
            start()
          }, 200)
        }, 100)
      })

      test('should wait 200 ms before hiding the tooltip', 3, function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, { delay: { show: 0, hide: 200} })

        stop()

        tooltip.trigger('mouseenter')

        setTimeout(function () {
          ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok($('.tooltip').is('.fade.in'), '100ms:tooltip is still faded in')
            setTimeout(function () {
              ok(!$('.tooltip').is('.in'), 'tooltip removed')
              start()
            }, 150)
          }, 100)
        }, 1)
      })

      test('should not hide tooltip if leave event occurs, then tooltip is show immediately again', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, { delay: { show: 0, hide: 200} })

        stop()

        tooltip.trigger('mouseenter')

        setTimeout(function () {
          ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok($('.tooltip').is('.fade.in'), '100ms:tooltip is still faded in')
            tooltip.trigger('mouseenter')
            setTimeout(function () {
              ok($('.tooltip').is('.in'), 'tooltip removed')
              start()
            }, 150)
          }, 100)
        }, 1)
      })

      test('should not show tooltip if leave event occurs before delay expires', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, { delay: 100 })

        stop()
        tooltip.trigger('mouseenter')
        setTimeout(function () {
          ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
            start()
          }, 100)
        }, 50)
      })

      test('should show tooltip if leave event hasn\'t occured before delay expires', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, { delay: 150 })
        stop()
        tooltip.trigger('mouseenter')
        setTimeout(function () {
          ok(!$('.tooltip').is('.fade.in'), 'tooltip is not faded in')
        }, 100)
        setTimeout(function () {
          ok($('.tooltip').is('.fade.in'), 'tooltip has faded in')
          start()
        }, 200)
      })

      test('should destroy tooltip', function () {
        var tooltip = $('<div/>')
        _tooltip(tooltip)
        tooltip.on('click.foo', function () {})

        ok(tooltip.data('bs.tooltip'), 'tooltip has data')
        ok($._data(tooltip[0], 'events').mouseover && $._data(tooltip[0], 'events').mouseout, 'tooltip has hover event')
        ok($._data(tooltip[0], 'events').click[0].namespace == 'foo', 'tooltip has extra click.foo event')
        _tooltip(tooltip, 'show')
        _tooltip(tooltip, 'destroy')
        ok(!tooltip.hasClass('in'), 'tooltip is hidden')
        ok(!$._data(tooltip[0], 'bs.tooltip'), 'tooltip does not have data')
        ok($._data(tooltip[0], 'events').click[0].namespace == 'foo', 'tooltip still has click.foo')
        ok(!$._data(tooltip[0], 'events').mouseover && !$._data(tooltip[0], 'events').mouseout, 'tooltip does not have any events')
      })

      test('should show tooltip with delegate selector on click', function () {
        var div = $('<div><a href="#" rel="tooltip" title="Another tooltip"></a></div>')
        var tooltip = div.appendTo('#qunit-fixture')

        _tooltip(tooltip, {
          selector: 'a[rel=tooltip]',
          trigger: 'click'
        })

        div.find('a').trigger('click')
        ok($('.tooltip').is('.fade.in'), 'tooltip is faded in')
      })

      test('should show tooltip when toggle is called', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="tooltip on toggle"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, {trigger: 'manual'})
        _tooltip(tooltip, 'toggle')
        ok($('.tooltip').is('.fade.in'), 'tooltip should be toggled in')
      })

      test('should place tooltips inside the body', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, {container: 'body'})
        _tooltip(tooltip, 'show')
        ok($('body > .tooltip').length, 'inside the body')
        ok(!$('#qunit-fixture > .tooltip').length, 'not found in parent')
        _tooltip(tooltip, 'hide')
      })

      test('should place tooltip inside window', function () {
        var container = $('<div />').appendTo('body')
            .css({position: 'absolute', width: 200, height: 200, bottom: 0, left: 0}),
            tooltip = $('<a href="#" title="Very very very very very very very very long tooltip">Hover me</a>')
          .css({position: 'absolute', top: 0, left: 0})
          .appendTo(container)

        _tooltip(tooltip, {placement: 'top', animate: false})
        _tooltip(tooltip, 'show')

        stop()

        setTimeout(function () {
          ok($('.tooltip').offset().left >= 0)

          start()
          container.remove()
        }, 100)
      })

      test('should place tooltip on top of element', function () {
        var container = $('<div />').appendTo('body')
              .css({position: 'absolute', bottom: 0, left: 0, textAlign: 'right', width: 300, height: 300}),
              p = $('<p style="margin-top:200px" />').appendTo(container),
              tooltiped = $('<a href="#" title="very very very very very very very long tooltip">Hover me</a>')
                .css({marginTop: 200})
                .appendTo(p)

        _tooltip(tooltiped, {placement: 'top', animate: false})
        _tooltip(tooltiped, 'show')

        stop()

        setTimeout(function () {
          var tooltip = container.find('.tooltip')

          start()
          ok(tooltip.offset().top + tooltip.outerHeight() <= tooltiped.offset().top)
          container.remove()
        }, 100)
      })

      test('should add position class before positioning so that position-specific styles are taken into account', function () {
        $('head').append('<style> .tooltip.right { white-space: nowrap; } .tooltip.right .tooltip-inner { max-width: none; } </style>')

        var container = $('<div />').appendTo('body'),
            target = $('<a href="#" rel="tooltip" title="very very very very very very very very long tooltip in one line"></a>')
              .appendTo(container)

        _tooltip(target, {placement: 'right'})
        _tooltip(target, 'show')

        var tooltip = container.find('.tooltip')

        ok( Math.round(target.offset().top + (target[0].offsetHeight / 2) - (tooltip[0].offsetHeight / 2)) === Math.round(tooltip.offset().top) )
        _tooltip(target, 'hide')
      })

      test('tooltip title test #1', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip" style="display: inline-block; position: absolute; top: 0; left: 0;"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip)
        _tooltip(tooltip, 'show')

        equal($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title from title attribute is set')
        _tooltip(tooltip, 'hide')
        ok(!$('.tooltip').length, 'tooltip removed')
      })

      test('tooltip title test #2', function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Simple tooltip" style="display: inline-block; position: absolute; top: 0; left: 0;"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, {
          title: 'This is a tooltip with some content'
        })
        _tooltip(tooltip, 'show')

        equal($('.tooltip').children('.tooltip-inner').text(), 'Simple tooltip', 'title is set from title attribute while prefered over title option')
        _tooltip(tooltip, 'hide')
        ok(!$('.tooltip').length, 'tooltip removed')
      })

      test('tooltip title test #3', function () {
        var tooltip = $('<a href="#" rel="tooltip" style="display: inline-block; position: absolute; top: 0; left: 0;"></a>')
          .appendTo('#qunit-fixture')

        _tooltip(tooltip, {
          title: 'This is a tooltip with some content'
        })
        _tooltip(tooltip, 'show')

        equal($('.tooltip').children('.tooltip-inner').text(), 'This is a tooltip with some content', 'title from title option is set')
        _tooltip(tooltip, 'hide')
        ok(!$('.tooltip').length, 'tooltip removed')
      })

      test('tooltips should be placed dynamically, with the dynamic placement option', function () {
        $.support.transition = false
        var ttContainer = $('<div id="dynamic-tt-test"/>').css({
            'height' : 400,
            'overflow' : 'hidden',
            'position' : 'absolute',
            'top' : 0,
            'left' : 0,
            'width' : 600})
            .appendTo('body')

        var topTooltip = $('<div style="display: inline-block; position: absolute; left: 0; top: 0;" rel="tooltip" title="Top tooltip">Top Dynamic Tooltip</div>')
          .appendTo('#dynamic-tt-test')

        _tooltip(topTooltip, {placement: 'auto'})
        _tooltip(topTooltip, 'show')


        ok($('.tooltip').is('.bottom'),  'top positioned tooltip is dynamically positioned bottom')

        _tooltip(topTooltip, 'hide')

        var rightTooltip = $('<div style="display: inline-block; position: absolute; right: 0;" rel="tooltip" title="Right tooltip">Right Dynamic Tooltip</div>')
          .appendTo('#dynamic-tt-test')

        _tooltip(rightTooltip, {placement: 'right auto'})
        _tooltip(rightTooltip, 'show')

        ok($('.tooltip').is('.left'),  'right positioned tooltip is dynamically positioned left')
        _tooltip(rightTooltip, 'hide')

        var bottomTooltip = $('<div style="display: inline-block; position: absolute; bottom: 0;" rel="tooltip" title="Bottom tooltip">Bottom Dynamic Tooltip</div>')
          .appendTo('#dynamic-tt-test')

        _tooltip(bottomTooltip, {placement: 'auto bottom'})
        _tooltip(bottomTooltip, 'show')

        ok($('.tooltip').is('.top'),  'bottom positioned tooltip is dynamically positioned top')
        _tooltip(bottomTooltip, 'hide')

        var leftTooltip = $('<div style="display: inline-block; position: absolute; left: 0;" rel="tooltip" title="Left tooltip">Left Dynamic Tooltip</div>')
          .appendTo('#dynamic-tt-test')

        _tooltip(leftTooltip, {placement: 'auto left'})
        _tooltip(leftTooltip, 'show')

        ok($('.tooltip').is('.right'),  'left positioned tooltip is dynamically positioned right')
        _tooltip(leftTooltip, 'hide')

        ttContainer.remove()
      })

})
