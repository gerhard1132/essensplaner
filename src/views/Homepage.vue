<template>
    <h1 class="home-heading"> Welcome to <span class="fancy" id="type-text"></span></h1>
    <div class="container-center" style="text-align:center">
        <button class="homebutton" @click="toProjects()">Projects</button>
        <button class="homebutton" @click="toGames()">Games</button>
        <button class="homebutton" @click="toMore()">More</button>
    </div>
</template>

<script>
import router from '../router';

export default {
    mounted() {
        this.typeText("Nothing...", document.getElementById('type-text'), 100)
    },
    methods: {
        toProjects() {
            router.push("/Projects")
        },
        toGames() {
            router.push("/Games")
        },
        toMore() {
            router.push("/More")
        },
        typeText(text, element, speed) {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, speed);

        }
    }
}
</script>

<style>
.body {
    display: flex;
}

.home-heading {
    margin-top: 9rem;
    margin-bottom: 10rem;
    text-align: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 6vh;
}

.fancy {
    font-family: "Playfair Display", serif;
    font-style: italic;
    font-size: larger;
    cursor: pointer;
}

.homebutton {
    min-width: 200px;
    max-height: 80px;
    padding: 2rem;
    border-radius: 20px;
    margin-bottom: 4rem;
    margin-left: 1rem;
    margin-right: 1rem;
    background-color: grey;
    font-family: 'IBM Plex Mono', monospace;
    color: white;
    font-size: 2.3vh;
}

.homebutton:hover {
    background-color: white;
    cursor: pointer;
    transition: .5s;
    color: black;
}
</style>