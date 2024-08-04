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

const userStart = [280, 10]
let currentPosition = userStart

const ballStart = [320, 40]
let ballCurresntPosition = ballStart

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
const blocks = [
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
    ball.style.left = ballCurresntPosition[0] + 'px'
    ball.style.bottom = ballCurresntPosition[1] + 'px'
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

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

//move the ball
function moveBall() {
    ballCurresntPosition[0] += xDirection
    ballCurresntPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

function startGame() {
    addBlocks()
    document.addEventListener('keydown', moveUser)
    timerId = setInterval(moveBall, 20)
    startButton.removeEventListener('click', startGame) // Prevent multiple starts
}

//check collisions
function checkForCollisions() {
    //check for block collisions
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurresntPosition[0] > blocks[i].bottomLeft[0] && ballCurresntPosition[0] < blocks[i].bottomRight[0]) &&
            ((ballCurresntPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurresntPosition[1] < blocks[i].topLeft[1])
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
            }
        }
    }

    //check for wall collisions
    if (ballCurresntPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurresntPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurresntPosition[0] <= 0
    ) {
        changeDirection()
    }

    //check for user collisions
    if (
        (ballCurresntPosition[0] > currentPosition[0] && ballCurresntPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurresntPosition[1] > currentPosition[1] && ballCurresntPosition[1] < currentPosition[1] + blockHeight)
    ) {
        changeDirection()
    }

    //check for game over 
    if (ballCurresntPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'You Lose'
        document.removeEventListener('keydown', moveUser)
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

