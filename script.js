/*
Q1: why when take out position1 or 2 outside function, it doesn't work

TO DO LIST (BY ORDER)
Generate SECOND Bricks
Game States
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
  var $player1Text         = $('.player1score span')
  var player1score        = $player1Text.val();
  var p1score             = Number(player1score);
  var $player2Text         = $('.player1score span')
  var player2score        = $player2Text.val();
  var p2score             = Number(player1score);


  //ball
  var $ball               = $('#ball');
  var ballSize            = 15;
  var ballMovementX       = 5;
  var ballMovementY       = 3;
  var defaultBallMovement = 5;
  var ballLimitXMin       = gamescreenOrigin;
  var ballLimitXMax       = gamescreenWidth - ballSize;
  var ballLimitYMin       = gamescreenOrigin;
  var ballLimitYMax       = gamescreenHeight - ballSize;
  var ballLastContact     = '';
  var accelX              = 2;
  var accelY              = 4;

  //bricks
  var brick               = $('.brick');
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

  var generateBricks = function (player, brickTop, brickColor, bricksColumn, bricksRow) {
    var fullWidth         = 400;
    var fullHeight        = brickTop + 120;

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

    detectCollision();

  }

  //===================================
  // COLLISION DETECTION
  //===================================
  var detectCollision = function () {

    //BOUNDARY COLLISION
    var positionBall  = $ball.position();
    var ballTop       = positionBall.top;
    var ballBottom    = ballTop + ballSize;
    var ballLeft      = positionBall.left;
    var ballRight     = ballLeft + ballSize;

    // // Left Gap
    // if (ballLeft > ballLimitXMin) {
    //   var gap = ballLeft - ballLimitXMin;

    //   if (gap < Math.abs(ballMovementX)) {
    //     ballMovementX = -gap;
    //   } else {
    //     ballMovementX = -ballMovementX;
    //   }
    // }

    // // Right Gap
    // if (ballLeft > ballLimitXMax) {
    //   var gap = ballLimitXMax - ballLeft;

    //   if (gap < Math.abs(ballMovementX)) {
    //     ballMovementX = gap;
    //   } else {
    //     ballMovementX = ballMovementX;
    //   }
    // }

    // // Top Gap
    // if (ballTop > ballLimitYMin) {
    //   var gap = ballTop - ballLimitYMin;

    //   if (gap < Math.abs(ballMovementY)) {
    //     ballMovementY = -gap;
    //   } else {
    //     ballMovementY = -ballMovementY;
    //   }
    // }

    // // Bot Gap
    // if (ballTop > ballLimitYMax) {
    //   var gap = ballLimitYMax - ballTop;

    //   if (gap < Math.abs(ballMovementY)) {
    //     ballMovementY = gap;
    //   } else {
    //     ballMovementY = ballMovementY;
    //   }
    // }

    // we record ballLastContact = '$player1paddle' so the ball doesn't stuck on paddle.
    // we record ballLastContact = '$gamescreen'; so the ball doesn't go through the paddle.
    if (ballLeft <= ballLimitXMin || ballLeft >= ballLimitXMax) {
      ballMovementX = -ballMovementX;
      ballLastContact     = '$gamescreen';
    }

    if (ballTop <= ballLimitYMin || ballTop >= ballLimitYMax) {
      ballMovementY = -ballMovementY;
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
      ballMovementX       = -ballMovementX;
      ballLastContact     = '$player1paddle'
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
      ballMovementX       = -ballMovementX;
      ballLastContact     = '$player2paddle'
    }


    //BRICK COLLISION

    //$('.brick.player1[data-class=33]');

    brick.each(function() {
      var brickPosition = brick.position();
      var brickTop      = brickPosition.top;
      var brickLeft     = brickPosition.left;
      var brickBottom   = brick2position.top + brickHeight; //take Height value from generateBricks?
      var brickRight    = brick2position.left + brickWidth; //take Width value from generateBricks?

      if (ballBottom >= brickTop
         && balTop <= brickBottom
         && ballRight >= brickLeft
         && ballLeft <= brickRight
        ) {

          ballMovementY = -ballMovementY;
          ballMovementX = -ballMovementX;

          //remove player brick
          brick.remove();

          //add score to player
          if (brick.class = "player1") {
            p2score +=10;
            console.log(p1score);

            $('.player1score span').text("0000" + p1score).slice(-4);
          } else if (brick.class = "player2") {
            p1score +=10;
            console.log(p1score);

            $('.player1score span').text("0000" + p1score).slice(-4);
        }
      }
    });

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
  //WINNER
  //if playerXBricksArea is empty, playerY wins and go to game over
  var winner = function() {
    var maxP1Bricks = $('.brick.player1').length;
    var maxP2Bricks = $('.brick.player2').length;

    if (maxP1Bricks === 0) {

    } else if (maxP2Bricks === 0) {

    }

  };

  //RESUME
  var resumeGame = function() {
    $menu.hide();
  };

  //RESET
  var resetGame = function() {
    //reset score
    $player1Text.text('00000');
    $player2Text.text('00000');

    //reset brick

    //reset ball position

    //reset paddle position

  };

  //MENU
  var bindInGameMenu = function () {
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
    bindInGameMenu();
    bindMovementKeys();
    generateBricks('player1', 40,'blue',8,5);

    generateBricks('player2', 300,'yellow',8,5);

    gameloop = setInterval(function(){
      moveBall();
      movePlayer($player1paddle, movement1);
      movePlayer($player2paddle, movement2);
    }, 17);
  };

  //START MENU
  var startMenu = function() {
    $menu.hide();
    $startMenu.show();
    $startMenu.on('click', function() {
      startGame(); //make only one start game run?
      $startMenu.hide();
    });
  };

  //RUN THE GAME
  startMenu();

});