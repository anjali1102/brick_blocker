let canvas = document.getElementById("gameScreen");

export default class InputHandler {
    constructor(paddle, game) {
        document.addEventListener('keydown', (event) => {
            // alert(event.keyCode);
            switch(event.keyCode) {
                case 37:    
                    // alert("Move Left");
                    paddle.moveLeft();
                    break;
                case 39:
                    // alert("Move Right");
                    paddle.moveRight();
                    break;
                case 27:
                    game.togglePause();
                    break;
                case 32:
                    // canvas.style.display = "visible";
                    game.start();
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            // alert(event.keyCode);
            switch(event.keyCode) {
                case 37:    
                    // alert("Move Left");
                    if(paddle.speed < 0)    paddle.stop();
                    break;
                case 39:
                    // alert("Move Right");
                    if(paddle.speed > 0)    paddle.stop();
                    break;
            }
        });
    }
}