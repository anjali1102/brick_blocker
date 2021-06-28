import Paddle from '/modules/paddle.js';
import InputHandler from '/modules/input.js';
import Ball from '/modules/ball.js';
import { buildLevel, level1, level2, level3 } from './levels.js';

const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");
const gameStart = document.getElementById("gamestart");
let canvas = document.getElementById("gameScreen");

restart.addEventListener("click", function(){
    location.reload(); 
})

const GAMESTATE = {
    PAUSED:  0,
    RUNNING:  1,
    MENU:  2,
    GAMEWON:  3,  
    GAMEOVER:  4,
    NEWLEVEL:   5
}

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameState = GAMESTATE.MENU;
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);
        this.gameObjects = [];
        this.bricks = [];
        this.lives = 3;
        this.score = 0;
        this.levels = [level1, level2, level3];
        this.currentLevel = 0;
        new InputHandler(this.paddle, this);
    }
    start() {
        if(this.gameState !== GAMESTATE.MENU && this.gameState !== GAMESTATE.NEWLEVEL) return;
        this.bricks = buildLevel(this, this.levels[this.currentLevel]);
        this.ball.reset();
        this.gameObjects = [this.ball, this.paddle];
        this.gameState = GAMESTATE.RUNNING;
        gameStart.style.display = "none";
        canvas.style.border = "2px solid pink";
    }
        
    update(deltaTime) {

        if(this.gameState === GAMESTATE.PAUSED || this.gameState === GAMESTATE.MENU || this.gameState === GAMESTATE.GAMEOVER || this.gameState === GAMESTATE.GAMEWON)  return;

        if(this.lives === 0) {
            LOSE.play();
            this.gameState = GAMESTATE.GAMEOVER;
        }    

        if(this.bricks.length === 0) {
            this.currentLevel++;
            if(this.currentLevel === this.levels.length) {
                WIN.play();
                canvas.style.display = "none";
                wonText.style.display = "block";
                gameover.style.display = "block";
                youwon.style.display = "block";
                this.gameState = GAMESTATE.GAMEWON;
            } else {
                
                this.gameState = GAMESTATE.NEWLEVEL;
                this.start();
            }
        }

        [...this.gameObjects, ...this.bricks].forEach((object) => object.update(deltaTime));

        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }

    draw(context) {
        
        [...this.gameObjects, ...this.bricks].forEach((object) => object.draw(context));

        if(this.gameState === GAMESTATE.PAUSED) {
            context.rect(0, 0, this.gameWidth, this.gameHeight);
            context.fillStyle = "rgba(0,0,0,0.5)";
            context.fill();

            context.font = "30px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
        }

        if(this.gameState === GAMESTATE.MENU) {
            
            context.rect(0, 0, this.gameWidth, this.gameHeight);
            gameStart.style.display = "block";

            context.font = "40px Arial";
            context.fillStyle = "pink";
            context.textAlign = "center";
            context.fillText("Brick Breaker Instructions", this.gameWidth / 2, this.gameHeight / 4);
            context.font = "25px Arial";
            context.fillText("1. Press Space Bar to start the game.", this.gameWidth / 2, this.gameHeight / 2);
            context.fillText("2. Press Escape Button to Pause/Resume the game.", this.gameWidth / 2, this.gameHeight / 1.7);
            context.fillText("3. Press Left/Right Arrow Keys to move the paddle.", this.gameWidth / 2, this.gameHeight / 1.45);
            context.fillText("4. Player has total of 3 lives and there are 3 levels in the game.", this.gameWidth / 2, this.gameHeight / 1.28);
            }

        if(this.gameState === GAMESTATE.GAMEOVER) {
            context.rect(0, 0, this.gameWidth, this.gameHeight);
            context.font = "30px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            canvas.style.display = "none"
            gameover.style.display = "block";
            youlose.style.display = "block";
        }

        // SHOW SCORE
        this.showGameStats(context,this.score, 55, 25, SCORE_IMG, 5, 5);
        // SHOW LIVES
        this.showGameStats(context,this.lives, this.gameWidth - 15, 25, LIFE_IMG, this.gameWidth-55, 5); 
        // SHOW LEVEL
        this.showGameStats(context,this.currentLevel + 1, this.gameWidth/2 + 10, 25, LEVEL_IMG, this.gameWidth/2 - 30, 5);

    }

    togglePause() {
        if(this.gameState === GAMESTATE.PAUSED) {
            this.gameState = GAMESTATE.RUNNING;
        } else {
            this.gameState = GAMESTATE.PAUSED;
        }
    }

    showGameStats(context,text, textX, textY, img, imgX, imgY) {
        context.fillStyle = "#FFF";
        context.font = "25px Germania One";
        context.fillText(text, textX, textY);
        context.drawImage(img, imgX, imgY, 25, 25);
    }
}