var player1 = document.querySelector(".player-1");
var player2 = document.querySelector(".player-2");
var roleBtn = document.querySelector(".role span");
var dice1 = document.querySelector(".dice-1");
var dice2 = document.querySelector(".dice-2");
var tbody = document.querySelectorAll("tbody");
var qty = document.querySelectorAll(".qty");
var total = document.querySelectorAll(".total");
var role = document.querySelector(".role");
var skip = document.querySelector(".skip");
var pl = 0;
var currentPlayer = 0;
const dice = [
    "images/Alea_1.png",
    "images/Alea_2.png",
    "images/Alea_3.png",
    "images/Alea_4.png",
    "images/Alea_5.png",
    "images/Alea_6.png"
];

const diceValue = [1, 2, 3, 4, 5, 6];

const players = [
    {
        name: "",
        val: 0,
        totalMoves: 0,
        doubles: 0,
        role: 0
    },
    {
        name: "",
        val: 0,
        totalMoves: 0,
        doubles: 0,
        role: 0
    }
];
    
function start() {
    clearGame()
    setTimeout(()=> {
        var name1 = prompt("enter first player name!");
        var name2 = prompt("enter second player name!");
        if (name1 != "" && name2 != "") {
            player1.innerHTML = name1;
            players[0].name = name1;
            document.querySelectorAll("h2")[0].innerHTML = name1;
            player2.innerHTML = name2;
            players[1].name = name2;
            document.querySelectorAll("h2")[1].innerHTML = name2;
            createDice()
        }
    })   
}

function createDice() {
    var div =  document.createElement("div");
    div.className = "dice-wraper";
    div.innerHTML = `<figure>
                     <img src="${dice[0]}" class="open-dice"> 
                     <p id="name">${players[0].name}'s role</p>
                     </figure>`;
    document.querySelector("body").appendChild(div);
    div.firstChild.addEventListener("click", chooseBeginer)
    pl = 0;
}

async function chooseBeginer() {
    var openDice = document.querySelector(".open-dice");
    await roleDice(openDice);
    players[pl].val = openDice.id;
    pl++
    if (pl == 2) {
        compare(openDice)
    } else {
        document.querySelector("#name").innerHTML = players[pl].name + "'s role";
    }
}

function roleDice(a) {
    var x = 0;
    var rand = 0;
    return new Promise(resolve => {
        var int = setInterval(()=>{
            rand = Math.floor(Math.random() * 5);
            a.src = dice[rand];
            a.id = diceValue[rand];
            x++
            if (x == 5) {
                clearInterval(int)
            }
        }, 100)
        setTimeout(()=> {
            resolve(rand);
        }, 500)
    })     
}
    
function compare(openDice) {
    if (players[0].val == players[1].val) {
        openDice.parentElement.parentElement.remove();
        createDice();
    } else if (players[0].val > players[1].val) {
        roleBtn.innerHTML = players[0].name;
        openDice.parentElement.parentElement.remove();
        setEvents()
    } else {
        roleBtn.innerHTML = players[1].name;
        openDice.parentElement.parentElement.remove();
        currentPlayer = 1;
        setEvents()
    }
}

async function setEvents() {
    skip.addEventListener("click", togglePlayer);
    role.addEventListener("click", play);
}

async function play() {
    roleDice(dice1);
    await roleDice(dice2);
    calc(parseInt(dice1.id), parseInt(dice2.id));
}

function calc(a, b) {
    if (a == b) {
        players[currentPlayer].val = (a+b) * (a+b);
        players[currentPlayer].doubles++;
    } else {
        players[currentPlayer].val = a + b;
    }
    updatTable(a, b, players[currentPlayer]);
}

function updatTable(a, b, pl) {
    pl.role++;
    pl.totalMoves += pl.val;
    var tr = document.createElement("tr");
    tr.innerHTML = `<td>${pl.role}</td>
                    <td>${a}</td>
                    <td>${b}</td>
                    <td>${pl.val}</td>`;
    tbody[currentPlayer].appendChild(tr);
    qty[currentPlayer].innerHTML = pl.doubles;
    total[currentPlayer].innerHTML = pl.totalMoves;
    togglePlayer();
}

function togglePlayer() {
    if (currentPlayer == 0) {
        currentPlayer = 1;
    } else {
        currentPlayer = 0;
    }
    roleBtn.innerHTML = players[currentPlayer].name;
}

function clearGame() {
    currentPlayer = 0;
    tbody[0].innerHTML = "";
    tbody[1].innerHTML = "";
    qty[0].innerHTML = 0;
    qty[1].innerHTML = 0;
    total[0].innerHTML = 0;
    total[1].innerHTML = 0;
    players[0].totalMoves = 0;
    players[1].totalMoves = 0;
    players[0].doubles = 0;
    players[1].doubles = 0;
    players[0].role = 0;
    players[1].role = 0;
    role.removeEventListener("click", play);
    skip.removeEventListener("click", togglePlayer);
}