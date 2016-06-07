/*
Q1: why when take out position1 or 2 outside function, it doesn't work
Q2: how to take one element value? $player1brick[0].position(); doesn't work

TO DO LIST (BY ORDER)
Generate Bricks
Game States
Fix Bugs: Gap vs movement
Refactor
Add Sounds

*/

$(document).ready(function() {

  //===================================
  // VARIABLES
  //===================================
  var gameloop            = null;

  //screen area
  var $container          = $('#container');
  var $containerPosition  = $('#container').position();
  var $menu               = $('#menu');
  var $gamescreenMenu     = $('.gamescreenMenu');
  var $startMenu          = $('#startMenu');
  var gamescreenOrigin    = 0;
  var gamescreenWidth     = 400;
  var gamescreenHeight    = 570;

  //players
  var $player1paddle      = $('.player1paddle');
  var $player2paddle      = $('.player2paddle');
  var playerPaddleLeft    = 0;
  var playerPaddleRight   = 340;
  var playerPaddleHeight  = 5;
  var playerPaddleWidth   = 60;
  var playerLimitX        = gamescreenWidth - playerPaddleWidth;
  var paddleMovement      = 5;
  var movement1           = {right: false, left: false};
  var movement2           = {right: false, left: false};

  //ball
  var $ball               = $('#ball');
  var ballSize            = 15;
  var ballMovementX       = 5;
  var ballMovementY       = 3;
  var ballLimitX          = gamescreenWidth - ballSize;
  var ballLimitY          = gamescreenHeight - ballSize;
  var accelSpeed          = 2;

  //bricks
  var $player1brick       = $('.player1brick');
  var $player2brick       = $('.player2brick');
  var brickHeight         = 10;
  var brickWidth          = 30;
  var brickOffsetLeft     = 10;
  var brickOffsetTop      = 15;
  var bricksRow           = 3;
  var bricksColumn        = 9;

  //===================================
  // BRICKS
  //===================================
  var p1bricks = [
    [1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1],
    [0,1,1,1,0,1,1,1,0]
    ];

  var p2bricks = [];
  var colors = {};

  /*var p1brick = {
    brickObj:$player1brick[0],
    x: brickObj.position().left,
    y: brickObj.position().top
    endX: brickObj.position().left + 30;
    endY: brickObj.position().top + 10;
  }*/

  //generate bricks field
  //for player1

  /*add one brick
  var createP1Brick = function() {
    var newBrick = '<div class="player1brick">';
    $(newBrick).appendTo($('.p1BricksArea'));

  }*/


  var generateP1Bricks = function() {
    for (var i=1; i<bricksRow; i++) {
      for (var j=1; j<bricksColumn; j++) {
        //addnewelement, addclass
        var newBrick = '<div class="player1brick">';

        var brickX = (j*(brickWidth + brickOffsetLeft));
        var brickY = (i*(brickHeight + brickOffsetTop));

        $('.player1brick:eq('+ j +')').css({top: brickY, left:brickX});

        $(newBrick).appendTo($('.p1BricksArea'));

      }
    }
  }

  //for player2

  //===================================
  // MOVEMENTS
  //===================================

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

    if (movement1.left && position1.left > gamescreenOrigin) {
      $player1paddle.css({left: position1.left - paddleMovement});
    }
    if (movement1.right && position1.left < playerLimitX ) {
      // check how px is left to the right
      var gap = ballLimitX - position1.left;
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

    if (movement2.left && position2.left > gamescreenOrigin) {
      $player2paddle.css({left: position2.left - paddleMovement});
    }
    if (movement2.right && position2.left < playerLimitX) {
      // check how px is left to the right
      var gap = ballLimitX - position2.left;
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
    if (positionBall.left == gamescreenOrigin || positionBall.left == ballLimitX) {
      ballMovementX = -ballMovementX;
    }

    if (positionBall.top == gamescreenOrigin || positionBall.top == ballLimitY) {
      ballMovementY = -ballMovementY;
    }


    //collision with paddle
    //gap vs position1 and position2 DEBUG LIST !!!!!
    var position1 = $player1paddle.position();
    var position1bottom = position1.top + playerPaddleHeight;
    var position1right = position1.left + playerPaddleWidth;

    var position2 = $player2paddle.position();
    var position2bottom = position2.top + playerPaddleHeight;
    var position2right = position2.left + playerPaddleWidth;


    if ((positionBall.top + ballSize) >= position1.top
       && positionBall.top<= position1bottom
       && positionBall.left >= position1.left
       && positionBall.left <= position1right
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;
    }

    if ((positionBall.top + ballSize) >= position2.top
       && positionBall.top <= position2bottom
       && positionBall.left >= position2.left
       && positionBall.left <= position2right
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;
    }

    //Change Acceleration while paddle moving
    //collision direction if paddle move left or right (if movement == true and hit)
    var changeAcceleration = function () {
      if (movement1.left) {
        ballMovementY = -(Math.abs(accelSpeed+ballMovementY));
      }
      if (movement1.right) {

      }
      if (movement2.left) {

      }
      if (movement2.right) {

      }
    };

    //collision with bricks
    /*var brick1position = $player1brick.position();
    var brick1positionbottom = brick1position.top + brickHeight;
    var brick1positionright = brick1position.left + brickWidth;

    if (positionBall.top >= brick1position.top
       && positionBall.top <= brick1positionbottom
       && positionBall.left >= brick1position.left
       && positionBall.left <= brick1positionright
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;

      //remove player 1 brick
      $('.player1brick').remove();

      //add score to player 2
      var player2score = $('.player2score span').val();
      var p2score = Number(player2score);
      p2score ++;
      console.log(p2score);
      $('.player2score span').text("0000" + p2score).slice(-4);
    }

    var brick2position = $player2brick.position();
    var brick2positionbottom = brick2position.top + brickHeight;
    var brick2positionright = brick2position.left + brickWidth;

    if (positionBall.top >= brick2position.top
       && positionBall.top <= brick2positionbottom
       && positionBall.left >= brick2position.left
       && positionBall.left <= brick2positionright
      ) {
      ballMovementY = -ballMovementY;
      ballMovementX = -ballMovementX;

      //remove player 2 brick
      $('.player2brick').remove();

      //add score to player 1
      var player1score = $('.player1score span').val();
      var p1score = Number(player1score);
      p1score ++;
      console.log(p1score);
      $('.player1score span').text("0000" + p1score).slice(-4);
    }*/

  }


  //===================================
  // GAME STATES
  //===================================
  //winner
  //if playerXBricksArea is empty, playerY wins and go to game over
  var winner = function() {

  };

  //access menu through [SPACE]
  var keyMenu = function () {
    $(document).on('keypress', function(e) {
      if (e.keyCode == 32) {
        $startMenu.hide();
        $menu.toggle();

        //pause functions TO DO: stop propagation?

        $('#continue').on('click', resumeGame);
        $('#newGame').on('click', resetGame);
        $('#quit').on('click', startMenu);
      }
    });
  }

  //resume
  var resumeGame = function() {
     $menu.hide();
  };

  //game over
  var gameOver = function() {

  };

  //reset game
  var resetGame = function() {

  };

  //start menu
  var startMenu = function() {
      $menu.hide();
      $startMenu.show();
      $startMenu.on('click', function() {
        startGame(); //make only one start game run?
        $startMenu.hide();
      });
  };

  //start game
  var startGame = function() {
    gameloop = setInterval(function(){
      player1Move();
      player2Move();
      moveBall();
    }, 17);

    keyMovement1();
    keyMovement2();
    keyMenu();
    generateP1Bricks();

  };

  //run
  startMenu();

});