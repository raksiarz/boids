const canvas = document.getElementById('game')
const dropdown = document.querySelector('select')
const ctx = canvas.getContext("2d")

canvas.width = Number(1024)
canvas.height = Number(576)

ctx.fillRect(0, 0, canvas.width, canvas.height)

class Vector extends Array {
  constructor(x, y) {
    super(x, y)
  }

  dir() {
    let angle= Math.atan(this[1] / this[0])

    if (this[0] > 0 && this[1] < 0) {
      angle += Math.PI * 2
    }
    if (this[0] < 0 && this[1] < 0) {
      angle += Math.PI
    }
    if (this[0] < 0 && this[1] > 0) {
      angle += Math.PI
    }

    angle += Math.PI / 2

    return angle
  }
}

class Agent {
  width
  height
  xVec
  yVec
  speed
  vector
  constructor(position) {
    this.position = position
    this.width = 10
    this.height = 14
    this.xVec = Math.random() * (1 + 1) - 1
    this.yVec = Math.random() * (1 + 1) - 1
    this.speed = 1.1
    this.vector = new Vector(this.xVec, this.yVec)
  }

  draw() {
    const agentImage = new Image()
    agentImage.src = './sprites/berd.png'
    let angle= Math.atan(this.yVec / this.xVec)

    if (this.xVec > 0 && this.yVec < 0) {
      angle += Math.PI * 2
    }
    if (this.xVec < 0 && this.yVec < 0) {
      angle += Math.PI
    }
    if (this.xVec < 0 && this.yVec > 0) {
      angle += Math.PI
    }

    angle += Math.PI / 2

    ctx.save();
    ctx.translate(this.position.x + (this.width / 2), this.position.y + (this.height / 2));
    ctx.rotate(angle);
    ctx.translate(-(this.position.x + (this.width / 2)), -(this.position.y + (this.height / 2)));
    ctx.drawImage(agentImage, this.position.x, this.position.y, this.width, this.height);
    ctx.restore();
  }

  update() {
    this.draw()
    this.checkForBounds()
    this.obstacleAvoidance()
    this.calculateDirection()
  }

  calculateDirection() {
    const length = Math.sqrt(Math.pow(this.xVec, 2) + Math.pow(this.yVec, 2))
    this.xVec = (this.xVec / length)
    this.yVec = (this.yVec / length)
    this.position.x += this.xVec * this.speed
    this.position.y += this.yVec * this.speed
  }

  checkForBounds() {
    if (this.position.x < 0) {
      this.position.x = canvas.width
    }
    if (this.position.x > canvas.width) {
      this.position.x = 0
    }
    if (this.position.y < 0) {
      this.position.y = canvas.height
    }
    if (this.position.y > canvas.height) {
      this.position.y = 0
    }
  }

  obstacleAvoidance() {
    let minimal = 9999
    const positionToClosest = {}
    for (let i = 0; i < agents.length; ++i) {
      const distance = Math.sqrt(Math.pow((agents[i].position.x - this.position.x), 2) + Math.pow((agents[i].position.y - this.position.y), 2))
      if (distance < minimal && distance !== 0) {
        minimal = distance
        positionToClosest.x = agents[i].position.x
        positionToClosest.y = agents[i].position.y
        positionToClosest.xVec = agents[i].xVec
        positionToClosest.yVec = agents[i].yVec
      }
    }

    if (minimal < 100) {
      ctx.beginPath()
      ctx.moveTo(this.position.x + (this.width / 2), this.position.y + (this.height / 2))
      ctx.lineTo(positionToClosest.x + (this.width / 2), positionToClosest.y + (this.height / 2))
      ctx.strokeStyle = 'green';
      // ctx.stroke()

      const force = 1 / minimal
     
      const closestDistanceX = this.xVec - positionToClosest.xVec
      const closestDistanceY = this.yVec - positionToClosest.yVec

      const forceXVec = (closestDistanceX) * force
      const forceYVec = (closestDistanceY) * force

      this.xVec = this.xVec - forceXVec
      this.yVec = this.yVec - forceYVec
    }
  }
}

const agents = []

dropdown.addEventListener("change", (e) => {
  const number = e.target.value
  for (let i = 0; i < number; ++i) {
    const newAgent = new Agent({ x: Math.random() * (1010 - 0) + 0, y: Math.random() * (560 - 0) + 0 })
    agents.push(newAgent)
  }
})

function animate() {
  window.requestAnimationFrame(animate)
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for(let i = 0; i < agents.length; ++i) {
    agents[i].update()
  }
}

animate()