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

    elevate : function (opt, key) {
      var option = opt || false;
      var keyboard = key || false

      if (!elevator.movable(this) || !elevator.movable(keyboard)){
        endAudio.play();
        return;
      }
      var $buttons = $(".elevator-button");
      var topOrBot = "0px";
      
      if ($(this).hasClass('down') || option === true) {
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
      var $elevatorFooter = $('<div/>').addClass("elevator-footer");

      var $upButton = $('<button/>').html('&#9650;')
                        .addClass("elevator-button up");
      $upButton.appendTo($elevatorFooter);
      var $downButton = $('<button/>').html('&#9660')
                          .addClass("elevator-button down");
      $downButton.appendTo($elevatorFooter);
      $elevatorFooter.appendTo(this.$el);
    },

    removeButtons : function () {
      $(".elevator-button up").remove();
      $(".elevator-button down").remove();
      $(".elevator-footer").remove();
    },

    toggleButtons : function () {
      if($(".elevator-button").length === 0){
        elevator.appendButtons();
        elevator.bindElevate();
      } else {
        elevator.removeButtons();
      }
    },

    bindElevate : function () {
      $(".elevator-button").bind('click', this.elevate);
    },

    setDuration : function () {
      // duration = $(document).height() * 3;
      duration = 5000;
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
      if ((btn === "down" || $(btn).hasClass('down')) && docHeight === $(document).height())
        return false;
      if ((btn === "up" || $(btn).hasClass('up')) && $(window).scrollTop() === 0)
        return false;
      return true;
    },

    bindButtonToggle : function () {
      var keys = {};
      window.addEventListener('keydown', function(e) {
        keys[e.which] = true;
        $(document).keydown(function (e) {
          keys[e.which] = true;

          addOrRemoveButtons().bind(e);
        });

        $(document).keyup(function (e) {
          delete keys[e.which];
        });

        function addOrRemoveButtons() {
          if (keys.hasOwnProperty(17) && keys.hasOwnProperty(16) && keys.hasOwnProperty(66)){
            elevator.toggleButtons();
          }
          if (keys.hasOwnProperty(17) && keys.hasOwnProperty(16) && keys.hasOwnProperty(189)){
            //down
            this.stop();
            elevator.elevate(true, "down")
          }
          if (keys.hasOwnProperty(17) && keys.hasOwnProperty(16) && keys.hasOwnProperty(187)){
            //up
            this.stop();
            elevator.elevate(false, "up");
          }
          if (keys.hasOwnProperty(17) && keys.hasOwnProperty(16) && keys.hasOwnProperty(221))
              duration -= 1000
          if (keys.hasOwnProperty(17) && keys.hasOwnProperty(16) && keys.hasOwnProperty(219))
              duration += 1000
        }
      }, false)
    },

    main : function (element) {
      this.loadEndAudio();
      this.setDuration();
      this.bindButtonToggle();
    },
  }


})();

var $el = $("body");
var elevator = new Elevators.Elevator($el);
elevator.main($el);
