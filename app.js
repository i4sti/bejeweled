//menu
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');

// Get a reference to the play button
const playButton = document.getElementById('play-button');

// Add an event listener to the play button
playButton.addEventListener('click', () => {
    console.log("mehet a jatek")
    // Hide the welcome screen
    welcomeScreen.style.display = 'none';

    // Show the game screen
    gameScreen.style.display = 'block';
});

//Game
document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const width = 8
    const squares = []
    let score = 0


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
            square.setAttribute('draggable', true)
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


            console.log("sor "+checkRowForThree())
            console.log("oszlop " + checkColumnForThree())
            setTimeout(()=>{
                if (checkForMatches()) {
                    console.log("jó")
                    moveDown()
                    // There is a match, so leave the new colors of the gems as they are
                }

                // reset first and second square variables
                firstSquare = null
                secondSquare = null
            },100)
            console.log(squares)

        }else {
            const hush = new Audio('sounds/no-good.mp3');
            hush.volume=0.7
            hush.play()
        }



    }
    // setInterval(() => {
    //     for(let i = 0; i < squaresclick.length; i++){
    //         if(squaresclick[i] !== squaresdrag[i]){
    //             console.log(`Element ${i+1} is different: ${squaresclick[i]} !== ${squaresdrag[i]}`);
    //         }else {
    //             console.log("ugyanaz1")
    //         }
    //     }
    //     console.log("ugyanaz2")
    //
    // }, 1000);

    function checkForAdjacent(firstsquare, secondsquare) {
        const index1 = squares.indexOf(firstsquare)
        const index2 = squares.indexOf(secondsquare)
        const diff = Math.abs(index1 - index2)
        const isAdjacentCol = (diff === width)
        const isAdjacentRow = (diff === 1 && Math.floor(index1 / width) === Math.floor(index2 / width))
        return isAdjacentCol || isAdjacentRow
    }
    function checkForMatches() {
        return checkColumnForThree() || checkRowForThree()
    }

    //essenek le ha eltünt
    function moveDown(){
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

    //megnézni hogy mikor van 3 egyforma egy sorban
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''


            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
            if (notValid.includes(i)) {
                console.log("tovább lép")
                continue
            }
            console.log("blank "+isBlank)
            if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                console.log("belép ha jó")
                score += 5
                scoreDisplay.innerHTML = score
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''

                })
                console.log(decidedColor, "jó nagyon sor")
                return true
            } else {
                return false
            }

        }
    }
    //megnézni hogy mikor van 3 egyforma egy oszlopban
    function checkColumnForThree(){
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i+width, i+width*2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)){
                score += 5
                scoreDisplay.innerHTML = score
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = ''

                })
                console.log(decidedColor, "jó nagyon oszlop")

                return true
            }else {
                return false
            }

        }
    }




})