<template>
    <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toGame()" />
    <div class="Tanker">
        <h1 class="view-heading" style="user-select: none;">Tanker</h1>
        <canvas id="gamefieldTanker" @keypress="move()"></canvas>
        <canvas id="legendTanker"></canvas>
    </div>
</template>

<script>
import router from '../../router';
import { Vector2 } from 'three';

import Tank from './TankerClasses/tank.js'
import CanonClass from './TankerClasses/canon.js';
import MGShot from './TankerClasses/mgshot.js';
import terrainList from './TankerClasses/world1.js';

const socket = new WebSocket('wss://nichtroman.de:3000')

export default {
    //Event listeners
    mounted() {
        this.startGame();
        let canvas = document.getElementById("gamefieldTanker");
        window.addEventListener('keydown', this.move);
        canvas.addEventListener('mousedown', this.click);
        canvas.addEventListener('mousemove', this.updateMouse)
        window.addEventListener('mouseup', this.shootInvert)


        socket.addEventListener('open', (event) => {
            console.log('Verbindung hergestellt');
            this.Tank = new Tank(1, new Vector2(100, 165), 100, 0, new Vector2(null, null));
            //this.Enemy = new Tank(2, new Vector2(1060, 165), 100, 0, new Vector2(null, null));
        });

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            switch (data.type) {
                case "idSend":
                    console.log(data.content)
                    break
                case "game":
                    const Tanker = data.content.Tank
                    this.Enemy = new Tank(Tanker.id, new Vector2(Tanker.position.x, Tanker.position.y), Tanker.health, Tanker.weaponCounter, new Vector2(Tanker.mouse.x, Tanker.mouse.y))
                    this.EnemySnipes = data.content.Snipes.map(snipe => new MGShot(this.Enemy, new Vector2(snipe.position.x, snipe.position.y), snipe.bulletSize, true));
                    this.EnemyBalls = data.content.Balls.map(ball => new CanonClass(new Vector2(ball.position.x, ball.position.y)))
                    break
                default:
                    console.log("Error with WS response! No type")
            }
        });

        socket.addEventListener('close', (event) => {
            console.log('Verbindung geschlossen');
        });
    },
    //All local methods
    methods: {
        startGame() {
            this.GameArea.start()
            this.legend.start()
            requestAnimationFrame(this.updateGame)
        },
        shootInvert() {
            this.Tank.shootin = false
        },
        updateGame() {
            this.GameArea.clear()
            this.legend.clear()

            this.legend.showText(this.Tank)



            for (const snipe of this.Snipes) {
                if (!snipe.allRound(this.GameArea)) {
                    this.Snipes = this.Snipes.filter(s => s !== snipe);
                }
            }

            for (const snipe of this.EnemySnipes) {
                snipe.update(this.GameArea.context)
            }

            for (const ball of this.Balls) {
                if (!ball.allRound(this.GameArea)) {
                    this.Balls = this.Balls.filter(b => b !== ball);
                }
            }

            for (const ball of this.EnemyBalls) {
                ball.update(this.GameArea.context)
            }

            this.Tank.allRound(this.GameArea)
            this.Enemy.update(this.GameArea.context)

            for (const thing of this.GameArea.TerrainArray) {
                thing.allRound(this.GameArea)
            }


            let data = {
                "Tank": { ...this.Tank },
                "Snipes": this.Snipes,
                "Balls": this.Balls
            }
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(data))
            }

            requestAnimationFrame(this.updateGame);
        },
        move(event) {
            this.Tank.moveTank(event)
        },
        click(event) {
            switch (this.Tank.weaponCounter % 3) {
                //Canonballs
                case 0:
                    if (this.Tank.ammo.canon > 0 && this.Tank.reloading.canon == false && this.Tank.weaponCounter % 3 == 0) {
                        new Audio('/sounds/tanker/canonball.wav').play();
                        this.Tank.ammo.canon -= 1
                        const shot = new CanonClass(new Vector2(this.Tank.position.x + this.Tank.scale.x / 2, this.Tank.position.y))
                        //Get click position relative to canvas
                        let rect = event.target.getBoundingClientRect()
                        let shootDirection = new Vector2(event.clientX - rect.left - (shot.position.x + shot.scale / 2), event.clientY - rect.top - (shot.position.y + shot.scale / 2)).normalize()
                        this.Tank.speed.add(shootDirection.clone().multiplyScalar(-2)) //Rückstoß

                        //GiveSpeedToShot
                        shot.speed.copy(shootDirection.clone().multiplyScalar(45))
                        this.Balls.push(shot)
                        if (this.Tank.ammo.canon == 0) { this.Tank.reload() }
                        break
                    }
                    if (this.Tank.ammo.canon == 0 && this.Tank.reloading.canon == false && this.Tank.weaponCounter % 3 == 0) this.Tank.reload()
                //MgShots
                case 1:
                    this.Tank.shootin = true
                    let spreadCount = 0;
                    if (this.Tank.shootin && this.Tank.ammo.mg > 0 && this.Tank.reloading.mg == false && this.Tank.weaponCounter % 3 == 1) {
                        new Audio('/sounds/tanker/mg_shot.wav').play();
                        this.Tank.ammo.mg -= 1
                        const mgshot = new MGShot(this.Tank, new Vector2(this.Tank.position.x + this.Tank.scale.x / 2, this.Tank.position.y), 2, false)
                        let randVec = new Vector2((Math.random() - 0.5) * spreadCount / 100, (Math.random() - 0.5) * spreadCount / 100)
                        mgshot.shootDirection.add(randVec).normalize()//Spread
                        mgshot.speed = mgshot.shootDirection.clone().multiplyScalar(35)
                        spreadCount += 1;
                        mgshot.visible = true
                        this.Tank.speed.add(mgshot.shootDirection.clone().multiplyScalar(-0.3)) //Rückstoß
                        this.Snipes.push(mgshot)
                    }
                    let shooter = setInterval(() => {
                        if (this.Tank.shootin && this.Tank.ammo.mg > 0 && this.Tank.reloading.mg == false && this.Tank.weaponCounter % 3 == 1) {
                            new Audio('/sounds/tanker/mg_shot.wav').play();
                            this.Tank.ammo.mg -= 1
                            const mgshot = new MGShot(this.Tank, new Vector2(this.Tank.position.x + this.Tank.scale.x / 2, this.Tank.position.y), 2, false)
                            let randVec = new Vector2((Math.random() - 0.5) * spreadCount / 100, (Math.random() - 0.5) * spreadCount / 100)
                            mgshot.shootDirection.add(randVec).normalize()//Spread
                            mgshot.speed = mgshot.shootDirection.clone().multiplyScalar(35)
                            spreadCount += 1;
                            this.Tank.speed.add(mgshot.shootDirection.clone().multiplyScalar(-0.3)) //Rückstoß
                            mgshot.visible = true
                            this.Snipes.push(mgshot)
                            if (this.Tank.ammo.mg == 0) { new Audio('/sounds/tanker/mg_empty.wav').play(); this.Tank.reload() }
                        } else {
                            clearInterval(shooter)
                        }
                    }, 100)
                    if (this.Tank.ammo.mg == 0 && this.Tank.reloading.mg == false) this.Tank.reload()
                    break
                case 2:
                    if (this.Tank.ammo.sniper > 0 && this.Tank.reloading.sniper == false && this.Tank.weaponCounter % 3 == 2) {
                        new Audio('/sounds/tanker/sniper_shot.wav').play();
                        this.Tank.ammo.sniper -= 1
                        const mgshot = new MGShot(this.Tank, new Vector2(this.Tank.position.x + this.Tank.scale.x / 2, this.Tank.position.y), 5, false)
                        mgshot.speed = mgshot.shootDirection.clone().multiplyScalar(65)
                        mgshot.visible = true
                        this.Tank.speed.add(mgshot.shootDirection.clone().multiplyScalar(-20)) //Rückstoß
                        this.Snipes.push(mgshot)
                        if (this.Tank.ammo.sniper == 0) { this.Tank.reload() }
                    }
                    if (this.Tank.ammo.sniper <= 0 && this.Tank.reloading.sniper == false && this.Tank.weaponCounter % 3 == 2) this.Tank.reload()
                    break
            }

        },
        updateMouse(event) {
            let rect = event.target.getBoundingClientRect()
            this.Tank.mouse = new Vector2(event.clientX - rect.left, event.clientY - rect.top)
        },
        endUpdate() {
            clearInterval(this.GameArea.interval)
            window.removeEventListener('keypress', this.onKeyDown);
        },
        toGame() {
            router.push("/Games")
            socket.close()
        }
    },
    data() {
        const ownTank = new Tank(1, new Vector2(100, 165), 100, 0, new Vector2(null, null));
        const otherTank = new Tank(2, new Vector2(1060, 165), 100, 0, new Vector2(null, null));
        return {
            Tank: ownTank,
            Balls: [],
            Snipes: [],

            Enemy: otherTank,
            EnemyBalls: [],
            EnemySnipes: [],

            GameArea: {
                canvas: null,
                context: null,
                player: [ownTank, otherTank],
                TerrainArray: terrainList,
                context_leg: null,
                interval: null,
                gravity: 0.8,
                start() {
                    this.canvas = document.getElementById("gamefieldTanker");
                    this.canvas.width = 1200;
                    this.canvas.height = 600;
                    this.context = this.canvas.getContext("2d");
                    //this.interval = setInterval(() => self.updateGame(), 5) //5
                    //self.updateGame()
                },
                clear() {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                }
            },
            legend: {
                canvas: null,
                context: null,
                start() {
                    this.canvas = document.getElementById("legendTanker")
                    this.canvas.width = 1200;
                    this.canvas.height = 30;
                    this.context = this.canvas.getContext('2d')
                },
                showText(Tanker) {
                    this.context.font = "20px arial"
                    switch (Tanker.weaponCounter % 3) {
                        case 0:
                            this.context.fillText("Weapon: Canon", 10, 22)
                            break
                        case 1:
                            this.context.fillText("Weapon: MG", 10, 22)
                            for (let i = 0; i < Tanker.ammo.mg; i++) {
                                this.context.fillText("I ", i * 5 + 150, 22)
                            }
                            break
                        case 2:
                            this.context.fillText("Weapon: Sniper", 10, 22)
                            break
                    }
                },
                clear() {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                }
            }
        }
    }
}
</script>

<style>
.Tanker {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
}

#gamefieldTanker {
    background: linear-gradient(0.5turn, rgb(177, 200, 235), rgb(107, 106, 180));
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
}

#gamefieldTanker:hover {
    cursor: crosshair;
}

#legendTanker {
    background-color: rgb(88, 88, 88);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
</style>
