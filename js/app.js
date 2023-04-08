//menu
const gameScreen = document.getElementById('game-screen');

function submitName() {
    const nameInput = document.getElementById('name');
    const name = nameInput.value.trim();

    if (name === '') {
        alert('Please enter a name.');
        return;
    }

    let highScores = JSON.parse(localStorage.getItem('highScores')) || {};

    if (highScores.hasOwnProperty(name)) {
        alert('Name already exists. Please enter a different name.');
        return;
    }


    highScores[name] = score;
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // updateScoreList();
    nameInput.value = '';
}

//display scores
// Get the high scores from local storage
const scoreList = document.getElementById("score-list");
const highScores = JSON.parse(localStorage.getItem("highScores")) || {};

Object.entries(highScores).forEach(([name, score]) => {
    const listItem = document.createElement("li");
    if (JSON.stringify(score) === "{}"){
        listItem.textContent = `${name}: 0`;

    }else {
        listItem.textContent = `${name}: ${JSON.stringify(score)}`;

    }
    scoreList.appendChild(listItem);
});








//score and level
let score = 0
const levelThresholds = [50, 100, 150, 200];

let currentLevel = 1;
let time = 10;
let intervalId = null;


const scoreElement = document.getElementById("score");

scoreElement.textContent = score;
document.getElementById("level").textContent = `Level ${currentLevel}`;
const timer = document.querySelector(".timer");
const totalTime = 100;
let timeLeft = totalTime;
function updateScore(points) {
    score += points;
    timeLeft++;

    scoreElement.textContent = score;
    updateLevel(score)
}


function updateTimer() {
    console.log(timeLeft)
    if (timeLeft > totalTime) {
        timeLeft = totalTime;
    }
    const timerWidth = (timeLeft / totalTime) * 100 + "%";
    timer.style.width = timerWidth;
    timeLeft--;
    if (timeLeft < 0) {
        clearInterval(interval);
        alert("Time's up! You lost. :(");
    }
}

let interval = setInterval(updateTimer, 1000); // update the timer every second

