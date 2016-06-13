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
  var $gameOver           = $('#gameOver');
  var $gameOverText       = $('#gameOverText');
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

  var player1             = {
    movement: {right: false, left: false},
    scoreText: $('.player1score span'),
    score: 0
  }

  var player2             = {
    movement: {right: false, left: false},
    scoreText: $('.player2score span'),
    score: 0
  }

  //ball
  var $ball               = $('#ball');
  var ballSize            = 7;
  var ballCSSSize         = $ball.css({width: ballSize,height: ballSize});
  var ballPosX            = '50%';
  var ballPosY            = '50%';
  var ballMovementX       = 5;
  var ballMovementY       = 3;
  var defaultBallMovement = 5;
  var ballLimitXMin       = gamescreenOrigin;
  var ballLimitXMax       = gamescreenWidth - ballSize;
  var ballLimitYMin       = gamescreenOrigin;
  var ballLimitYMax       = gamescreenHeight - ballSize;
  var ballLastContact     = '';

  var ballXAxis = {
    axis: ballMovementX,
    side: $ball.position().left,
    min: ballLimitXMin,
    max: ballLimitXMax
  }

  var ballYAxis = {
    axis: ballMovementY,
    side: $ball.position().top,
    min: ballLimitYMin,
    max: ballLimitYMax
  }

  //bricks
  var $brick              = $('.brick');
  var amountOfBrick       = 0;
  var brickHeightInput    = 0;
  var brickWidthInput     = 0;
  var bricksRowInput      = 0;
  var bricksColumnInput   = 0;

  //sounds
  var optionClick         = new buzz.sound( "sounds/Jingle_Win_Synth_03.mp3" );
  var gamePlayBGM         = new buzz.sound( "sounds/8_bit_love.mp3" );
  var bumpBrick           = new buzz.sound( "sounds/Beep1.wav" );
  var bumpElse            = new buzz.sound( "sounds/Menu_Navigate_00.wav" );

  gamePlayBGM.setVolume(70);

  //winner
  var winnerName          = "";

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
    var brickWidth        = (fullWidth - (2*brickLeft) - ((bricksColumn-1)*brickMarginX))/bricksColumn;
    var brickHeight       = (fullHeight - (2*brickTop) - ((bricksRow-1)*brickMarginY))/bricksRow;

    //put the previous values to global variables
    brickWidthInput       = brickWidth;
    brickHeightInput      = brickHeight;
    bricksRowInput        = bricksRow;
    bricksColumnInput     = bricksColumn;

    for (var i=0; i<bricksRow; i++) {
      for (var j=0; j<bricksColumn; j++) {
        var $newBrick = $('<div class="brick '+ player +'" data-class="'+ amountOfBrick +'"">');
        $newBrick.css({
          width: brickWidth,
          height: brickHeight,
          top: brickTop,
          left: brickLeft,
          'background-color': brickColor
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

    //check gap for boundary
    /*var boundaryGap = function(directionGap, directionGapOpposite,ballAxis) {
      if (directionGap < Math.abs(ballAxis.axis) && directionGap !== 0) {
        ballAxis.axis       = -directionGap;
        ballLastContact     = '$gamescreen';
        bumpElse.play();
      } else if (directionGapOpposite < Math.abs(ballAxis.axis) && directionGapOpposite !== 0) {
        ballAxis.axis       = directionGapOpposite;
        ballLastContact     = '$gamescreen';
        bumpElse.play();
      } else if (ballAxis.side <= ballAxis.min || ballAxis.side >= ballAxis.max) {
        ballAxis.axis       = - ballAxis.axis;
        ballLastContact     = '$gamescreen';
        bumpElse.play();
      }
    };

    boundaryGap(leftGap, rightGap, ballXAxis);
    boundaryGap(topGap, bottomGap, ballYAxis);*/


    if (leftGap < Math.abs(ballMovementX) && leftGap !== 0) {
      ballMovementX       = -leftGap;
      ballLastContact     = '$gamescreen';
      bumpElse.play();
    } else if (rightGap < Math.abs(ballMovementX) && rightGap !== 0) {
      ballMovementX       = rightGap;
      ballLastContact     = '$gamescreen';
      bumpElse.play();
    } else if (ballLeft <= ballLimitXMin || ballLeft >= ballLimitXMax){
      ballMovementX       = - ballMovementX;
      ballLastContact     = '$gamescreen';
      bumpElse.play();
    }

    if (topGap < Math.abs(ballMovementY) && topGap !== 0) {
      ballMovementY       = -topGap;
      ballLastContact     = '$gamescreen';
      bumpElse.play();
    } else if (bottomGap < Math.abs(ballMovementY) && bottomGap !== 0) {
      ballMovementY       = bottomGap;
      ballLastContact     = '$gamescreen';
      bumpElse.play();
    } else if (ballTop <= ballLimitYMin || ballTop >= ballLimitYMax) {
      ballMovementY       = -ballMovementY;
      ballLastContact     = '$gamescreen';
      bumpElse.play();
    }


    //PADDLE COLLISSION
    //Collision with Player 1's and Player 2's paddle
    var position1         = $player1paddle.position();
    var position2         = $player2paddle.position();

    var positionP1 = {
      paddle: '$player1paddle',
      top: position1.top,
      left: position1.left,
      bottom:position1.top + playerPaddleHeight,
      right: position1.left + playerPaddleWidth
    };

    var positionP2 = {
      paddle: '$player2paddle',
      top: position2.top,
      left: position2.left,
      bottom: position2.top + playerPaddleHeight,
      right: position2.left + playerPaddleWidth
    };

    var paddleCollission = function(position) {
      if (ballBottom        >= position.top
       && ballTop         <= position.bottom
       && ballRight       >= position.left
       && ballLeft        <= position.right
       && ballLastContact  !== position.paddle
      ) {
      ballMovementY       = -ballMovementY;
      ballLastContact     = position.paddle
      bumpElse.play();
      }
    };

    paddleCollission(positionP1);
    paddleCollission(positionP2);

    //BRICK COLLISION
    var brickAreaIdentification = function (playerClass, opponentClass, player) {
      var $bricks         = $(playerClass);
      var bricksLength    = $bricks.length;

      $bricks.each(function(index, elem){
        var $brick        = $(elem);
        var brickPosition = $brick.position();
        var brickTop      = brickPosition.top;
        var brickLeft     = brickPosition.left;
        var brickBottom   = brickPosition.top + brickHeightInput;
        var brickRight    = brickPosition.left + brickWidthInput;

        if (ballBottom    >= brickTop
        && ballTop        <= brickBottom
        && ballRight      >= brickLeft
        && ballLeft       <= brickRight
        && ballLastContact!== $brick) {

        ballMovementY     = -ballMovementY;
        ballMovementX     = -ballMovementX;
        ballLastContact   = $brick;

        //remove that brick
        $brick.remove();
        bumpBrick.play();

        //add score to player
        player.score += 10;
        $(opponentClass + 'score span').text("000" + player.score).slice(-4);

        winner(playerClass,opponentClass);

        }
      })
    };

    if (ballTop < 145) {
      brickAreaIdentification('.player1', '.player2', player2);
    } else if (ballBottom > 425) {
      brickAreaIdentification('.player2', '.player1', player1);
    }

  };

  //===================================
  // MOVEMENTS
  //===================================

  var movePlayer = function ($playerPaddle, movement) {
    var playerPosition  = $playerPaddle.position();
    var playerLeft      = playerPosition.left;

    if (movement.left && playerLeft > playerLimitXMin) {
      // check gap so paddle doesn't go offscreen
      var gapMoveLeft = playerLeft - playerLimitXMin;

      if (gapMoveLeft < paddleMovement) {
        $playerPaddle.css({left: playerLeft - gapMoveLeft});
      } else {
        $playerPaddle.css({left: playerLeft - paddleMovement});
      }
    }

    if (movement.right && playerLeft < playerLimitXMax) {
      // check gap so paddle doesn't go offscreen
      var gapMoveRight = playerLimitXMax - playerLeft;

      if (gapMoveRight < paddleMovement) {
        $playerPaddle.css({left: playerLeft + gapMoveRight});
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
  //WINNER
  var winner = function(playerClass, opponentClass) {
    if($(playerClass).length === 0) {
      gameloopPause();
      $('#continue').hide();
      winnerName = opponentClass.substring(1).toUpperCase();
      $gameOverText.text(winnerName + ' wins!');
      $gameOver.show();

      $gameOver.on('click', function() {
        optionClick.play();
        startMenu();
      });
    }
  }

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
  var resumeGame = function() {
    $menu.hide();
    gameloopPlay();
  };

  //RESET
  var resetGame = function() {
    //reset score
    player1.score = 0;
    player2.score = 0;
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
        $gameOver.hide();
        $menu.toggle();

        $('#continue').off().on('click', function() {
          optionClick.play();
          resumeGame();
          });

        $('#quit').off().on('click', function() {
          startMenu();
          });

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

        case 39:
        player1.movement.right = true;
        break;

        case 90:
        player2.movement.left = true;
        break;

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

        case 39:
        player1.movement.right = false;
        break;

        case 90:
        player2.movement.left = false;
        break;

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

    $('#continue').show();

    amountOfBrick = 0;
    generateBricks('player1', 40, 180,'white',8,5);
    generateBricks('player2', 430, 960, 'white',8,5);

    $(document).off('click').one('click', gameloopPlay());

  };

  //START MENU
  var startMenu = function() {
    gamePlayBGM.loop().play();
    $gameOver.hide();
    $menu.hide();
    $startMenu.show();

    //Animation
    var animate = function pulse(){
        $('#play').delay(200).fadeOut('slow').delay(50).fadeIn('slow',pulse);
    }();

    $startMenu.off('click').on('click', function() {
      startGame();
      optionClick.play();
      $startMenu.hide();
    });
  };

  //RUN THE GAME
  startMenu();

});