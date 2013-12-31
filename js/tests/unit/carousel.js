$(function () {

    module('carousel plugin')

      test('should be defined on jquery object', function () {
        ok($(document.body).carousel, 'carousel method is defined')
      })

    module('carousel', {
      setup: function() {
        // Run all test in noConflict mode -- it's the only way to ensure that noConflict mode works
        var _carouselPlugin = $.fn.carousel.noConflict()

        // Re-write to take a jQuery object as the first parameter -- for more readable tests
        window._carousel = function($el, args) {
          return _carouselPlugin.apply($el, Array.prototype.slice.call(arguments, 1))
        }

        window._carousel.plugin = _carouselPlugin
      },
      teardown: function() {
        // Re-attach as jQuery plugin
        $.fn.carousel = window._carousel.plugin
        delete window._carousel
      }
    })

      test('should provide no conflict', function () {
        ok(!$.fn.carousel, 'carousel was set back to undefined (org value)')
      })

      test('should return element', function () {
        ok(_carousel( $(document.body) )[0] == document.body, 'document.body returned')
      })

      test('should not fire slide when slide is prevented', function () {
        $.support.transition = false
        stop()
        var div = $('<div class="carousel"/>')
        div
          .on('slide.bs.carousel', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .on('slid.bs.carousel', function () {
            ok(false);
          })

        _carousel(div, 'next')
      })

      test('should reset when slide is prevented', function () {
        var template = '<div id="carousel-example-generic" class="carousel slide"><ol class="carousel-indicators"><li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li><li data-target="#carousel-example-generic" data-slide-to="1"></li><li data-target="#carousel-example-generic" data-slide-to="2"></li></ol><div class="carousel-inner"><div class="item active"><div class="carousel-caption"></div></div><div class="item"><div class="carousel-caption"></div></div><div class="item"><div class="carousel-caption"></div></div></div><a class="left carousel-control" href="#carousel-example-generic" data-slide="prev"></a><a class="right carousel-control" href="#carousel-example-generic" data-slide="next"></a></div>'
        var $carousel = $(template)
        $.support.transition = false
        stop()
        $carousel.one('slide.bs.carousel', function (e) {
          e.preventDefault()
          setTimeout(function () {
            ok($carousel.find('.item:eq(0)').is('.active'))
            ok($carousel.find('.carousel-indicators li:eq(0)').is('.active'))
            $carousel.carousel('next')
          }, 1);
        })
        $carousel.one('slid.bs.carousel', function () {
          setTimeout(function () {
            ok($carousel.find('.item:eq(1)').is('.active'))
            ok($carousel.find('.carousel-indicators li:eq(1)').is('.active'))
            start()
          }, 1);
        })
        $carousel.carousel('next')
      })

      test('should fire slide event with direction', function () {
        var template = '<div id="myCarousel" class="carousel slide"><div class="carousel-inner"><div class="item active"><img alt=""><div class="carousel-caption"><h4>{{_i}}First Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Second Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Third Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div></div><a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a><a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a></div>'
        $.support.transition = false
        stop()
        var div = $(template).on('slide.bs.carousel', function (e) {
          e.preventDefault()
          ok(e.direction)
          ok(e.direction === 'right' || e.direction === 'left')
          start()
        })

        _carousel(div, 'next')
      })

      test('should fire slide event with relatedTarget', function () {
        var template = '<div id="myCarousel" class="carousel slide"><div class="carousel-inner"><div class="item active"><img alt=""><div class="carousel-caption"><h4>{{_i}}First Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Second Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div><div class="item"><img alt=""><div class="carousel-caption"><h4>{{_i}}Third Thumbnail label{{/i}}</h4><p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p></div></div></div><a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a><a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a></div>'
        $.support.transition = false
        stop()
        var div = $(template)
        div
          .on('slide.bs.carousel', function (e) {
            e.preventDefault();
            ok(e.relatedTarget);
            ok($(e.relatedTarget).hasClass('item'));
            start();
          })

        _carousel(div, 'next')
      })

      test('should set interval from data attribute', 4, function () {
        var template = $('<div id="myCarousel" class="carousel slide"> <div class="carousel-inner"> <div class="item active"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}First Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Second Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> <div class="item"> <img alt=""> <div class="carousel-caption"> <h4>{{_i}}Third Thumbnail label{{/i}}</h4> <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p> </div> </div> </div> <a class="left carousel-control" href="#myCarousel" data-slide="prev">&lsaquo;</a> <a class="right carousel-control" href="#myCarousel" data-slide="next">&rsaquo;</a> </div>');
        template.attr('data-interval', 1814);

        template.appendTo('body');
        $('[data-slide]').first().click();
        ok($('#myCarousel').data('bs.carousel').options.interval == 1814);
        $('#myCarousel').remove();

        template.appendTo('body').attr('data-modal', 'foobar');
        $('[data-slide]').first().click();
        ok($('#myCarousel').data('bs.carousel').options.interval == 1814, 'even if there is an data-modal attribute set');
        $('#myCarousel').remove();

        template.appendTo('body');
        $('[data-slide]').first().click();
        $('#myCarousel').attr('data-interval', 1860);
        $('[data-slide]').first().click();
        ok($('#myCarousel').data('bs.carousel').options.interval == 1814, 'attributes should be read only on intitialization');
        $('#myCarousel').remove();

        template.attr('data-interval', false);
        template.appendTo('body');
        _carousel($('#myCarousel'), 1);
        ok($('#myCarousel').data('bs.carousel').options.interval === false, 'data attribute has higher priority than default options');
        $('#myCarousel').remove();
      })
})
