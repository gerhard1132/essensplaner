<template>
    <div class="container">
        <!-- <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toMore()"  /> GOES INTO OPTIONS -->
        <div v-if="Time1Sec > 9" class="Timer1" @click="Player1Field()" :style="{ backgroundColor: ColorField1 }">
            {{
                Time1Min
            }}:{{ Time1Sec }}</div>
        <div v-if="Time1Sec < 10" class="field1 Timer1" @click="Player1Field()" :style="{ backgroundColor: ColorField1 }">{{
            Time1Min
        }}:0{{ Time1Sec }}</div>
        <div class="Mitte">
            <q-icon id="settings" name="settings" size="3rem" @click="openSettings = true" />
            <q-icon id="pause" v-if="paused == false" name="pause" size="3rem" @click="stopAll()" />
            <q-icon id="play" v-if="paused == true" name="play_arrow" size="3rem" @click="startLast()" />
            <q-icon id="reset" name="refresh" size="3rem" @click="reset()" />
        </div>
        <div v-if="Time2Sec > 9" class="Timer2" @click="Player2Field()" :style="{ backgroundColor: ColorField2 }">{{
            Time2Min
        }}:{{ Time2Sec }}</div>
        <div v-if="Time2Sec < 10" class="Timer2" @click="Player2Field()" :style="{ backgroundColor: ColorField2 }">{{
            Time2Min
        }}:0{{ Time2Sec }}</div>
    </div>

    <q-dialog v-model="openSettings">
        <q-card style="max-width: 80vw;">
            <q-card-section>
                <div class="text-h6">Settings</div>
            </q-card-section>

            <q-card-section class="q-pt-none row" v-model="Option">
                <q-radio class="col-12" v-model="Option" val="0302" label="3min + 2sec"
                    @update:model-value="ButtonOnTime = false; changeSettings(Option)" />
                <q-radio class="col-12" v-model="Option" val="0505" label="5min + 5sec"
                    @update:model-value="ButtonOnTime = false; changeSettings(Option)" />
                <q-radio class="col-12" v-model="Option" val="1510" label="15min + 10sec"
                    @update:model-value="ButtonOnTime = false; changeSettings(Option)" />
                <q-radio class="col-12" v-model="Option" val="1010" label="" @click="focusInput()"
                    @update:model-value="focusInput(); ButtonOnTime = true; printTime(time)">
                    <q-input ref="TimeDing" outlined rounded v-model="time" type="text" mask="##min + ##sec"
                        @update:model-value="printTime(time)" />
                </q-radio>
            </q-card-section>

            <q-card-actions align="between" class="bg-white text-teal">
                <q-btn flat label="Leave Game" v-close-popup @click="toMore()" />
                <q-btn flat label="Ok" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
  
<script>
import { ref } from 'vue'
import router from '../../router';

