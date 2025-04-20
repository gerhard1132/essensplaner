import { Box2, Vector2 } from "three";

export default class CanonClass {
    constructor(position) {
        this.gravitySpeed = 0; this.gravity = 1.3; this.bounce = 0
        this.color = "black";
        this.scale = 5
        this.position = position;
        this.speed = new Vector2(0, 0);
        this.lastLocation = new Vector2(null, null);
        this.hitbox = new Box2(new Vector2(this.position.x, this.position.y), new Vector2(this.position.x + 5, this.position.y + 5))
        this.visible = true
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
            context.arc(this.position.x, this.position.y, this.scale, 0, 2 * Math.PI);
            context.lineWidth = 1;
            context.strokeStyle = this.color
            context.stroke();
            context.fill()
        }
    }

    newPos(Area) {
        if (this.visible == true) {
            this.gravitySpeed += this.gravity;
            this.position.x += this.speed.x;
            this.speed.y *= 0.98;
            this.speed.x *= 0.99;
            this.position.y += this.speed.y + this.gravitySpeed;

            if (this.position.y > Area.canvas.height - this.scale) {
                this.position.y = Area.canvas.height - this.scale;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
                this.speed.x *= 0.70;
            }
            if (this.position.x > Area.canvas.width - this.scale || this.position.x < 0) {
                this.speed.x = -this.speed.x;
            }
            if (this.position.x.toFixed(3) == this.lastLocation.x && this.position.y.toFixed(3) == this.lastLocation.y) this.visible = false
            this.lastLocation.x = this.position.x.toFixed(3)
            this.lastLocation.y = this.position.y.toFixed(3)
            this.hitbox = new Box2(new Vector2(this.position.x, this.position.y), new Vector2(this.position.x + 5, this.position.y + 5))
        }
    }
    checkHit(Area) {
        Area.player.forEach(tank => {
            if (tank.hitbox.intersectsBox(this.hitbox)) {
                if (tank.id !== this.initiatorID && this.visible) {
                    tank.health -= 24;
                    tank.checkDeath()
                    this.visible = false;
                }

            }
        });
    }
    checkCollision(Area) {
        Area.TerrainArray.forEach(thing => {
            if (this.hitbox.intersectsBox(thing.hitbox)) {
                {
                    this.visible = false
                    /* // Berechne die Überlappung in beiden Achsen
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
                    } */
                }
                return
            }
        });
    }
}