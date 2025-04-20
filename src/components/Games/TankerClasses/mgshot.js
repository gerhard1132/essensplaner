import { Box2 } from "three";
import { Vector2 } from "three";

export default class MGShot {
    constructor(inTank, position, width, visibility) {
        this.initiator = inTank;
        this.initiatorID = inTank.id;
        this.color = "yellow";
        this.position = position; //new Vector2(inTank.position.x + inTank.scale.x / 2, inTank.position.y)
        this.shootDirection = new Vector2(inTank.mouse.x - (this.position.x), inTank.mouse.y - (this.position.y)).normalize()
        this.speed = this.shootDirection.clone().multiplyScalar(35)
        this.visible = visibility;
        this.bulletSize = width;
    }
    allRound(Area) {
        this.update(Area.context)
        this.newPos(Area)
        this.checkHit(Area)
        this.checkCollision(Area)
        return this.visible
    }
    update(context) {
        if (this.visible == true) {
            context.fillStyle = this.color;
            context.beginPath();
            context.moveTo(this.position.x, this.position.y)
            context.lineTo(this.position.x - this.speed.x * .5, this.position.y - this.speed.y * .5)
            context.lineWidth = this.bulletSize;
            context.strokeStyle = this.color
            context.stroke();
            context.fill()
        }
    }
    newPos(Area) {
        if (this.visible == true) {
            this.position.add(this.speed)
            if (this.position.y > Area.canvas.height || this.position.x > Area.canvas.width || this.position.x < 0) {
                this.visible = false
            }
        } else {
            this.position.x = null; this.position.y = null; this.speed.x = null; this.speed.y = null
        }
    }
    checkHit(Area) {
        Area.player.forEach(tank => {
            if (tank.hitbox.containsPoint(this.position) || tank.hitbox.containsPoint(this.position.clone().sub(this.speed.clone().divideScalar(2))) || tank.hitbox.containsPoint(this.position.clone().sub(this.speed))) {
                if (tank.id !== this.initiatorID && this.visible) {
                    this.bulletSize == 2 ? tank.health -= 7 : tank.health -= 49
                    if (tank.checkDeath()) { this.initiator.kills += 1 }
                    this.visible = false
                }
            }
        });
    }
    checkCollision(Area) {
        Area.TerrainArray.forEach(thing => {
            if (thing.hitbox.containsPoint(this.position) || thing.hitbox.containsPoint(this.position.clone().sub(this.speed.clone().divideScalar(2))) || thing.hitbox.containsPoint(this.position.clone().sub(this.speed))) {
                this.visible = false
            }
        })
    }
}