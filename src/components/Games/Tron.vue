<template>
    <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toGame()" />
    <h1 class="view-heading">Tron</h1>
    <div class="Tron">
        <canvas id="gameTron"></canvas>
    </div>
</template>

<script>

class Troner {
    constructor() {
        this.headX = 100; this.headY = 300;
        this.tailX = 80; this.tailY = 300;
        this.knicks = []; this.speed = 3;
        this.speedX = this.speed; this.speedY = 0;
        console.log(this.speedX, this.speedY)
    }
    update(context) { // What to draw
        /* this.knicks.forEach((elemnt) => {

        }) */
        context.beginPath()
        context.moveTo(this.headX, this.headY)
        this.knicks.forEach((elem) => {
            context.lineTo(elem.x, elem.y)
            context.moveTo(elem.x, elem.y)
        })
        //context.lineTo(this.knicks[0].x, this.knicks[0].y); 
        //context.moveTo(this.knicks[0].x, this.knicks[0].y);
        context.lineTo(this.tailX, this.tailY)
        context.lineWidth = 5;
        context.stroke();
    }
    newPos(Area) {  // Where to move
        console.log(this.speedX, this.speedY)
        this.headX += this.speedX
        this.headY += this.speedY
        //console.log(this.knicks[0].x, this.knicks[0].y )
    }

}

import router from '../../router';

export default {
    mounted() {
        this.GameArea.start()
        //var canvas = document.getElementById("gamefieldTanker");
        window.addEventListener('keydown', this.move);
    },
    methods: {
        updateGame() {
            this.GameArea.clear()
            this.Tron.newPos(this.GameArea.canvas)
            this.Tron.update(this.GameArea.context)
        },
        move(event) {
            this.Tron.knicks = [{"x":this.Tron.headX, "y": this.Tron.headY}].concat(this.Tron.knicks)
            if (event.key == "w") {
                this.Tron.speedX = 0
                this.Tron.speedY = -(this.Tron.speed)
            }
            if (event.key == "a") {
                this.Tron.speedX = -(this.Tron.speed)
                this.Tron.speedY = 0
            }
            if (event.key == "s") {
                this.Tron.speedX = 0
                this.Tron.speedY = this.Tron.speed
            }
            if (event.key == "d") {
                this.Tron.speedX = this.Tron.speed
                this.Tron.speedY = 0
            }
        },
        toGame() {
            router.push("/Games")
        }
    },
    data() {
        var self = this;
        return {
            Tron: new Troner(),
            Enemy: new Troner(),
            GameArea: {
                canvas: null,
                context: null,
                start() {
                    this.canvas = document.getElementById("gameTron");
                    this.canvas.width = 1200;
                    this.canvas.height = 700;
                    this.context = this.canvas.getContext("2d");
                    this.interval = setInterval(() => self.updateGame(), 10) //5
                },
                clear() {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                }
            },
        }
    }

}
</script>

<style>
.Tron {
    display: flex;
    align-items: center;
    justify-content: center;
}

#gameTron {
    background-color: grey;
    margin-bottom: 2rem;
}
</style>