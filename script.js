/*

*/

$(document).ready(function() {
  //===================================
  // VARIABLES
  //===================================
  var $container = $('#container');
  var $containerPosition = $('#container').position();

  var $player1paddle = $('.player1paddle');
  var $player2paddle = $('.player2paddle');
  var paddleMovement = 5;

  var $ball = $('#ball');
  var ballMovementX = 5;
  var ballMovementY = 3;

  var x = $container / 2;
  var y = $container / 2;
  var dx = 2;
  var dy = 2;

  //===================================
  // BRICKS
  //===================================
  var bricks = [];
  var player1brick = $('.player1brick');
  var player2brick = $('.player2brick');

  /*var brick = {
    brickObj:$('.brick')[0],
    x: brickObj.left,
    y:brickObj.top,
    endX:,
    endY:
  }*/

  //===================================
  // MOVEMENTS
  //===================================
  var movement1 = {
    right: false,
    left: false,
  };

  var movement2 = {
    right: false,
    left: false,
  };

  var keyMovement1 = function () {
    $(document).on('keydown', function(e) {
      switch (e.keyCode) {
        case 37:
        movement1.left = true;
        break;
      }

      switch (e.keyCode) {
        case 39:
        movement1.right = true;
        break;
      }
    });

    $(document).on('keyup', function(e) {
      switch (e.keyCode) {
        case 37:
        movement1.left = false;
        break;
      }

      switch (e.keyCode) {
        case 39:
        movement1.right = false;
        break;
      }
    });
  }

  var keyMovement2 = function () {
    $(document).on('keydown', function(e) {
      switch (e.keyCode) {
        case 90:
        movement2.left = true;
        break;
      }

      switch (e.keyCode) {
        case 88:
        movement2.right = true;
        break;
      }
    });

    $(document).on('keyup', function(e) {
      switch (e.keyCode) {
        case 90:
        movement2.left = false;
        break;
      }

      switch (e.keyCode) {
        case 88:
        movement2.right = false;
        break;
      }
    });
  }

  var player1Move = function () {
    var position1 = $player1paddle.position();
    var position1endX = position1.left + $player1paddle.width();

    if (movement1.left && position1.left > 0) {
      $player1paddle.css({left: position1.left - paddleMovement});
    }
    if (movement1.right && position1.left < 340 ) {
      // check how px is left to the right
      var gap = 340 - position1.left;
      // if its less the the moving px
      // then only move by that much instead
      if (gap < paddleMovement) {
        $player1paddle.css({left: position1.left + gap});
      }
      $player1paddle.css({left: position1.left + paddleMovement});
    }
  };

  var player2Move = function () {
    var position2 = $player2paddle.position();

    if (movement2.left && position2.left > 0) {
      $player2paddle.css({left: position2.left - paddleMovement});
    }
    if (movement2.right && position2.left < 340) {
      // check how px is left to the right
      var gap = 340 - position2.left;
      // if its less the the moving px
      // then only move by that much instead
      if (gap < paddleMovement) {
        $player2paddle.css({left: position2.left + gap});
      }
      $player2paddle.css({left: position2.left + paddleMovement});
    }
  };

  var moveBall = function () {
    var positionBall = $ball.position();

      $ball.css({
        left: positionBall.left - ballMovementX,
        top: positionBall.top + ballMovementY
      });

    detectCollision();
  }

  //===================================
  // BOUNCE/COLLISION DETECTION/BOUNDARY
  //===================================
  var detectCollision = function () {
    var positionBall = $ball.position();

    //collision with sides: left, right, top, bottom
    if (positionBall.left == 0 || positionBall.left == 385) {
      ballMovementX = -ballMovementX;
    }

    if (positionBall.top == 0 || positionBall.top == 555) {
      ballMovementY = -ballMovementY;
    }


    //collision with paddle

    var position1 = $player1paddle.position();
    var position1bottom = position1.top + 10;
    var position1right = position1.left + 60;

    var position2 = $player2paddle.position();
    var position2bottom = position2.top + 10;
    var position2right = position2.left + 60;

    if (positionBall.top >= position1.top
       && positionBall.top <= position1bottom
       && positionBall.left >= position1.left
       && positionBall.left <= position1right
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;
    }

    if (positionBall.top >= position2.top
       && positionBall.top <= position2bottom
       && positionBall.left >= position2.left
       && positionBall.left <= position2right
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;
    }

    //collision with bricks

  }

  //===================================
  // SCORE
  //===================================


  //===================================
  // RESET
  //===================================


  //===================================
  // RUN GAME
  //===================================
  var gameloop = null;

  var startGame = function() {
    gameloop = setInterval(function(){
      player1Move();
      player2Move();
      moveBall();
    }, 17);
    keyMovement1();
    keyMovement2();
  };

  startGame();

});