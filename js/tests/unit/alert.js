$(function () {

    module('alert plugin')

      test('should be defined on jquery object', function () {
        ok($(document.body).alert, 'alert method is defined')
      })

    module('alert', {
      setup: function() {

        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _alertPlugin = $.fn.alert.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        // Usage: $('.my-selector').alert('close') becomes _alert( $('.my-selector'), 'close' )
        window._alert = function($el, args) {
          return _alertPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._alert.plugin = _alertPlugin

      },
      teardown: function() {

        // Re-attach as jQuery plugin
        $.fn.alert = window._alert.plugin
        delete window._alert
        
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.alert, 'alert was set back to undefined (org value)')
      })

      test('should return element', function () {
        ok(_alert( $(document.body) )[0] == document.body, 'document.body returned')
      })

      test('should fade element out on clicking .close', function () {
        var alertHTML = '<div class="alert-message warning fade in">' +
            '<a class="close" href="#" data-dismiss="alert">×</a>' +
            '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
            '</div>',
          alert = _alert( $(alertHTML) )

        alert.find('.close').click()

        ok(!alert.hasClass('in'), 'remove .in class on .close click')
      })

      test('should remove element when clicking .close', function () {
        $.support.transition = false

        var alertHTML = '<div class="alert-message warning fade in">' +
            '<a class="close" href="#" data-dismiss="alert">×</a>' +
            '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>' +
            '</div>',
          alert = _alert( $(alertHTML).appendTo('#qunit-fixture') )

        ok($('#qunit-fixture').find('.alert-message').length, 'element added to dom')

        alert.find('.close').click()

        ok(!$('#qunit-fixture').find('.alert-message').length, 'element removed from dom')
      })

      test('should not fire closed when close is prevented', function () {
        $.support.transition = false
        stop();
        var div = $('<div class="alert"/>')
        div
          .on('close.bs.alert', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .on('closed.bs.alert', function () {
            ok(false);
          })

        _alert(div, 'close');
      })

})
