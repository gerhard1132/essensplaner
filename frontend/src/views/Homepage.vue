<template>
    <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toMore()" />
    <h1 id="hiddenMessage"></h1>
    <div class="Essensplaner" @dragover.prevent>
        <div class="dashboard">
            <div class="CurrentPlan">
                <table v-show="this.modus == 'Planner'" class="currentTable">
                    <thead>
                        <th v-for="(day) in foodPlan" :key="day" :draggable="this.edit" @dragover.prevent
                            @dragstart="dragDay0(day)" @drop="dragDay1(day)">
                            {{ day.name }}
                        </th>
                    </thead>
                    <tbody>
                        <tr v-for="(type) in foodTypes">
                            <td v-for="(day, index) in foodPlan" :key="day" :draggable="this.edit" @dragover.prevent
                                @drop="dragFood1(day, type)" @dragstart="dragFood0(day, type)"
                                :style="{ opacity: editRecipePop ? '0.7' : '1' }" @click="genNewFood(day, type)"
                                :class="{ wigglebale: this.edit }" :title="getItemNames(day[type].ITEMS)">
                                {{ day[type].NAME }}
                            </td>
                        </tr>
                    </tbody>

                    <div class="editPopupStart" v-show="editRecipePop">
                        <div style="margin-top: 10px; font-size: large;text-align: center;">{{ this.editRecipeObj.NAME
                        }}</div>
                        <div style="width: 100%; display: flex; flex-direction: column;align-items: center;">
                            <li class="pupUpItem" v-for="item in this.editRecipeObj.ITEMS">{{ item }}</li>
                        </div>
                        <div>
                            <button style="margin: 5px;" @click="this.editRecipePop = false">Close</button>
                        </div>
                    </div>

                </table>
                <div class="Recipes" v-show="this.modus == 'Recipe'">
                    <div class="recipe-item" :style="{ opacity: editRecipePop ? '0.3' : '1' }">
                        <div style="margin-bottom: 10px;">Breakfast</div>
                        <li class="recipie-lister" v-for="(food) in allRecipies.breakfast"
                            @click="showIngedients(food)"> {{ food.NAME }}
                        </li>
                    </div>
                    <div class="recipe-item" :style="{ opacity: editRecipePop ? '0.3' : '1' }">
                        <div style="margin-bottom: 10px;">Lunch</div>
                        <li class="recipie-lister" v-for="(food) in allRecipies.lunch"
                            @click="showIngedients(food)"> {{
                            food.NAME }}
                        </li>
                    </div>
                    <div class="recipe-item" :style="{ opacity: editRecipePop ? '0.3' : '1' }">
                        <div style="margin-bottom: 10px;">Dinner</div>
                        <li class="recipie-lister" v-for="(food) in allRecipies.dinner"
                            @click="showIngedients(food)">
                            {{ food.NAME
                            }}</li>
                    </div>
                    <div class="recipe-item" :style="{ opacity: editRecipePop ? '0.3' : '1' }">
                        <div style="margin-bottom: 10px;">Snack</div>
                        <li class="recipie-lister" v-for="(food) in allRecipies.snack"
                            @click="showIngedients(food)">
                            {{ food.NAME }}
                        </li>
                    </div>

                    <div class="editPopup" v-show="editRecipePop">
                        <div style="margin: 20px; font-size: large;text-align: center;">{{ this.editRecipeObj.NAME }}
                        </div>
                        <div style="width: 100%; display: flex; flex-direction: column;align-items: center;">
                            <li class="pupUpItem" v-for="item in this.editRecipeObj.ITEMS">{{ item }}</li>
                        </div>
                        <div>
                            <button @click="this.editRecipePop = false">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="Actions">
                <button @click="generatePlan()">New Plan</button>
                <button @click="editPlan()">Edit Plan</button>
                <button @click="manageRecipe()">All Recipes</button>
                <button @click="copyList()">Copy List</button>
            </div>
            <div class="shoppingList" @drop="deleteFood()">
                <h5 style="text-align: center;">Einkaufsliste</h5>
                <li id="listItems" v-for="(elem, index) in shopList" :key="index">
                    {{ elem }}
                    <span id="removeItemX" @click="removeItem(index)">X</span>
                </li>
                <li><input type="text" style="background-color: transparent" placeholder="--> hinzufügen"
                        v-model="newItem" @keydown.enter.prevent="addItemToShoppingList(newItem)"></li>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../router';