// Update the level based on the current score
function updateLevel(score) {
    let previousLevel = currentLevel; // keep track of the previous level

    for (let i = 0; i < levelThresholds.length; i++) {
        if (score >= levelThresholds[i]) {
            currentLevel = i + 1;

        } else {
            break;
        }
    }
    if (previousLevel !== currentLevel) { // check if the level has changed
        timeLeft = 100; // reset the timer
    }
    document.getElementById("level").textContent = `Level ${currentLevel}`;
}
function updateScoreEverySecond() {
    setInterval(() => {
        const randomScore = 5;
        updateScore(randomScore);
    }, 3000); // call the function every 1 second
}
updateScoreEverySecond()
//Game
document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const width = 8
    const squares = []



    const audio = new Audio('sounds/backroundmusic.mp3');
    audio.loop=true
    audio.volume= 0.5
    document.addEventListener('click', () => {
        audio.play();
    });




    const jewelColors = [
        'url(images/red-jewel.png)',
        'url(images/yellow-jewel.png)',
        'url(images/orange-jewel.png)',
        'url(images/purple-jewel.png)',
        'url(images/green-jewel.png)',
        'url(images/blue-jewel.png)',

    ]

    function createBoard(){
        for (let i = 0; i < width*width; i++) {
            const  square = document.createElement('div')
            square.setAttribute('id', i)
            // square.setAttribute('class', 'rotate')
            let randomColor = Math.floor(Math.random() * jewelColors.length)
            square.style.backgroundImage = jewelColors[randomColor]
            square.textContent = i

            grid.appendChild(square)
            squares.push(square)
        }
    }
    createBoard()

    let colorBeingDraged
    let colorBeingReplaced
    let squareIdBeingDraged
    let squareIdBeingReplaced



    squares.forEach(square => square.addEventListener('click', handleClick))


    let firstSquare = null
    let secondSquare = null
    let firstColor = null
    let secondColor = null
    function handleClick(event) {
        const square = event.target;

        if (!firstSquare) {
            firstSquare = square;
            firstSquare.classList.add('rotate');


        } else if (square === firstSquare) {
            firstSquare.classList.remove('rotate');
            firstSquare = null;
        } else{
            secondSquare = square;
            swapSquares(firstSquare, secondSquare);
            firstSquare.classList.remove('rotate');
            firstSquare = null;
            secondSquare = null
        }

    }

    function swapSquares(firstSquare, secondSquare) {
        const firstId = parseInt(firstSquare.id)
        const secondId = parseInt(secondSquare.id)
        firstColor = firstSquare.style.backgroundImage
        secondColor = secondSquare.style.backgroundImage
        
        if (checkForAdjacent(firstSquare,secondSquare)){
            // Swap the gems
            const tempBackgroundImage = firstSquare.style.backgroundImage
            firstSquare.style.backgroundImage = secondSquare.style.backgroundImage
            secondSquare.style.backgroundImage = tempBackgroundImage

            const tempId = firstId.id
            firstId.id = secondId.id
            secondId.id = tempId

            squares[firstId].style.backgroundImage = secondColor
            // Play the hush sound

            const hush = new Audio('sounds/hush.mp3');
            hush.volume=0.7
            hush.play()



            setTimeout(()=>{
                let row = checkForRow()
                let vertical = checkForVertical()

                let first = (firstId === row || firstId === vertical)
                let first2 = (firstId+1 === row || firstId+width === vertical) || (firstId-1 === row || firstId-width === vertical)
                let first3 =(firstId+2 === row || firstId+2*width === vertical) || (firstId-2 === row || firstId-2*width === vertical)
                let second = (secondId === row || secondId === vertical)
                let second2 = (secondId+1 === row || secondId+width === vertical) || (secondId-1 === row || secondId-width === vertical)
                let second3 = (secondId+2 === row || secondId+2*width === vertical) || (secondId-2 === row || secondId-2*width === vertical)

                let elso = first || first2 || first3
                let masodik = second || second2 || second3
                console.log("1.1"+first)
                console.log("1.2"+first2)
                console.log("1.3"+first3)
                console.log("2.1"+second)
                console.log("2.2"+second2)
                console.log("2.3"+second3)
                if ((row !== -1 || vertical !== -1) && (elso || masodik) ) {
                    console.log("row " + row)
                    console.log("vertiacl " + vertical)
                    moveDown()
                    // There is a match, so leave the new colors of the gems as they are
                } else{
                    console.log("nem volt match")
                    const tempBackgroundImage = firstSquare.style.backgroundImage;
                    firstSquare.style.backgroundImage = secondSquare.style.backgroundImage;
                    secondSquare.style.backgroundImage = tempBackgroundImage;

                    const tempId = firstSquare.id;
                    firstSquare.id = secondSquare.id;
                    secondSquare.id = tempId;

                    squares[firstId].style.backgroundImage = firstColor;
                    const hush = new Audio('sounds/no-good.mp3');
                    hush.volume=0.7
                    hush.play()
                    // reset first and second square variables
                    firstSquare = null
                    secondSquare = null
                }


            },100)

        }else {
            const hush = new Audio('sounds/no-good.mp3');
            hush.volume=0.7
            hush.play()
        }
    }

    function checkForAdjacent(firstsquare, secondsquare) {
        const index1 = squares.indexOf(firstsquare)
        const index2 = squares.indexOf(secondsquare)
        const diff = Math.abs(index1 - index2)
        const isAdjacentCol = (diff === width)
        const isAdjacentRow = (diff === 1 && Math.floor(index1 / width) === Math.floor(index2 / width))
        return isAdjacentCol || isAdjacentRow
    }
    //movedown if cleared
    function moveDown(){
        let allFilled = false

            for (let i = 0; i < 55; i++) {
                if (squares[i + width].style.backgroundImage === ''){

                    squares[i+width].style.backgroundImage = squares[i].style.backgroundImage
                    squares[i].style.backgroundImage = ''
                    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                    const isFirstRow = firstRow.includes(i)
                    if (isFirstRow && squares[i].style.backgroundImage === ''){
                        console.log("lekellcsuszni")
                        let randomColor = Math.floor(Math.random() * jewelColors.length)
                        squares[i].style.backgroundImage = jewelColors[randomColor]
                    }

                }
            }


    }


    function checkForRow() {
        let row = -1;
        for (let i = 0; i < squares.length-2; i++) {
            const currentGem = squares[i];
            const nextGem = squares[i + 1];
            const nextNextGem = squares[i + 2];


            const isMatch = currentGem.style.backgroundImage === nextGem.style.backgroundImage
                && nextGem.style.backgroundImage === nextNextGem.style.backgroundImage;

            if (isMatch && i % width < width - 2) {
                row = i;
                // Clear the matched gems
                // currentGem.style.backgroundImage = '';
                // nextGem.style.backgroundImage = '';
                // nextNextGem.style.backgroundImage = '';
            }
        }

        return row;
    }

    function checkForVertical() {
        let vertical = -1;
        for (let i = 0; i < squares.length-1; i++) {
            if (
                i + width * 2 < squares.length &&
                squares[i].style.backgroundImage === squares[i + width].style.backgroundImage &&
                squares[i].style.backgroundImage === squares[i + width * 2].style.backgroundImage
            ) {
                console.log('Vertical match at ' + i);
                vertical = i;

                // Clear the matched gems
                // squares[i].style.backgroundImage = '';
                // squares[i + width].style.backgroundImage = '';
                // squares[i + width * 2].style.backgroundImage = '';
            }
        }

        return vertical;
    }

    // setInterval(moveDown,500)
    // setInterval(checkForVertical,500)
    // setInterval(checkForRow,500)





})