import { detectCollision } from "./collisionDetection.js";

export default class Ball {
    constructor(game) {
        this.image = document.getElementById("imgBall");
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.game = game;
        this.size = 16;
        this.reset();
    }
    reset() {
        this.position = {
            x:  10,
            y:  400
        };
        this.speed = {
            x:  4,
            y:  -4
        };
    }
    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
    }
    update(deltaTime) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        // When Ball hits Left Wall or Right Wall
        if(this.position.x + this.size > this.gameWidth || this.position.x < 0) {
            WALL_HIT.play();
            this.speed.x = -this.speed.x;
        }
        // When Ball hits Top Wall
        if(this.position.y < 0) {
            WALL_HIT.play();
            this.speed.y = -this.speed.y;
        }
        // When Ball hits Bottom
        if(this.position.y + this.size > this.gameHeight) {
            LIFE_LOST.play();
            this.game.lives--;
            this.reset();
        }

        if(detectCollision(this, this.game.paddle)) {
            PADDLE_HIT.play()
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}