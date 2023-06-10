const gameBoard = document.getElementById("MinesweeperBoard");

const board_info = {
    cnt_row: 7,
    cnt_col: 7,
    opening: true,
    timerID: -1,
    state: false
};

var seed=177013;
let gameTime;
let state;
let clicked;

function hash(i, j) {
    return (i - 1) * board_info.cnt_col + j - 1;
}

function rng(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + l;
}

function init() {
    document.getElementById("report").style.backgroundColor="yellow";
    stopTimer(board_info.timerID);
    gameTime = 0;
    state = new Array(board_info.cnt_row + 1);
    for (var i = 1; i <= board_info.cnt_row; i++) {
        state[i] = new Array(board_info.cnt_col + 1).fill(0);
    }

    clicked = new Array(board_info.cnt_row + 1);
    for (var i = 0; i <= board_info.cnt_row; i++) {
        clicked[i] = new Array(board_info.cnt_col + 1).fill(0);
    }

    // on_my_way_to_gen_random_table();

    document.getElementById(
        "timer"
    ).innerHTML = `⏲️: 0`;
    state[1] = new Array(0, 3, 6, 4, 3, 2, 7, 4);
    state[2] = new Array(0, 1, 5, 1, 7, 1, 2, 2);
    state[3] = new Array(0, 6, 2, 5, 3, 7, 4, 1);
    state[4] = new Array(0, 5, 1, 2, 5, 3, 2, 7);
    state[5] = new Array(0, 2, 6, 1, 6, 4, 5, 2);
    state[6] = new Array(0, 1, 3, 2, 5, 1, 2, 4);
    state[7] = new Array(0, 7, 6, 3, 2, 5, 7, 6);
    var table = document.createElement("table");
    var row, td;
    for (var i = 1; i <= board_info.cnt_row; i++) {
        row = document.createElement("tr");
        for (var j = 1; j <= board_info.cnt_col; j++) {
            td = document.createElement("td");
            td.id = hash(i, j);
            row.appendChild(td);
            td.textContent = state[i][j];
            td.style.backgroundColor="white";
            addCellListener(td, i, j);
        }
        table.appendChild(row);
    }
    gameBoard.appendChild(table);
}

let visited = new Array(board_info.cnt_row + 1);
for (var i = 0; i <= board_info.cnt_row; i++) {
    visited[i] = new Array(board_info.cnt_col + 1).fill(false);
}

function dfs(i, j) {
    if (visited[i][j]) {return;}
    visited[i][j] = true;
    if (i - 1 > 0) {dfs(i - 1, j);}
    if (j - 1 > 0) {dfs(i, j - 1);}
    if (i + 1 <= board_info.cnt_row) {dfs(i + 1, j);}
    if (j + 1 <= board_info.cnt_col) {dfs(i, j + 1);}
}

function check() {
    for (var i = 1; i <= board_info.cnt_row; i++) {
        for (var j = 1; j <= board_info.cnt_col; j++) {
            if (clicked[i][j]==1 && clicked[i - 1][j]==1) return false;
            if (clicked[i][j]==1 && clicked[i][j - 1]==1) return false;
        }
    }
    let x; let y; 
    for (var i = 1; i <= board_info.cnt_row; i++) {
        for (var j = 1; j <= board_info.cnt_col; j++) {
            visited[i][j] = false;
            if (clicked[i][j] == 0) {x = i; y = j;}
            else {visited[i][j] = true;}
        }
    }

    dfs(x, y);
    for (var i = 1; i <= board_info.cnt_row; i++) {
        for (var j = 1; j <= board_info.cnt_col; j++) {
            if (!visited[i][j]) return false;
        }
    }
    for (var i = 1; i <= board_info.cnt_row; i++) { 
        let flag = new Array(board_info.cnt_col + 1).fill(false);
        for (var j = 1; j <= board_info.cnt_col; j++) {  
            if (clicked[i][j]==1) continue;
            if (flag[state[i][j]]==false) flag[state[i][j]] = true;
            else return false;
        }
    }
    return true;
}

function submit()
{
    if(board_info.state==true) return;
    board_info.state=true;
    stopTimer(board_info.timerID);
    var endgame=check();
    if(endgame==true) 
    {
        document.getElementById("report").innerHTML="You win!";
        document.getElementById("report").style.backgroundColor="green";
    }
    if(endgame==false) 
    {
        document.getElementById("report").innerHTML="You lose!";
        document.getElementById("report").style.backgroundColor="red";
    }
}

function startTimer() {
    board_info.timerID = setInterval(function () {
        gameTime += 1;
        document.getElementById(
            "timer"
        ).innerHTML = `⏲️: ${gameTime}`;
    }, 1000);
}

function stopTimer(id) {
    clearInterval(id);
}

function addCellListener(td, i, j) {
    td.addEventListener("mousedown", function (event) {
        if (event.which == 1) cell_click(this, i, j);
    });
}

function cell_click(cell, i, j)
{
    if(board_info.state==true) return;
    if (board_info.opening === true) {
        board_info.opening = false;
        startTimer();
    }
    clicked[i][j]^=1;
    if(clicked[i][j])
    {
        cell.style.color="white";
        cell.style.backgroundColor="gray";
    }
    else
    {
        cell.style.color="black";
        cell.style.backgroundColor="white";
    }
}

window.addEventListener("load", function () {
    init();
});

function newgame(){
	window.location.reload();
    board_info.opening=true;
    board_info.timerID=-1;
    board_info.state=false;
}
