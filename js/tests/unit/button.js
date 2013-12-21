$(function () {

    module('button plugin')

      test('should be defined on jquery object', function () {
        ok($(document.body).button, 'button method is defined')
      })

    module('button', {
      setup: function() {
        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _buttonPlugin = $.fn.button.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        window._button = function($el, args) {
          return _buttonPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._button.plugin = _buttonPlugin
      },
      teardown: function() {
        // Re-attach as jQuery plugin
        $.fn.button = window._button.plugin
        delete window._button
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.button, 'button was set back to undefined (org value)')
      })

      test('should return element', function () {
        ok(_button( $(document.body) )[0] == document.body, 'document.body returned')
      })

      test('should return set state to loading', function () {
        var btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
        equal(btn.html(), 'mdo', 'btn text equals mdo')
        _button(btn, 'loading')
        equal(btn.html(), 'fat', 'btn text equals fat')
        stop()
        setTimeout(function () {
          ok(btn.attr('disabled'), 'btn is disabled')
          ok(btn.hasClass('disabled'), 'btn has disabled class')
          start()
        }, 0)
      })

      test('should return reset state', function () {
        var btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
        equal(btn.html(), 'mdo', 'btn text equals mdo')
        _button(btn, 'loading')
        equal(btn.html(), 'fat', 'btn text equals fat')
        stop()
        setTimeout(function () {
          ok(btn.attr('disabled'), 'btn is disabled')
          ok(btn.hasClass('disabled'), 'btn has disabled class')
          start()
          stop()
          _button(btn, 'reset')
          equal(btn.html(), 'mdo', 'btn text equals mdo')
          setTimeout(function () {
            ok(!btn.attr('disabled'), 'btn is not disabled')
            ok(!btn.hasClass('disabled'), 'btn does not have disabled class')
            start()
          }, 0)
        }, 0)

      })

      test('should toggle active', function () {
        var btn = $('<button class="btn">mdo</button>')
        ok(!btn.hasClass('active'), 'btn does not have active class')
        _button(btn, 'toggle')
        ok(btn.hasClass('active'), 'btn has class active')
      })

      test('should toggle active when btn children are clicked', function () {
        var btn = $('<button class="btn" data-toggle="button">mdo</button>'),
            inner = $('<i></i>')
        btn
          .append(inner)
          .appendTo($('#qunit-fixture'))
        ok(!btn.hasClass('active'), 'btn does not have active class')
        inner.click()
        ok(btn.hasClass('active'), 'btn has class active')
      })

      test('should toggle active when btn children are clicked within btn-group', function () {
        var btngroup = $('<div class="btn-group" data-toggle="buttons"></div>'),
            btn = $('<button class="btn">fat</button>'),
            inner = $('<i></i>')
        btngroup
          .append(btn.append(inner))
          .appendTo($('#qunit-fixture'))
        ok(!btn.hasClass('active'), 'btn does not have active class')
        inner.click()
        ok(btn.hasClass('active'), 'btn has class active')
      })

      test('should check for closest matching toggle', function () {
        var group = '<div class="btn-group" data-toggle="buttons">' +
          '<label class="btn btn-primary active">' +
            '<input type="radio" name="options" id="option1" checked="true"> Option 1' +
          '</label>' +
          '<label class="btn btn-primary">' +
            '<input type="radio" name="options" id="option2"> Option 2' +
          '</label>' +
          '<label class="btn btn-primary">' +
            '<input type="radio" name="options" id="option3"> Option 3' +
          '</label>' +
        '</div>'

        group = $(group)

        var btn1 = $(group.children()[0])
        var btn2 = $(group.children()[1])
        var btn3 = $(group.children()[2])

        group.appendTo($('#qunit-fixture'))

        ok(btn1.hasClass('active'), 'btn1 has active class')
        ok(btn1.find('input').prop('checked'), 'btn1 is checked')
        ok(!btn2.hasClass('active'), 'btn2 does not have active class')
        ok(!btn2.find('input').prop('checked'), 'btn2 is not checked')
        btn2.find('input').click()
        ok(!btn1.hasClass('active'), 'btn1 does not have active class')
        ok(!btn1.find('input').prop('checked'), 'btn1 is checked')
        ok(btn2.hasClass('active'), 'btn2 has active class')
        ok(btn2.find('input').prop('checked'), 'btn2 is checked')

        btn2.find('input').click() /* clicking an already checked radio should not un-check it */
        ok(!btn1.hasClass('active'), 'btn1 does not have active class')
        ok(!btn1.find('input').prop('checked'), 'btn1 is checked')
        ok(btn2.hasClass('active'), 'btn2 has active class')
        ok(btn2.find('input').prop('checked'), 'btn2 is checked')
      })

})
