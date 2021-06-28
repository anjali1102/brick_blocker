import { detectCollision } from "./collisionDetection.js";

export default class Brick {
    constructor(game, position) {
        this.image = document.getElementById("imgBrick");
        this.game = game;
        this.position = position;
        this.width = 80;
        this.height = 24;

        this.markedForDeletion = false;
    }
    update() {
        if(detectCollision(this.game.ball, this)) {
            BRICK_HIT.play();
            this.game.ball.speed.y = -this.game.ball.speed.y;
            this.game.score += 10;
            this.markedForDeletion = true;
        }
    }
    draw(context) {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}