import axios from 'axios';

//const base = "https://nichtroman.de"
const base = "http://localhost:5000"

export default {
    mounted() {
        this.getSavedPlan();
    },
    methods: {
        generatePlan() {
            if (this.edit) {
                axios.get(base + '/api/generatePlan')
                    .then(res => {
                        this.foodPlan = res
                    })
            }
        },
        genNewFood(day, type) {
            if (day[type].NAME == "+") {
                axios.get(base + '/api/generateMeal', { params: { type } })
                    .then(res => {
                        console.log(res.data)
                        day[type] = res.data
                    })
            } else {
                console.log(day, type, this.allRecipies)
                this.showIngedients(day[type])
            }

        },
        savePlan() {
            axios.post(base + '/api/savePlan', { data: this.foodPlan, shoppingList: this.shopList })
                .then(response => {
                    console.log('Response:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            //this.shopList = getList(this.foodPlan)
        },
        getSavedPlan() {
            axios.get(base + '/api/getSavedPlan')
                .then(res => {
                    console.log("HIER REEEEEEEEES", res)
                    this.foodPlan = res.data.sendPlan
                    this.shopList = res.data.sendList
                    console.log(res.data)
                })

        },
        dragFood0(inDay, inType) {
            this.oldPos = { "day": inDay, "type": inType }
        },
        dragFood1(inDay, inType) {
            console.log(inDay, inType)
            var helper = inDay[inType]
            inDay[inType] = this.oldPos["day"][this.oldPos["type"]]
            this.oldPos["day"][this.oldPos["type"]] = helper
            this.oldPos = {}
        },
        deleteFood() {
            this.oldPos["day"][this.oldPos["type"]] = { $: { "NAME": "+" } }
        },
        dragDay0(inDay) {
            this.oldPos = inDay
        },
        dragDay1(inDay) {
            var helper = {
                "breakfast": inDay["breakfast"],
                "lunch": inDay["lunch"],
                "dinner": inDay["dinner"],
                "snack": inDay["snack"]
            }
            this.foodTypes.forEach(type => inDay[type] = this.oldPos[type])
            this.foodTypes.forEach(type => this.oldPos[type] = helper[type])
            this.oldPos = {}
        },
        getItemNames(itemList) {
            if (itemList && itemList.length > 0) {
                return itemList.map(item => item).join(', ');
            } else {
                return '';
            }
        },
        addItemToShoppingList() {
            const trimmedItem = this.newItem.trim();
            if (trimmedItem) {
                this.shopList.push(trimmedItem);
                this.newItem = '';
                this.savePlan()
            }
            console.log(this.shopList)
        },

        removeItem(index) {
            this.shopList.splice(index, 1);
            this.savePlan()
        },
        toMore() {
            router.push("/More")
        },
        manageRecipe() {
            if (this.modus != "Recipe") { this.modus = "Recipe" }
            else { this.modus = "Planner" }
            this.getAllFoods()
        },
        getAllFoods() {
            axios.get(base + '/api/getAllFoods')
                .then(res => {
                    console.log(res.data)
                    this.allRecipies = res.data
                })
        },
        showIngedients(inFood) {
            this.editRecipePop = true;
            this.editRecipeObj = inFood
        },
        editPlan() {
            if (this.edit) {
                this.edit = !this.edit
                this.savePlan()
            } else { this.edit = true }
        },
        copyList() {
            const textToCopy = this.shopList.join(",\n");
            navigator.clipboard.writeText(textToCopy)
                .then(() => { console.log("List copied to clipboard"); })
        }
    },
    data() {
        return {
            modus: "Planner",
            edit: false,
            editRecipePop: false,
            editRecipeObj: {
                "NAME": "None",
                "ITEMS": []
            },
            oldPos: {},
            foodTypes: ["breakfast", "lunch", "dinner", "snack"],
            allDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            foodPlan: [],
            newItem: "",
            shopList: ["Erbsen", "Kichererbsen", "Quark", "2x Bananen"],
            allRecipies: {
                "breakfast": [{ "food": [] }],
                "lunch": [{ "food": [] }],
                "dinner": [{ "food": [] }],
                "snack": [{ "food": [] }],
            }
        };
    }
}
</script>

<style>
.Essensplaner {
    display: flex;
    width: 100%;
    height: 87vh;
    justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 15px;
    line-height: 20px;
    font-weight: 400;
}

.dashboard {
    width: 80%;
    background-color: #131313;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1.6fr 0.5fr;
    grid-template-rows: 1.5fr 0.2fr;
    gap: 8px 8px;
    grid-auto-flow: row;
}

.CurrentPlan {
    grid-area: 1 / 1 / 2 / 2;
    /* row-start / column-start / row-end / column-end */
    background-color: rgb(245, 137, 137);
    border-radius: 10px;
    display: flex;
    justify-content: center;
}

.currentTable {
    position: relative;
    width: 99%;
    padding: 2px;
}

#removeItemX {
    display: none;
    position: absolute;
    right: 10px;
}

#listItems {
    position: relative;
}

#listItems:hover #removeItemX {
    display: inline-block;
}

