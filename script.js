const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576 // tutaj powinno być 768

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 64) {
	collisionsMap.push(collisions.slice(i, i + 64))
}

const battleZoneMap = []
for (let i = 0; i < battleZoneData.length; i += 64) {
	battleZoneMap.push(battleZoneData.slice(i, i + 64))
}

const boundaries = []

const offset = {
	x: -645,
	y: -450,
}

collisionsMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 167)
			boundaries.push(
				new Boundary({
					position: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y,
					},
				})
			)
	})
})

const battleZones = []

battleZoneMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 167)
			battleZones.push(
				new Boundary({
					position: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y,
					},
				})
			)
	})
})

const image = new Image()
image.src = "./images/background.png"

const foregroundImage = new Image()
foregroundImage.src = "./images/foregroundObjects.png"

const playerUpImage = new Image()
playerUpImage.src = "./images/playerUp.png"

const playerLeftImage = new Image()
playerLeftImage.src = "./images/playerLeft.png"

const playerDownImage = new Image()
playerDownImage.src = "./images/playerDown.png"

const playerRightImage = new Image()
playerRightImage.src = "./images/playerRight.png"

const player = new Sprite({
	position: {
		x: canvas.width / 2 - 192 / 4 / 2,
		y: canvas.height / 2 - 68 / 2 - 50,
	},
	image: playerDownImage,
	frames: {
		max: 4,
		hold: 10,
	},
	sprites: {
		up: playerUpImage,
		left: playerLeftImage,
		down: playerDownImage,
		right: playerRightImage,
	},
})

const background = new Sprite({
	position: {
		x: offset.x,
		y: offset.y,
	},
	image: image,
})

const foreground = new Sprite({
	position: {
		x: offset.x,
		y: offset.y,
	},
	image: foregroundImage,
})

const keys = {
	w: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
	s: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
}

const movables = [background, foreground, ...boundaries, ...battleZones]
function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
		rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
		rectangle1.position.y + rectangle1.height >= rectangle2.position.y
	)
}

const battle = {
	initiated: false,
}

function animate() {
	const animationId = window.requestAnimationFrame(animate)
	background.draw()
	boundaries.forEach(boundary => {
		boundary.draw()
	})
	battleZones.forEach(square => {
		square.draw()
	})

	player.draw()
	foreground.draw()

	let moving = true
	player.animate = false

	console.log(animationId)
	if (battle.initiated) return

	// active a battle
	if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
		for (let i = 0; i < battleZones.length; i++) {
			const battleZone = battleZones[i]
			const overlappingArea =
				(Math.min(
					player.position.x + player.width,
					battleZone.position.x + battleZone.width
				) -
					Math.max(player.position.x, battleZone.position.x)) *
				(Math.min(
					player.position.y + player.height,
					battleZone.position.y + battleZone.height
				) -
					Math.max(player.position.y, battleZone.position.y))
			if (
				rectangularCollision({
					rectangle1: player,
					rectangle2: battleZone,
				}) &&
				overlappingArea > (player.width * player.height) / 2 &&
				Math.random() < 0.01
			) {
				console.log("active battle")

				// deactive current animation loop
				window.cancelAnimationFrame(animationId)

				audio.Map.stop()
				audio.initBattle.play()
				audio.battle.play()
				battle.initiated = true
				gsap.to("#overlappingDiv", {
					opacity: 1,
					repeat: 3,
					yoyo: true,
					duration: 0.4,
					onComplete() {
						gsap.to("#overlappingDiv", {
							opacity: 1,
							duration: 0.4,
							onComplete() {
								// active a new animation loop
								initBattle()
								animateBattle()
								gsap.to("#overlappingDiv", {
									opacity: 0,
									duration: 0.4,
								})
							},
						})
					},
				})
				break
			}
		}
	}

	if (keys.w.pressed && lastKey === "w") {
		player.image = player.sprites.up
		player.animate = true

		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x,
							y: boundary.position.y + 3,
						},
					},
				})
			) {
				console.log("colliding")
				moving = false
				break
			}
		}

		if (moving)
			movables.forEach(movable => {
				movable.position.y += 3
			})
	} else if (keys.a.pressed && lastKey === "a") {
		player.image = player.sprites.left
		player.animate = true
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x + 3,
							y: boundary.position.y,
						},
					},
				})
			) {
				console.log("colliding")
				moving = false
				break
			}
		}

		if (moving)
			movables.forEach(movable => {
				movable.position.x += 3
			})
	} else if (keys.s.pressed && lastKey === "s") {
		player.image = player.sprites.down
		player.animate = true
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x,
							y: boundary.position.y - 3,
						},
					},
				})
			) {
				console.log("colliding")
				moving = false
				break
			}
		}

		if (moving)
			movables.forEach(movable => {
				movable.position.y -= 3
			})
	} else if (keys.d.pressed && lastKey === "d") {
		player.image = player.sprites.right
		player.animate = true
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x - 3,
							y: boundary.position.y,
						},
					},
				})
			) {
				console.log("colliding")
				moving = false
				break
			}
		}

		if (moving)
			movables.forEach(movable => {
				movable.position.x -= 3
			})
	}
}
// animate()

let lastKey = ""

window.addEventListener("keydown", e => {
	switch (e.key) {
		case "w":
			keys.w.pressed = true
			lastKey = "w"
			break
		case "a":
			keys.a.pressed = true
			lastKey = "a"
			break
		case "s":
			keys.s.pressed = true
			lastKey = "s"
			break
		case "d":
			keys.d.pressed = true
			lastKey = "d"
			break
	}
})

window.addEventListener("keyup", e => {
	switch (e.key) {
		case "w":
			keys.w.pressed = false
			break
		case "a":
			keys.a.pressed = false
			break
		case "s":
			keys.s.pressed = false
			break
		case "d":
			keys.d.pressed = false
			break
	}
})

let clicked = false
addEventListener("click", () => {
	if (!clicked) {
		audio.Map.play()
	}
	clicked = true
})
