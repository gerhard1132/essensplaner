<template>
    <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toHome()"/>
    <h1 class="view-heading">Games</h1>
    <div class="container-center hide">
        <div class="games-box" @click="toSuperTTT()">
            <p class="games-box-heading">Super Tic-Tac-Toe</p>
        </div>
        <div class="games-box" @click="toTanker()">
            <p class="games-box-heading">Tanker</p>
        </div>
        <div class="games-box">
            <p class="games-box-heading" @click="toTron()">TRON</p>
        </div>
        <div class="games-box">
            <p class="games-box-heading">4-Gewinnt</p>
        </div>
    </div>
</template>

<script>
import router from '../router';

export default {
    methods: {
        toHome() {
            router.push("/")
        },
        toSuperTTT() {
            router.push("/Games/SuperTicTacToe")
        },
        toTanker(){
            router.push("/Games/Tanker")
        },
        toTron() {
            router.push("/Games/Tron")
        }
    }
}
</script>

