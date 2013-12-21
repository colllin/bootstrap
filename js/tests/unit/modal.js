$(function () {

  module('modal plugin')

    test('should be defined on jquery object', function () {
      var div = $('<div id="modal-test"></div>')
      ok(div.modal, 'modal method is defined')
    })

    test('should expose defaults var for settings', function () {
      ok($.fn.modal.Constructor.DEFAULTS, 'default object exposed')
    })

  module('modal', {
      setup: function() {
        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _modalPlugin = $.fn.modal.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        window._modal = function($el, args) {
          return _modalPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._modal.plugin = _modalPlugin
      },
      teardown: function() {
        // Re-attach as jQuery plugin
        $.fn.modal = window._modal.plugin
        delete window._modal
      }
    })

    test('should provide no conflict', function () {
      ok(!$.fn.modal, 'modal was set back to undefined (org value)')
    })

    test('should return element', function () {
      var div = $('<div id="modal-test"></div>')
      ok(_modal(div) == div, 'document.body returned')
      $('#modal-test').remove()
    })

    test('should insert into dom when show method is called', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"></div>')
      div
        .on('shown.bs.modal', function () {
          ok($('#modal-test').length, 'modal inserted into dom')
          $(this).remove()
          start()
        })

      _modal(div, 'show')
    })

    test('should fire show event', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"></div>')
      div
        .on('show.bs.modal', function () {
          ok(true, 'show was called')
        })
        .on('shown.bs.modal', function () {
          $(this).remove()
          start()
        })

      _modal(div, 'show')
    })

    test('should not fire shown when default prevented', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"></div>')
      div
        .on('show.bs.modal', function (e) {
          e.preventDefault()
          ok(true, 'show was called')
          start()
        })
        .on('shown.bs.modal', function () {
          ok(false, 'shown was called')
        })

      _modal(div, 'show')
    })

    test('should hide modal when hide is called', function () {
      stop()
      $.support.transition = false

      var div = $('<div id="modal-test"></div>')
      div
        .on('shown.bs.modal', function () {
          ok($('#modal-test').is(':visible'), 'modal visible')
          ok($('#modal-test').length, 'modal inserted into dom')
          _modal($(this), 'hide')
        })
        .on('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          $('#modal-test').remove()
          start()
        })
      
      _modal(div, 'show')
    })

    test('should toggle when toggle is called', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"></div>')
      div
        .on('shown.bs.modal', function () {
          ok($('#modal-test').is(':visible'), 'modal visible')
          ok($('#modal-test').length, 'modal inserted into dom')
          _modal(div, 'toggle')
        })
        .on('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          start()
        })

      _modal(div, 'toggle')
    })

    test('should remove from dom when click [data-dismiss=modal]', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"><span class="close" data-dismiss="modal"></span></div>')
      div
        .on('shown.bs.modal', function () {
          ok($('#modal-test').is(':visible'), 'modal visible')
          ok($('#modal-test').length, 'modal inserted into dom')
          div.find('.close').click()
        })
        .on('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          start()
        })

      _modal(div, 'toggle')
    })

    test('should allow modal close with "backdrop:false"', function () {
      stop()
      $.support.transition = false
      var div = $('<div>', { id: 'modal-test', 'data-backdrop': false })
      div
        .on('shown.bs.modal', function () {
          ok($('#modal-test').is(':visible'), 'modal visible')
          _modal(div, 'hide')
        })
        .on('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          start()
        })

      _modal(div, 'show')
    })

    test('should close modal when clicking outside of modal-content', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"><div class="contents"></div></div>')
      div
        .bind('shown.bs.modal', function () {
          ok($('#modal-test').length, 'modal insterted into dom')
          $('.contents').click()
          ok($('#modal-test').is(':visible'), 'modal visible')
          $('#modal-test').click()
        })
        .bind('hidden.bs.modal', function () {
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
          div.remove()
          start()
        })

      _modal(div, 'show')
    })

    test('should trigger hide event once when clicking outside of modal-content', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"><div class="contents"></div></div>')
      var triggered
      div
        .bind('shown.bs.modal', function () {
          triggered = 0
          $('#modal-test').click()
        })
        .one('hidden.bs.modal', function () {
          _modal(div, 'show')
        })
        .bind('hide.bs.modal', function () {
          triggered += 1
          ok(triggered === 1, 'modal hide triggered once')
          start()
        })

      _modal(div, 'show')
    })

    test('should close reopened modal with [data-dismiss=modal] click', function () {
      stop()
      $.support.transition = false
      var div = $('<div id="modal-test"><div class="contents"><div id="close" data-dismiss="modal"></div></div></div>')
      div
        .bind('shown.bs.modal', function () {
          $('#close').click()
          ok(!$('#modal-test').is(':visible'), 'modal hidden')
        })
        .one('hidden.bs.modal', function () {
          div.one('hidden.bs.modal', function () {
            start()
          })

          _modal(div, 'show')
        })

      _modal(div, 'show')

      div.remove()
    })
})
