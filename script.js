/*
TO DO LIST (BY ORDER)
Accelerator
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
  var $gamescreen         = $('#gamescreen');
  var $gamescreenMenu     = $('.gamescreenMenu');
  var $startMenu          = $('#startMenu');
  var gamescreenOrigin    = 0;
  var gamescreenWidth     = 400;
  var gamescreenHeight    = 570;

  //players
  var $player1paddle      = $('.player1paddle');
  var $player2paddle      = $('.player2paddle');
  var playerPaddleLeft    = 0;
  var playerPaddleHeight  = 5;
  var playerPaddleWidth   = 60;
  var playerLimitXMin     = gamescreenOrigin;
  var playerLimitXMax     = gamescreenWidth - playerPaddleWidth;
  var paddleMovement      = 10;
  var movement1           = {right: false, left: false};
  var movement2           = {right: false, left: false};
  var $player1Text         = $('.player1score span');
  var player1score        = $player1Text.val();
  var p1score             = Number(player1score);
  var $player2Text         = $('.player1score span');
  var player2score        = $player2Text.val();
  var p2score             = Number(player1score);

  //ball
  var $ball               = $('#ball');
  var ballSize            = 7;
  var ballCSSSize         = $ball.css({width: ballSize,height: ballSize});
  var ballMovementX       = 5;
  var ballMovementY       = 3;
  var defaultBallMovement = 2.5;
  var ballLimitXMin       = gamescreenOrigin;
  var ballLimitXMax       = gamescreenWidth - ballSize;
  var ballLimitYMin       = gamescreenOrigin;
  var ballLimitYMax       = gamescreenHeight - ballSize;
  var ballLastContact     = '';

  //bricks
  var $brick              = $('.brick');
  var amountOfBrick       = 0;

  //sounds
  var startMenuBGM;
  var gameOverBGM;
  var gamePlay;
  var bumpBrick;
  var bumpElse;

  //===================================
  // BRICKS
  //===================================

  var generateBricks = function (player, brickTop, fullHeight, brickColor, bricksColumn, bricksRow) {
    var fullWidth         = 400;

    var brickLeftDefault  = 20;
    var brickLeft         = brickLeftDefault;
    var brickMarginX      = 10;
    var brickMarginY      = 5;

    var brickWidth    = (fullWidth - (2*brickLeft) - ((bricksColumn-1)*brickMarginX))/bricksColumn;
    var brickHeight   = (fullHeight - (2*brickTop) - ((bricksRow-1)*brickMarginY))/bricksRow;

    for (var i=0; i<bricksRow; i++) {
      for (var j=0; j<bricksColumn; j++) {
        var $newBrick = $('<div class="brick '+ player +'" data-class="'+ amountOfBrick +'"">');
        $newBrick.css({
          width: brickWidth,
          height: brickHeight,
          top: brickTop,
          left: brickLeft,
          'background-color': brickColor,
        });

        $($newBrick).appendTo($('#gamescreen'));
        brickLeft += brickWidth + brickMarginX;

        amountOfBrick++
      }

      brickTop += brickHeight + brickMarginY;
      brickLeft = brickLeftDefault;

    }

  }

  //===================================
  // COLLISION DETECTION
  //===================================
  var detectCollision = function () {

    // NOTE1: we record ballLastContact = '$player1paddle' so the ball doesn't stuck on paddle.
    // NOTE2: we record ballLastContact = '$gamescreen'; so the ball doesn't go through the paddle.

    //BOUNDARY COLLISION
    var positionBall  = $ball.position();
    var ballTop       = positionBall.top;
    var ballBottom    = ballTop + ballSize;
    var ballLeft      = positionBall.left;
    var ballRight     = ballLeft + ballSize;

    if (ballLeft <= ballLimitXMin || ballLeft >= ballLimitXMax) {
      ballMovementX       = -ballMovementX;
      ballLastContact     = '$gamescreen';
    }

    if (ballTop <= ballLimitYMin || ballTop >= ballLimitYMax) {
      ballMovementY       = -ballMovementY;
      ballLastContact     = '$gamescreen';
    }

    //PADDLE COLLISSION
    //Collision with Player 1's paddle
    var position1         = $player1paddle.position();

    var position1top      = position1.top;
    var position1left     = position1.left;
    var position1bottom   = position1.top + playerPaddleHeight;
    var position1right    = position1.left + playerPaddleWidth;

    if (ballBottom        >= position1top
       && ballTop         <= position1bottom
       && ballRight       >= position1left
       && ballLeft        <= position1right
       && ballLastContact !== '$player1paddle'
      ) {
      ballMovementY       = -ballMovementY;
      ballLastContact     = '$player1paddle';
    }

    //Collision with Player 2's paddle
    var position2         = $player2paddle.position();

    var position2top      = position2.top;
    var position2left     = position2.left;
    var position2bottom   = position2.top + playerPaddleHeight;
    var position2right    = position2.left + playerPaddleWidth;

    if (ballBottom        >= position2top
       && ballTop         <= position2bottom
       && ballRight       >= position2left
       && ballLeft        <= position2right
      && ballLastContact  !== '$player2paddle'
      ) {
      ballMovementY       = -ballMovementY;
      ballLastContact     = '$player2paddle';
    }


    //BRICK COLLISION
    //function doesn't recognized top after brick deleted???

    /*$brick.each(function() {
      for (var i=0; i<$brick.length; i++) {
        var brick         = $('.brick[data-class='+i+']');
        var brickPosition = brick.position();
        var brickTop      = brickPosition.top;
        var brickLeft     = brickPosition.left;
        var brickBottom   = brickPosition.top + 16; //take Height value from generateBricks?
        var brickRight    = brickPosition.left + 36.25; //take Width value from generateBricks?

        if (ballBottom >= brickTop
           && ballTop <= brickBottom
           && ballRight >= brickLeft
           && ballLeft <= brickRight
          ) {

            ballMovementY = -ballMovementY;
            ballMovementX = -ballMovementX;

            //remove that brick
            brick.remove();

            //add score to player
            // $brick.class not appropriate
            if ($brick.class = "player1") {
              p2score +=10;
              console.log(p1score);

              $('.player1score span').text("0000" + p1score).slice(-4);
            } else if ($brick.class = "player2") {
              p1score +=10;
              console.log(p1score);

              $('.player1score span').text("0000" + p1score).slice(-4);
          }
        }
      }
    });*/

  };

  //===================================
  // MOVEMENTS
  //===================================

  var movePlayer = function ($playerPaddle, movement) {
    var playerPosition = $playerPaddle.position();
    var playerLeft  = playerPosition.left;

    if (movement.left && playerLeft > playerLimitXMin) {
      // check gap so paddle doesn't go offscreen
      var gap = playerLeft - playerLimitXMin;

      if (gap < paddleMovement) {
        $playerPaddle.css({left: playerLeft - gap});
      } else {
        $playerPaddle.css({left: playerLeft - paddleMovement});
      }
    }

    if (movement.right && playerLeft < playerLimitXMax) {
      // check gap so paddle doesn't go offscreen
      var gap = playerLimitXMax - playerLeft;

      if (gap < paddleMovement) {
        $playerPaddle.css({left: playerLeft + gap});
      } else {
        $playerPaddle.css({left: playerLeft + paddleMovement});
      }
    }
  };

  //ball move
  var moveBall = function () {
    var positionBall = $ball.position();

    detectCollision();

    $ball.css({
      left: positionBall.left - ballMovementX,
      top: positionBall.top + ballMovementY
    });

    // reset ballMovement if a gap occurred at detectCollision
    if (ballMovementX > 0) {
      ballMovementX = defaultBallMovement;
    } else if (ballMovementX < 0) {
      ballMovementX = -defaultBallMovement;
    }

    if (ballMovementY > 0) {
      ballMovementY = defaultBallMovement;
    } else if (ballMovementY < 0) {
      ballMovementY = -defaultBallMovement;
    }
  };

  //===================================
  // GAME STATES
  //===================================
  //PLAY
  var gameloopPlay = function() {
    gameloop = window.setInterval(function(){
      moveBall();
      movePlayer($player1paddle, movement1);
      movePlayer($player2paddle, movement2);
    }, 17);
  }

  //PAUSE
  var gameloopPause = function() {
    window.clearInterval(gameloop);
  }

  //RESUME
  var resumeGame = function(e) {
    $menu.hide();
    gameloopPlay();
  };

  //RESET
  var resetGame = function() {
    //reset score
    $player1Text.text('00000');
    $player2Text.text('00000');

    //reset brick
    $('.brick').remove();

    //reset ball position
    $ball.css({top: '50%', left: '50%'});

    //reset paddle position
    $player1paddle.css({top: 160,left: 180});
    $player2paddle.css({bottom: 160, left: 180});
  };


  //WINNER
  var winner = function() {
    var maxP1Bricks = $('.brick.player1').length;
    var maxP2Bricks = $('.brick.player2').length;

    if (maxP1Bricks === 0) {
      console.log('P2 WINS!');
      resetGame();
    } else if (maxP2Bricks === 0) {
      console.log('P1 WINS!');
      resetGame();
    }

  };

  //MENU
  var bindInGameMenu = function () {
    $(document).off('keypress').on('keypress', function(e) {
      if (e.keyCode == 32) {
        gameloopPause();
        $startMenu.hide();
        $menu.toggle();

        $('#continue').off().on('click', resumeGame);
        $('#quit').off().on('click', startMenu);

      }
    });
  }

  //PADDLE KEY MOVEMENT
  var bindMovementKeys = function () {
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
        case 37:
        movement1.left = false;
        break;
      }

      switch (e.keyCode) {
        case 39:
        movement1.right = false;
        break;
      }

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

  //START GAME
  var startGame = function() {
    resetGame();
    bindInGameMenu();
    bindMovementKeys();

    amountOfBrick       = 0;
    generateBricks('player1', 40, 180,'blue',8,5);
    generateBricks('player2', 430, 960, 'yellow',8,5);

    $(document).off('click').one('click', gameloopPlay());

    winner();

  };

  //START MENU
  var startMenu = function() {
    $menu.hide();
    $startMenu.show();
    $startMenu.off('click').one('click', function() {
      $(document).off('click').one('click', startGame());
      $startMenu.hide();
    });
  };

  //RUN THE GAME
  startMenu();

});