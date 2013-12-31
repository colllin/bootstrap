$(function () {

    module('affix plugin')

      test('should be defined on jquery object', function () {
        ok($(document.body).affix, 'affix method is defined')
      })

    module('affix', {
      setup: function() {

        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _affixPlugin = $.fn.affix.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        // Usage: $('.my-selector').affix({offset: {top: 10}}) becomes _affix( $('.my-selector'), {offset: {top: 10}} )
        window._affix = function($el, args) {
          return _affixPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._affix.plugin = _affixPlugin

      },
      teardown: function() {

        // Re-attach as jQuery plugin
        $.fn.affix = window._affix.plugin
        delete window._affix
        
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.affix, 'affix was set back to undefined (org value)')
      })

      test('should return element', function () {
        ok(_affix( $(document.body) )[0] == document.body, 'document.body returned')
      })

      test('should exit early if element is not visible', function () {
        var div = $('<div style="display: none"></div>')
        _affix(div)
        div.data('bs.affix').checkPosition()
        ok(!div.hasClass('affix'), 'affix class was not added')
      })

      test('should trigger affixed event after affix', function () {
        stop()

        var template = $('<div id="affixTarget"><ul><li>Please affix</li><li>And unaffix</li></ul></div><div id="affixAfter" style="height: 20000px; display:block;"></div>')
        template.appendTo('body')

        var affixer = $('#affixTarget');
        _affix(affixer, {
          offset: $('#affixTarget ul').position()
        })

        $('#affixTarget')
          .on('affix.bs.affix', function (e) {
            ok(true, 'affix event triggered')
          }).on('affixed.bs.affix', function (e) {
            ok(true,'affixed event triggered')
            $('#affixTarget').remove()
            $('#affixAfter').remove()
            start()
          })

        setTimeout(function () {
          window.scrollTo(0, document.body.scrollHeight)
          setTimeout(function () { window.scroll(0,0) }, 0)
        },0)
      })
})
