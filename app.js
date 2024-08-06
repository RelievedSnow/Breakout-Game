const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const startButton = document.querySelector('#start-button')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 670
const boardHeight = 300
const ballDiameter = 20
let timerId
let xDirection = -2
let yDirection = 2
let score = 0
let level = 1
let ballSpeed = 20

const userStart = [280, 10]
let currentPosition = userStart

const ballStart = [320, 40]
let ballCurrentPosition = ballStart

//create Block 
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

//all my blocks
let blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(560, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(560, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
    new Block(560, 210)
]

//draw all my blocks
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}

//clear all blocks
function clearBlocks(){
    const allblocks = Array.from(document.querySelectorAll('.block'))
    allblocks.forEach(block => block.remove())
}

//add user
const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)

//draw user 
function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

//draw the ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

//move user
function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10
                drawUser()
            }
            break;
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth) {
                currentPosition[0] += 10
                drawUser()
            }
            break;
    }
}

document.addEventListener('keydown', moveUser)

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

//move the ball
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

function startGame() {
    resetGame()
    addBlocks()
    document.addEventListener('keydown', moveUser)
    timerId = setInterval(moveBall, ballSpeed)
    startButton.removeEventListener('click', startGame) // Prevent multiple starts
}

//reset Game

function resetGame(){
    clearInterval(timerId)
    clearBlocks()
    blocks = [
        new Block(10, 270),
        new Block(120, 270),
        new Block(230, 270),
        new Block(340, 270),
        new Block(450, 270),
        new Block(560, 270),
        new Block(10, 240),
        new Block(120, 240),
        new Block(230, 240),
        new Block(340, 240),
        new Block(450, 240),
        new Block(560, 240),
        new Block(10, 210),
        new Block(120, 210),
        new Block(230, 210),
        new Block(340, 210),
        new Block(450, 210),
        new Block(560, 210)
    ]
    ballCurrentPosition = ballStart
    currentPosition = userStart
    score = 0
    level = 1
    ballspeed = 20
    xDirection = -2
    yDirection = 2
    scireDisplay.innerHTML = score
    drawUser()
    drawBall()
}

//next Level

function nextLevel() {
    level++
    ballSpeed = Math.max(5, ballSpeed - 3) // Decrease the ballSpeed by 3, but not lower than 5
    clearInterval(timerId)
    startGame()
}

//check collisions
function checkForCollisions() {
    //check for block collisions
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            changeDirection()
            score++
            scoreDisplay.innerHTML = score

            //check for win
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
                startButton.innerHTML = "Next Level"
                startButton.addEventListener('click', nextLevel)
            }
        }
    }

    //check for wall collisions
    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
    ) {
        changeDirection()
    }

    //check for user collisions
    if (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ) {
        changeDirection()
    }

    //check for game over 
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'You Lose'
        startButton.innerHTML = "Restart"
        startButton.addEventListener('click', startGame)
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}

startButton.addEventListener('click', startGame)

