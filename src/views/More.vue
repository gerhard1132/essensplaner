<template>
    <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toHome()"/>
    <h1 class="view-heading">More</h1>
    <div class="container-center hide">
        <div class="games-box">
            <p class="games-box-heading" @click="toEssensplan()">Essensplan</p>
        </div>
        <div class="games-box" @click="toSchachuhr()">
            <p class="games-box-heading">Schachuhr</p>
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
        toSchachuhr() {
            router.push("/More/Schachuhr")
        },
        toEssensplan() {
            router.push("More/Essensplan")
        }
    }
}
</script>