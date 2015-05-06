(function(){
  var Elevators = window.Elevators = window.Elevators || {};

  var Elevator = Elevators.Elevator = function($el){
    this.$el = $el;
    var duration = null;
    var mainAudio = true;
    var endAudio;
    var rideAudio;
  }

  Elevator.prototype = {

    elevate : function () {

      if (elevator.movable(this) === false){
        endAudio.play();
        window.alert('cant move!');
        return;
      }
      var $buttons = $(".elevator-button");
      var topOrBot = "0px";

      if ($(this).hasClass('down')) {
        topOrBot = $(document).height() - $(window).height();
      }

      var animationComplete = false;
      var that = this;
      rideAudio.play();
      $buttons.attr("disabled", true);
      $(that).addClass('moving');
      $("html, body").animate({
        scrollTop: topOrBot,
        easing: "easeInOutQuad",
      }, duration, function(){
        if (!animationComplete){
          animationComplete = true
          rideAudio.pause();
          endAudio.play();
          $(that).removeClass('moving');
          $buttons.attr("disabled", false);
        }
      });
    },

    appendButtons : function () {
      console.log("in buttons");
      var $footer = $('<div/>').addClass("footer");

      var $upButton = $('<button/>').html('&#9650;')
                        .addClass("elevator-button up");
      $upButton.appendTo($footer);
      var $downButton = $('<button/>').html('&#9660')
                          .addClass("elevator-button down");
      $downButton.appendTo($footer);
      $footer.appendTo(this.$el);
    },

    bindElevate : function () {
      $(".elevator-button").bind('click', this.elevate);
    },

    calcDuration : function () {
      duration = $(document).height() * 3;
    },

    loadEndAudio : function () {
      endAudio = new Audio();
      endAudio.src = chrome.extension.getURL('audio/bellRing.mp3');
      endAudio.load();
      endAudio.currentTime = 1;
      endAudio.addEventListener("play", function(){
        setTimeout(function(){
          this.resetAudio();
        }.bind(this), 600);
      }.bind(this));
      rideAudio = new Audio();
      rideAudio.src = chrome.extension.getURL('audio/rideAudio.mp3');
      rideAudio.load();
      rideAudio.currentTime = 48.5;
    },

    resetAudio : function () {
      rideAudio.pause();
      rideAudio.currentTime = 48.5;
      endAudio.pause();
      endAudio.currentTime = 1;
    },

    movable : function (btn) {
      var docHeight = $(window).scrollTop() + $(window).height();
      if ($(btn).hasClass('down') && docHeight === $(document).height())
        return false;
      if ($(btn).hasClass('up') && $(window).scrollTop() === 0)
        return false;
      return true;
    },

    main : function (element) {
      this.loadEndAudio();
      this.calcDuration();
      this.appendButtons();
      this.bindElevate();
      console.log("in main");
    },
  }


})();
console.log("in script");

var $el = $("body");
var elevator = new Elevators.Elevator($el);
elevator.main($el);
//make buttons pretty
//add window blur
