<template>
    <div id="endScreen" v-show="showEnd">{{ this.winner }} won!!!!!!!!!!! </div>
    <q-icon class="back-icon q-ma-md" name="arrow_back" size="3rem" @click="toGames()"/>
    <div class="SuperTTT">
      <h1 class="view-heading">Super Tic-Tac-Toe</h1>
      <div class="SuperParent">
        <div v-for="(rowArray, row) in cells" :key="rowArray" class="parent">
          <div v-for="(Value, col) in rowArray" :key="col" class="rowArray"
            :style="{ backgroundColor: rowArray[col] == 'X' ? 'green' : rowArray[col] == 'O' ? 'red' : 'white' }"
            @click="diffCell(row, col)"> {{ Value }}</div> <!-- {{ Math.floor(row / 3) }} {{ Math.floor(col / 3) }} -->
        </div>
      </div>
      <button @click="clear()">Reset</button>
    </div>
  </template>
  
  <script>
  import router from '../../router';

  export default {
    data() {
      return {
        turn: 0,
        showEnd: false,
        cells: Array.from(Array(9), () => new Array(9)),
        bigGame: [
          [null, null, null],
          [null, null, null],
          [null, null, null]
        ],
        winner: '',
        nextSector: [null, null]
      };
    },
    methods: {
      diffCell(row, col) {
        if (Math.floor(row / 3) == this.nextSector[0] && Math.floor(col / 3) == this.nextSector[1] || this.nextSector[0] == null) {
          if (this.turn % 2 == 0 && this.cells[row][col] == null) {
            this.cells[row][col] = "X"
            this.turn += 1
          } else if (this.turn % 2 == 1 && this.cells[row][col] == null) {
            this.cells[row][col] = "O"
            this.turn += 1
          } this.checkSector(row, col)
          this.getNextSectorr(row, col)
        }
      },
      getNextSectorr(row, col) {
        var absoluteSectorPoint = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3]
        this.nextSector = [row - absoluteSectorPoint[0], col - absoluteSectorPoint[1]]
        if (this.bigGame[this.nextSector[0]][this.nextSector[1]] != null) {
          console.log(this.nextSector[0], this.nextSector[1], this.bigGame[this.nextSector[0]][this.nextSector[1]] == null, this.bigGame[this.nextSector[0]][this.nextSector[1]])
          this.nextSector = [null,null]
        }
        console.log("NextSector: ",this.nextSector)
      },
      checkSector(row, col) {
        let x = Math.floor(row / 3) * 3 //Macht Koordinaten von oberer linker Ecke
        let y = Math.floor(col / 3) * 3
        //horizontal check
        for (let i = 0; i < 3; i++) {
          if (this.cells[x + i][y] == this.cells[x + i][y + 1] && this.cells[x + i][y + 1] == this.cells[x + i][y + 2] && this.cells[x + i][y + 1] != null) {
            this.sectorWon(this.cells[x + i][y], x, y)
            break
          }
          //vertical check
          if (this.cells[x][y + i] == this.cells[x + 1][y + i] && this.cells[x + 1][y + i] == this.cells[x + 2][y + i] && this.cells[x + 1][y + i] != null) {
            this.sectorWon(this.cells[x][y + i], x, y)
            break
          }
        }
        //diagonal check
        if (this.cells[x][y] == this.cells[x + 1][y + 1] && this.cells[x + 1][y + 1] == this.cells[x + 2][y + 2] && this.cells[x + 1][y + 1] != null) {
          this.sectorWon(this.cells[x + 1][y + 1], x, y)
        }
        if (this.cells[x][y + 2] == this.cells[x + 1][y + 1] && this.cells[x + 1][y + 1] == this.cells[x + 2][y] && this.cells[x + 1][y + 1] != null) {
          this.sectorWon(this.cells[x + 1][y + 1], x, y)
        }
      },
      sectorWon(Winner, SecRow, SecCol) {
        console.log("Secotor won")
        this.nextSector = [null,null]
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.cells[SecRow + i][SecCol + j] = Winner
          }
        }
        this.bigGame[SecRow / 3][SecCol / 3] = Winner
        this.checkBigWin()
      },
      checkBigWin() {
        //horizontal check
        for (let i = 0; i < 3; i++) {
          if (this.bigGame[i][0] == this.bigGame[i][1] && this.bigGame[i][1] == this.bigGame[i][2] && this.bigGame[i][1] != null) {
            this.winner = this.bigGame[i][1]
            this.showEnd = true
            console.log('1')
            break
          }
          //check vertical
          if (this.bigGame[0][i] == this.bigGame[1][i] && this.bigGame[1][i] == this.bigGame[2][i] && this.bigGame[2][i] != null) {
            this.winner = this.bigGame[1][i]
            this.showEnd = true
            console.log('2')
            break
          }
          //check diagonal
          if (this.bigGame[0][0] == this.bigGame[1][1] && this.bigGame[1][1] == this.bigGame[2][2] && this.bigGame[1][1] != null) {
            this.winner = this.bigGame[1][1]
            this.showEnd = true
            console.log('3')
          }
          if (this.bigGame[0][2] == this.bigGame[1][1] && this.bigGame[1][1] == this.bigGame[2][0] && this.bigGame[1][1] != null) {
            this.winner = this.bigGame[1][1]
            this.showEnd = true
            console.log('4')
          }
        }
      },
      clear() {
        this.cells = Array.from(Array(9), () => new Array(9))
        this.winner = ''
        this.showEnd = true
        this.bigGame = [
          [null, null, null],
          [null, null, null],
          [null, null, null]
        ],
          this.nextSector = [null, null]
      },
      toGames(){
        router.push("/")
      }
    }
  };
  </script>
  
  <style>
  .SuperTTT {
    display:flex;
    flex-direction: column;
    height: 100vh;
    align-items: center
    
  }

  .parent {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    min-height: 20px;
    min-width: 20px;
    max-height: 50px;
    max-width: 50px;
    border-color: grey;
    border-style: solid;
    border-width: 1px;
    position: relative;
    left: -400%;
  }
  
  .rowArray {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-color: grey;
    border-style: solid;
    border-width: 1px;
    transition: .2s;
  }
  
  .rowArray:hover {
    transform: scale(1.03);
  }
  
  .parent> :nth-child(3n) {
    border-style: solid;
    border-right-width: 5px;
  }
  
  .parent> :nth-child(9n) {
    border-style: solid;
    border-right-width: 1px;
  }
  
  .SuperParent {
    font-size: large;
  }
  
  .SuperParent> :nth-child(3n) > div {
    border-style: solid;
    border-bottom-width: 5px;
  }
  
  .SuperParent> :nth-child(n+7) {
    border-style: solid;
    border-bottom-width: 1px;
  }
  
  #endScreen {
    display: none;
    position: fixed;
    font-size: 4rem;
    top: 50%;
    bottom: 50%;
    left: 50%;
    right: 50%;
    z-index: 1;
  }
  
  .SuperTTT button {
    border-radius: 10px;
    width: 70px;
    height: 30px;
    transition: .5s;
    margin-top: 10px;
  }
  
  .SuperTTT button:hover {
    transform: scale(1.1);
    border-radius: 8px;
  }
  </style>