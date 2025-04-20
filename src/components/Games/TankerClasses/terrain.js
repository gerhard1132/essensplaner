import { Vector2, Box2 } from "three";

export default class Terrain {
    constructor(position, scale, color="grey") {
        this.position = new Vector2(position.x, position.y)
        this.scale = new Vector2(scale.x, scale.y)
        this.hitbox = new Box2(this.position, this.position.clone().add(this.scale))
        this.visible = true
        this.friction = 0.8
        this.color = color
    }
    allRound(Area) {
        Area.context.fillStyle = this.color;
        Area.context.fillRect(this.position.x, this.position.y, this.scale.x, this.scale.y);
    }
}