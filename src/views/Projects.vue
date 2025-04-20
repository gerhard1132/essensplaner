<template>
    <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toHome()" />
    <h1 class="view-heading">Projects</h1>
    <div class="container-left">
        <h2>Info</h2>
        <p style="margin-bottom:40px;">
            Auflistung aller Miniprojekte sowie deren Reihenfolge
        </p>
        <br>
        <h2>1. Schachuhr</h2>
        <p>Eine einfache Kopie von der Schachuhr-App von Chess.com. </p>
        <p>Einzige Erweiterung ist eine Warnung kurz vor dem Ablauf der Zeit</p>
        <br>
        <h2>2. Super TicTacToe</h2>
        <p>SuperTicTacToe ist eine erweiterte Version von Tic-Tac-Toe mit einem 3x3-Raster aus kleinen Tic-Tac-Toe-Gittern,
            die ein großes Gitter bilden. Spieler setzen abwechselnd ihre Symbole und gewinnen nicht nur in kleinen Gittern,
            sondern auch im großen Gitter. Die Position des gesetzten Symbols bestimmt, in welchem kleinen Gitter der Gegner
            als Nächstes setzen muss. Das Spiel erfordert strategisches Denken auf mehreren Ebenen, da Züge in kleinen
            Gittern Auswirkungen auf das große Gitter haben. </p>
        <p>Ziel ist es, nicht nur in den kleinen Gittern zu gewinnen, sondern auch das große Gitter zu dominieren.</p>
        <h2>3. Tanker-Game</h2>
        <p>Eine weitere Kopie eines Minigames von Spielewebseiten wie Spieleaffe.de oder cooleSpiele.de</p>
        <br>
        <h2>Idee: Tron</h2>
        <br>
        <h2>Idee: Essensplan</h2>
        <br>
        <h2>Idee: 4-Gewinnt</h2>
        <br>
        <h2>Idee: Study-Timer</h2>
        
    </div>
</template>

<script>
import router from '../router';

export default {
    methods: {
        toHome() {
            router.push("/")
        }
    }
}
</script>

<style></style>
