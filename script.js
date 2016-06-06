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

  var $menu = $('#menu');
  var $gamescreenMenu = $('.gamescreenMenu');

  //===================================
  // BRICKS
  //===================================
  var $player1brick = $('.player1brick');
  var $player2brick = $('.player2brick');

  var p1bricks = [
    [1,1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1]
    ];

  var p2bricks = [];
  var brickRowCount = 3;
  var brickColumnCount = 5;
  var colors = {};


  /*var brick = {
    brickObj:$('.brick')[0],
    x: brickObj.left,
    y:brickObj.top,
    endX:,
    endY:
  }*/

  //generate bricks field
  //for player1
  var generateP1Bricks = function() {
    for (var i=0; c<p1bricks.length; i++) {
      for (var j=0; r<p1bricks[i].length; j++) {
        //addnewelement, addclass
        var $newdiv1 = $('.player1brick');
        $newdiv1.appendTo(p1bricks[i][j]);
      }
    }
  }

  //for player2


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

  //add key [SPACE] for menu
  var keyMenu = function () {
    $(document).on('keypress', function(e) {
      var flip = 0;
      if (e.keyCode == 32) {
          $menu.toggle();
          //pause functions TO DO
          //do something when menu selected TO DO
      }
    });
  }

  //key movements for PLAYER 1's paddle
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

  //key movements for PLAYER 2's paddle
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
    //gap vs ballmovement DEBUG LIST !!!!!
    if (positionBall.left == 0 || positionBall.left == 385) {
      ballMovementX = -ballMovementX;
    }

    if (positionBall.top == 0 || positionBall.top == 555) {
      ballMovementY = -ballMovementY;
    }


    //collision with paddle
    //gap vs position1 and position2 DEBUG LIST !!!!!
    //collision direction if paddle move left or right (if movement == true and hit)
    var position1 = $player1paddle.position();
    var position1bottom = position1.top + 5;
    var position1right = position1.left + 60;

    var position2 = $player2paddle.position();
    var position2bottom = position2.top + 5;
    var position2right = position2.left + 60;


    if ((positionBall.top + 15) >= position1.top
       && positionBall.top<= position1bottom
       && positionBall.left >= position1.left
       && positionBall.left <= position1right
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;
    }

    if ((positionBall.top + 15) >= position2.top
       && positionBall.top <= position2bottom
       && positionBall.left >= position2.left
       && positionBall.left <= position2right
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;
    }

    //collision with bricks
    var brick1position = $player1brick.position();
    var brick1positionbottom = brick1position.top + 10;
    var brick1positionright = brick1position.left + 30;

    if (positionBall.top >= brick1position.top
       && positionBall.top <= brick1positionbottom
       && positionBall.left >= brick1position.left
       && positionBall.left <= brick1positionright
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;

      //remove player 1 brick
      $('.brick.player1brick').remove();

      //add score to player 2
      //var player2score = $('.player2score span').val();
      //Number(player2score) ++;
    }

    var brick2position = $player2brick.position();
    var brick2positionbottom = brick2position.top + 10;
    var brick2positionright = brick2position.left + 30;

    if (positionBall.top >= brick2position.top
       && positionBall.top <= brick2positionbottom
       && positionBall.left >= brick2position.left
       && positionBall.left <= brick2positionright
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;

      //remove player 2 brick
      $('.brick.player2brick').remove();

      //add score to player 1
      //var player1score = $('.player1score span').val();
      //Number(player1score) ++;

    }

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
    keyMenu();

  };

  startGame();

});