export default {
    setup() {
        return {
            openSettings: ref(false),
            Option: ref('0505'),
            time: ref('10min + 10sec'),
            ButtonOnTime: ref(false)
        }
    },
    data() {
        return {
            turn: 0,
            Time1Min: 5, Time1Sec: 0,
            Time2Min: 5, Time2Sec: 0,
            addTime: 5,
            ColorField1: 'grey',
            ColorField2: 'grey',
            paused: false
        }
    },
    methods: {
        printTime(Wert) {
            console.log(this.ButtonOnTime)
            console.log(Wert)
            console.log(Wert == "time")
            if (Wert == "") {
                this.changeSettings("0000")
            } else {
                Wert = Wert[0] + Wert[1] + Wert[8] + Wert[9]
                this.changeSettings(Wert)
            }
        },
        changeSettings(Value) {
            console.log(this.ButtonOnTime)
            clearInterval(this.Karsten2)
            clearInterval(this.Karsten1)
            this.ColorField1 = 'grey'
            this.ColorField2 = 'grey'
            this.turn = 0
            this.paused = false
            this.Time1Min = parseInt(Value.substring(0, 2))
            this.Time2Min = parseInt(Value.substring(0, 2))
            this.Time1Sec = 0
            this.Time2Sec = 0
            this.addTime = parseInt(Value.substring(2, 4))
        },
        focusInput() {
            this.$refs.TimeDing.focus();
        },
        Player1Field() {
            if (this.turn == 0 || this.turn == 1) {
                var audioClick = new Audio('/sounds/chess/Click.wav');
                audioClick.play();
                this.countDownTimer2()
                this.stop1()
                this.ColorField2 = 'green'
                this.ColorField1 = 'grey'
                if (this.turn == 1) {
                    if (this.Time1Sec + this.addTime > 59) {
                        this.Time1Min += 1
                        this.Time1Sec = this.Time1Sec + this.addTime - 60
                    } else {
                        this.Time1Sec += this.addTime
                    }
                }
                this.turn = 2
            }
        },
        Player2Field() {
            if (this.turn == 0 || this.turn == 2) {
                var audioClick = new Audio('/sounds/chess/Click.wav');
                audioClick.play();
                this.countDownTimer1()
                this.stop2()
                this.ColorField1 = 'green'
                this.ColorField2 = 'grey'
                if (this.turn == 2) {
                    if (this.Time2Sec + this.addTime > 59) {
                        this.Time2Min += 1
                        this.Time2Sec = this.Time2Sec + this.addTime - 60
                    } else {
                        this.Time2Sec += this.addTime
                    }
                }
                this.turn = 1
            }
        },
        countDownTimer1() {
            if (this.Time1Min > 0 || this.Time1Sec > 0) {
                this.Karsten1 = setInterval(() => {
                    if (this.Time1Sec == 0) {
                        if (this.Time1Min != 0) {
                            this.Time1Min -= 1
                            this.beepChecker(this.Time1Min, this.Time1Sec)
                            this.Time1Sec = 59
                            //this.countDownTimer1()
                        }
                        else {
                            this.ColorField1 = 'red'
                            var audioEnd = new Audio('/sounds/chess/End.wav');
                            audioEnd.play();
                            clearInterval(this.Karsten1);
                        }
                    } else {
                        this.Time1Sec -= 1
                        this.beepChecker(this.Time1Min, this.Time1Sec)
                        //this.countDownTimer1()
                    }
                }, 1000)
            }
        },
        countDownTimer2() {
            if (this.Time2Min > 0 || this.Time2Sec > 0) {
                this.Karsten2 = setInterval(() => {
                    if (this.Time2Sec == 0) {
                        if (this.Time2Min != 0) {
                            this.Time2Min -= 1
                            this.beepChecker(this.Time2Min, this.Time2Sec)
                            this.Time2Sec = 59
                            //this.countDownTimer2()
                        } else {
                            this.ColorField2 = 'red'
                            var audioEnd = new Audio('/sounds/chess/End.wav');
                            audioEnd.play();
                            clearInterval(this.Karsten2);
                        }
                    } else {
                        this.Time2Sec -= 1
                        this.beepChecker(this.Time2Min, this.Time2Sec)
                        //this.countDownTimer2()
                    }
                }, 1000)
            }

        },
        stop1() {
            clearInterval(this.Karsten1)
        },
        stop2() {
            clearInterval(this.Karsten2)
        },
        stopAll() {
            if (this.turn != 0) {
                this.paused = true
                clearInterval(this.Karsten2)
                clearInterval(this.Karsten1)
            }
        },
        startLast() {
            this.paused = false
            if (this.turn == 1) {
                this.countDownTimer1()
                this.stop2()
                this.ColorField1 = 'green'
                this.ColorField2 = 'grey'
            }
            if (this.turn == 2) {
                this.countDownTimer2()
                this.stop1()
                this.ColorField2 = 'green'
                this.ColorField1 = 'grey'
            }
        },
        reset() {
            console.log(this.ButtonOnTime)
            clearInterval(this.Karsten2)
            clearInterval(this.Karsten1)
            if (this.ButtonOnTime == false) {
                this.changeSettings(this.Option)
            } else {
                var Wert = this.time.replace(":", "")
                this.printTime(Wert)
            }
            this.ColorField1 = 'grey'
            this.ColorField2 = 'grey'
            this.turn = 0
            this.paused = false
        },
        beepChecker(WertMin, WertSec) {
            if (WertSec < 11 && WertMin == 0) {
                var audio = new Audio('/sounds/chess/beepSelbst.mp3');
                audio.play();
            }

        },
        toMore() {
            router.push("/More")
        }
    }
}
</script>
  
<style>
body,
html {
    padding: 0;
    margin: 0;
    height: 100%;
    font-family: 'IBM Plex Mono', monospace;
}

#app {
    height: 100%;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    color: black;
}

.Timer1 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45%;
    transform: rotate(-180deg);
    font-size: 2cm;
}

.Mitte {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 10%;
    background-color: gainsboro;
}

.Timer2 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45%;
    background-color: grey;
    font-size: 2cm;
}

#reset,
#pause,
#settings,
#play {
    transition: all .5s;
}

#settings:active,
#play:active,
#pause:active {
    color: black;
    transform: scale(1.4);
}

#reset:active,
#settings:active {
    color: black;
    transform: scale(1.2);
    rotate: 180deg;
}
.q-card {
    color: black;;
}
</style>