import { Vector2, Box2 } from "three";
import MGShot from "./mgshot.js"
import { positionGeometry } from "three/examples/jsm/nodes/Nodes.js";

export default class Tank {
    constructor(inID, position, health, weaponCounter, mouse) {
        this.id = inID;
        this.spawnPosition = new Vector2(position.x, position.y);
        this.health = health; this.color = "black";
        this.gravitySpeed = 0; this.bounce = 0.1;
        this.scale = new Vector2(40, 20);
        this.position = position
        this.speed = new Vector2(0, 0)
        this.weaponCounter = weaponCounter;
        this.shootin = false; this.reloading = { canon: false, mg: false, sniper: false };
        this.ammo = { canon: 1, mg: 40, sniper: 1 };;
        this.mouse = mouse
        this.hitbox = new Box2(this.position.clone().sub(new Vector2(0, 10)), new Vector2(this.position.x + this.scale.x, this.position.y + this.scale.y))
        this.kills = 0; this.deaths = 0;
    }
    reload() {
        switch (this.weaponCounter % 3) {
            case 0:
                this.reloading.canon = true
                setTimeout(() => { this.ammo.canon = 1; this.reloading.canon = false }, 700)
                break
            case 1:
                this.reloading.mg = true
                this.shootin = false
                setTimeout(() => { this.ammo.mg = 40; this.reloading.mg = false; new Audio('/sounds/tanker/magazine_ready.wav').play(); }, 1500)
                break
            case 2:
                this.reloading.sniper = true
                setTimeout(() => { this.ammo.sniper = 1; this.reloading.sniper = false }, 2000)
                break
        }
    }
    allRound(Area) {
        this.update(Area.context)
        this.newPos(Area)
        this.checkCollision(Area)
    }
    update(context) {
        let MouseVec = new Vector2(this.mouse.x - (this.position.x + this.scale.x / 2), this.mouse.y - this.position.y).normalize()
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.scale.x, this.scale.y);
        context.fillRect(this.position.x + 10, this.position.y - 10, this.scale.x / 2, this.scale.y / 2);
        context.beginPath()
        const tipOfRohr = new Vector2((this.position.x + this.scale.x / 2) + 35 * MouseVec.x, this.position.y + 35 * MouseVec.y)
        context.moveTo(this.position.x + this.scale.x / 2, this.position.y)
        context.lineTo(tipOfRohr.x, tipOfRohr.y)
        context.lineWidth = 5;
        context.strokeStyle = this.color
        context.stroke()
        context.font = "10px arial"
        if (this.health >= 66) {
            context.fillStyle = "grey"
        } else if (this.health >= 33) { context.fillStyle = '#DAA520' }
        else {
            context.fillStyle = "red"
        }
        context.fillText(this.health.toString(), this.position.x + this.scale.x / 4, this.position.y) //health shower
        switch (this.weaponCounter % 3) {
            case 0:
                context.beginPath()
                context.lineWidth = 7;
                context.moveTo(tipOfRohr.x, tipOfRohr.y)
                const startOfRohr = new Vector2(this.position.x + this.scale.x / 2, this.position.y)
                const bisslBackAmRohr = startOfRohr.clone().sub(tipOfRohr)
                const endOfLine = tipOfRohr.clone().add(bisslBackAmRohr.clone().divideScalar(3))
                context.lineTo(endOfLine.x, endOfLine.y)
                context.stroke()
                break

            case 2:
                if (this.reloading.sniper == false) {
                    context.beginPath()
                    context.strokeStyle = "red"
                    context.lineWidth = 1;
                    context.moveTo(tipOfRohr.x + MouseVec.x * 10, tipOfRohr.y + MouseVec.y * 10)
                    context.lineTo(tipOfRohr.x + MouseVec.x * 1500, tipOfRohr.y + MouseVec.y * 1500)
                    context.stroke()
                }
                break
        }
    }
    newPos(Area) {
        this.gravitySpeed += Area.gravity;
        this.position.x += this.speed.x;
        this.speed.multiplyScalar(0.98)
        this.position.y += this.speed.y + this.gravitySpeed
        if (this.position.y > (Area.canvas.height - this.scale.y)) {
            this.position.y = Area.canvas.height - this.scale.y
            this.gravitySpeed = -(this.gravitySpeed * this.bounce)
            this.speed.x *= 0.95
        }
        if (this.position.x > (Area.canvas.width - this.scale.x) || this.position.x < 0) {
            this.speed.x = -(this.speed.x)
        }
        this.hitbox = new Box2(this.position.clone().sub(new Vector2(0, 10)), new Vector2(this.position.x + this.scale.x, this.position.y + this.scale.y))
    }
    checkCollision(Area) {
        Area.TerrainArray.forEach(thing => {
            if (this.hitbox.intersectsBox(thing.hitbox)) {
                {
                    // Beispiel für eine einfache Anpassung der Position und Geschwindigkeit bei Kollision
                    // Diese Logik kann an die spezifischen Anforderungen deines Spiels angepasst werden

                    // Berechne die Überlappung in beiden Achsen
                    const overlapX = Math.min(this.hitbox.max.x - thing.hitbox.min.x, thing.hitbox.max.x - this.hitbox.min.x);
                    const overlapY = Math.min(this.hitbox.max.y - thing.hitbox.min.y, thing.hitbox.max.y - this.hitbox.min.y + 10);
                    let collision = false;

                    // Bevorzugen der kleineren Überlappung zur Anpassung
                    if (overlapX < overlapY && !collision) {
                        collision = true
                        // Kollision entlang der X-Achse
                        if (this.hitbox.max.x > thing.hitbox.min.x && this.hitbox.min.x < thing.hitbox.min.x) {
                            this.position.x = thing.hitbox.min.x - this.scale.x;
                        } else if (this.hitbox.min.x < thing.hitbox.max.x && this.hitbox.max.x > thing.hitbox.max.x) {
                            this.position.x = thing.hitbox.max.x;
                        }
                        this.speed.x = -(this.speed.x * this.bounce);
                    } else if (overlapX > overlapY && !collision) {
                        // Kollision entlang der Y-Achse
                        if (this.hitbox.max.y > thing.hitbox.min.y && this.hitbox.min.y + 10 < thing.hitbox.min.y) {
                            this.position.y = thing.hitbox.min.y - this.scale.y;
                            this.speed.x *= thing.friction

                        } else if (this.hitbox.min.y + 10 < thing.hitbox.max.y && this.hitbox.max.y > thing.hitbox.max.y) {
                            this.position.y = thing.hitbox.max.y + 10;
                        }
                        this.gravitySpeed = 0;
                        this.speed.y = -(this.speed.y * this.bounce);
                    }
                }
                return
            }

        });
    }
    checkDeath() {
        if (this.health < 1) {
            this.position.copy(this.spawnPosition)
            this.health = 100;
            this.deaths += 1
            return true
        }
        return false
    }
    moveTank(event) {
        if (event.key == "w" || event.key == " ") this.speed.y = -8; this.gravitySpeed = 0
        if (event.key == "a") this.speed.x = -10
        if (event.key == "s") this.speed.y = 10
        if (event.key == "d") this.speed.x = 10
        if (event.key == "q") this.weaponCounter += 1
        if (event.key == "1") this.weaponCounter = 0 // Canon
        if (event.key == "2") this.weaponCounter = 1 // MG
        if (event.key == "3") this.weaponCounter = 2 // Sniper
        if (event.key == "r") this.reload()
    }
}