.currentTable td,
.currentTable th {
    background-color: rgb(248, 156, 156);
    width: calc(100% / 7);
    height: calc(100% / 4);
    justify-content: center;
    text-align: center;
    transition: .3s;
    border-radius: 10px;
}

.wigglebale {
    animation: wiggle .3s infinite;
}

.currentTable td:hover {
    color: black;
    transform: scale(1.1);
    border-style: solid;
    background-color: rgba(180, 234, 241, 0.562);
    border-color: rgb(180, 234, 241);
}

.currentTable th:hover {
    color: black;
    background-color: rgba(180, 234, 241, 0.562);
    border-color: rgb(180, 234, 241);
    cursor: grab;
    user-select: none;
}

.Recipes {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    border-radius: 10px;
    background-color: rgb(152, 196, 255);
}

.Recipes> :nth-child(1) {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

.Recipes> :nth-child(4) {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.recipe-item {
    background-color: rgb(152, 196, 255);
    padding: 20px;
    text-align: center;
    border: solid 2px black;
}

.recipie-lister {
    text-align: left;
    border: dashed 1px;
    margin: 3px;
    padding: 3px;
    list-style-type: none;
    transition: .5s;
}

.pupUpItem {
    text-align: left;
    border: dashed 1px;
    margin: 3px;
    padding: 3px;
    list-style-type: none;
    transition: .5s;
    width: 80%;
}

.recipie-lister:hover,
.pupUpItem:hover {
    background-color: white;
    color: black;
    transform: scale(1.1);
    cursor: pointer;
}

.editPopup {
    position: absolute;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(250, 168, 216);
    min-height: 250px;
    width: 30%;
    max-width: 300px;
    min-width: 250px;
    border-radius: 20px;
}

.editPopupStart {
    position: absolute;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(250, 168, 216);
    min-height: 250px;
    width: 30%;
    max-width: 300px;
    min-width: 250px;
    border-radius: 20px;
}

.Actions {
    grid-area: 2 / 1 / 3 / 2;
    background-color: rgb(143, 143, 252);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.Actions>button,
.editPopup *>button,
.editPopupStart *>button {
    width: 120px;
    height: 50px;
    border-radius: 15px;
    margin: 10px;
    transition: 0.3s;
}

.Actions>button:hover,
.editPopup *>button:hover,
.editPopupStart *>button:hover {
    background-color: rgb(180, 234, 241);
    transform: scale(1.1);
}

.shoppingList {
    grid-area: 1 / 2 / 3 / 3;
    background-color: rgb(231, 231, 170);
    border-radius: 10px;
    color: black;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 200px;
}

.shoppingList>* {
    margin-left: 10%;
}

.shoppingList>*:nth-last-child(1) {
    margin-bottom: 30px;
}

.shoppingList::-webkit-scrollbar {
    width: 12px;
}

.shoppingList::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 6px;
}


@keyframes wiggle {
    0% {
        transform: rotate(-1deg) scale(0.95);
    }

    50% {
        transform: rotate(1deg) scale(0.95);
    }

    100% {
        transform: rotate(-1deg) scale(0.95);
    }
}
</style>