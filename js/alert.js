/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert   = function (el) {
      $(el).on('click', dismiss, this.close)
    }

    Alert.VERSION = '3.1.1'

    Alert.prototype.close = function (e) {
      var $this    = $(this)
      var selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }

      var $parent = $(selector)

      if (e) e.preventDefault()

      if (!$parent.length) {
        $parent = $this.hasClass('alert') ? $this : $this.parent()
      }

      e = $.Event('close.bs.alert')
      e.preventDefault()
      var isDefaultPrevented = false
      e.preventDefault = function() {
        isDefaultPrevented = true
      }

      $parent.trigger(e)

      if (isDefaultPrevented) return

      $parent.removeClass('in')

      function removeElement() {
        // detach from parent, fire event then clean up data
        $parent.detach().trigger('closed.bs.alert').remove()
      }

      $.support.transition && $parent.hasClass('fade') ?
        $parent
          .one('bsTransitionEnd', removeElement)
          .emulateTransitionEnd(150) :
        removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.alert')

        if (!data) $this.data('bs.alert', (data = new Alert(this)))
        if (typeof option == 'string') data[option].call($this)
      })
    }

    var old = $.fn.alert

    $.fn.alert             = Plugin
    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
      $.fn.alert = old
      return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

  })

}();
