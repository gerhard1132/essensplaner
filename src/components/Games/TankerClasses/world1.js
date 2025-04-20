import Terrain from "./terrain.js"
import { Vector2 } from "three"

/*
Height: 600
Width: 1200
 */

let terrainList = [
    new Terrain(new Vector2(500, 520), new Vector2(200, 80), "black"),      //Middle thing
    new Terrain(new Vector2(0, 440), new Vector2(200, 50), "black"),        //Linkes 1. Plattform
    new Terrain(new Vector2(1000, 440), new Vector2(200, 50), "black"),     //Rechtes 1. Plattform
    new Terrain(new Vector2(350, 200), new Vector2(500, 50), "black")
]

export default terrainList