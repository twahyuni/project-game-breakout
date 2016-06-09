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
  var $startMenu          = $('#startMenu');
  var gamescreenOrigin    = 0;
  var gamescreenWidth     = 400;
  var gamescreenHeight    = 570;

  //players
  var $player1paddle      = $('.player1paddle');
  var $player2paddle      = $('.player2paddle');
  var playerPaddlePosX    = 180;
  var playerPaddlePosY    = 160;
  var playerPaddleLeft    = 0;
  var playerPaddleHeight  = 5;
  var playerPaddleWidth   = 60;
  var playerLimitXMin     = gamescreenOrigin;
  var playerLimitXMax     = gamescreenWidth - playerPaddleWidth;
  var paddleMovement      = 10;

  var player1           = {
    movement: {right: false, left: false},
    scoreText: $('.player1score span'),
    score: 0,
  }


  var player2           = {
    movement: {right: false, left: false},
    scoreText: $('.player2score span'),
    score: 0,
  }

  /*var player1score        = player1.scoreText.val();
  var p1score             = Number(player1score);
  var player2score        = player2.scoreText.val();
  var p2score             = Number(player2score);*/

  //ball
  var $ball               = $('#ball');
  var ballSize            = 7;
  var ballCSSSize         = $ball.css({width: ballSize,height: ballSize});
  var ballPosX            = '50%';
  var ballPosY            = '50%';
  var ballMovementX       = 15;
  var ballMovementY       = 13;
  var defaultBallMovement = 15;
  var ballLimitXMin       = gamescreenOrigin;
  var ballLimitXMax       = gamescreenWidth - ballSize;
  var ballLimitYMin       = gamescreenOrigin;
  var ballLimitYMax       = gamescreenHeight - ballSize;
  var ballLastContact     = '';

  //bricks
  var $brick              = $('.brick');
  var amountOfBrick       = 0;
  var brickHeightInput    = 0;
  var brickWidthInput     = 0;

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
    var fullWidth         = gamescreenWidth;

    var brickLeftDefault  = 20;
    var brickLeft         = brickLeftDefault;
    var brickMarginX      = 10;
    var brickMarginY      = 5;

    //Dynamically calculate brick's width and height
    var brickWidth    = (fullWidth - (2*brickLeft) - ((bricksColumn-1)*brickMarginX))/bricksColumn;
    var brickHeight   = (fullHeight - (2*brickTop) - ((bricksRow-1)*brickMarginY))/bricksRow;

    //put the previous values to global variables
    brickWidthInput     = brickWidth;
    brickHeightInput    = brickHeight;

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

    var leftGap       = Math.abs(ballLeft - ballLimitXMin);
    var rightGap      = Math.abs(ballLimitXMax - ballLeft);
    var topGap        = Math.abs(ballTop - ballLimitYMin);
    var bottomGap     = Math.abs(ballLimitYMax - ballTop);


    //refactor this gap please (1)
    if (leftGap < Math.abs(ballMovementX) && leftGap !== 0) {
      ballMovementX       = -leftGap;
      ballLastContact     = '$gamescreen';
    } else if (rightGap < Math.abs(ballMovementX) && rightGap !== 0) {
      ballMovementX       = rightGap;
      ballLastContact     = '$gamescreen';
    } else if (ballLeft <= ballLimitXMin || ballLeft >= ballLimitXMax){
      ballMovementX       = -ballMovementX;
      ballLastContact     = '$gamescreen';
    }

    if (topGap < Math.abs(ballMovementY) && topGap !== 0) {
      ballMovementY       = -topGap;
      ballLastContact     = '$gamescreen';
    } else if (bottomGap < Math.abs(ballMovementY) && bottomGap !== 0) {
      ballMovementY       = bottomGap;
      ballLastContact     = '$gamescreen';
    } else if (ballTop <= ballLimitYMin || ballTop >= ballLimitYMax) {
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
    var brickAreaIdentification = function (playerClass, opponentClass, scoreName) {
      var $bricks = $(playerClass);
      var bricksLength = $bricks.length;

      $bricks.each(function(index, elem){
        var $brick = $(elem);
        var brickPosition = $brick.position();
        var brickTop      = brickPosition.top;
        var brickLeft     = brickPosition.left;
        var brickBottom   = brickPosition.top + brickHeightInput;
        var brickRight    = brickPosition.left + brickWidthInput;

        if (ballBottom >= brickTop
        && ballTop <= brickBottom
        && ballRight >= brickLeft
        && ballLeft <= brickRight
        && ballLastContact !== $brick) {

          ballMovementY = -ballMovementY;
          ballMovementX = -ballMovementX;
          ballLastContact = $brick;

          //remove that brick
          $brick.remove();

          // when bricksLength is 1 other player wins
          if($bricks.length === 1) {
            gameloopPause();
            $('#continue').replaceWith('<h1>' + opponentClass.substring(1) + " wins! </h1>");
            $menu.show();
            $('#quit').off().on('click', startMenu);

          };

          //add score to player
           scoreName += 10;
           console.log(player1.score);

          //$(opponentClass + 'score span').text("000" + scoreName).slice(-4);
        }
      })
    };

    if (ballTop < 145) {
      brickAreaIdentification('.player1', '.player2', player2.score);
    } else if (ballBottom > 425) {
      brickAreaIdentification('.player2', '.player1', player1.score);
    }

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
      movePlayer($player1paddle, player1.movement);
      movePlayer($player2paddle, player2.movement);
    }, 17);
  };

  //PAUSE
  var gameloopPause = function() {
    window.clearInterval(gameloop);
  };

  //RESUME
  var resumeGame = function(e) {
    $menu.hide();
    gameloopPlay();
  };

  //RESET
  var resetGame = function() {
    //reset score
    player1.scoreText.text('00000');
    player2.scoreText.text('00000');

    //reset brick
    $('.brick').remove();

    //reset ball position
    $ball.css({top: ballPosY, left: ballPosX});

    //reset paddle position
    $player1paddle.css({top: playerPaddlePosY,left: playerPaddlePosX});
    $player2paddle.css({bottom: playerPaddlePosY, left: playerPaddlePosX});
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
  };

  //PADDLE KEY MOVEMENT
  var bindMovementKeys = function () {
    $(document).on('keydown', function(e) {
      switch (e.keyCode) {
        case 37:
        player1.movement.left = true;
        break;
      }

      switch (e.keyCode) {
        case 39:
        player1.movement.right = true;
        break;
      }

      switch (e.keyCode) {
        case 90:
        player2.movement.left = true;
        break;
      }

      switch (e.keyCode) {
        case 88:
        player2.movement.right = true;
        break;
      }

    });

    $(document).on('keyup', function(e) {
      switch (e.keyCode) {
        case 37:
        player1.movement.left = false;
        break;
      }

      switch (e.keyCode) {
        case 39:
        player1.movement.right = false;
        break;
      }

      switch (e.keyCode) {
        case 90:
        player2.movement.left = false;
        break;
      }

      switch (e.keyCode) {
        case 88:
        player2.movement.right = false;
        break;
      }
    });
  };

  //START GAME
  var startGame = function() {
    resetGame();
    bindInGameMenu();
    bindMovementKeys();

    amountOfBrick = 0;
    generateBricks('player1', 40, 180,'yellow',8,5);
    generateBricks('player2', 430, 960, 'yellow',8,5);

    $(document).off('click').one('click', gameloopPlay());

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