const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./images/battleBackground.png"

const battleBackground = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	image: battleBackgroundImage,
})
let draggle
let emby
let renderedSprites
let battleAnimationId
let queue

function initBattle() {
	document.querySelector("#user-info").style.display = "block"
	document.querySelector("#dialogue").style.display = "none"
	document.querySelector("#enemy-health-bar").style.width = "100%"
	document.querySelector("#emby-health-bar").style.width = "100%"
	document.querySelector("#attacks-box").replaceChildren()
	draggle = new Monster(monsters.Draggle)
	console.log(monsters)
	emby = new Monster(monsters.Emby)
	renderedSprites = [draggle, emby]
	queue = []

	emby.attacks.forEach(attack => {
		const button = document.createElement("button")
		button.innerHTML = attack.name
		document.querySelector("#attacks-box").append(button)
	})

	document.querySelectorAll("button").forEach(button => {
		button.addEventListener("click", e => {
			const selectedAttack = attacks[e.currentTarget.innerHTML]
			emby.attack({
				attack: selectedAttack,
				recipient: draggle,
				renderedSprites,
			})

			if (draggle.health <= 0) {
				queue.push(() => {
					draggle.faint()
				})
				queue.push(() => {
					gsap.to("#battle-area", {
						opacity: 1,
						onComplete: () => {
							cancelAnimationFrame(battleAnimationId)
							animate()
							document.querySelector("#user-info").style.display = "none"
							gsap.to("#battle-area", {
								opacity: 0,
							})
							battle.initiated = false
						},
					})
				})
			}
			const randomAttack =
				draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

			queue.push(() => {
				draggle.attack({
					attack: randomAttack,
					recipient: emby,
					renderedSprites,
				})
			})

			if (emby.health <= 0) {
				queue.push(() => {
					emby.faint()
				})
				queue.push(() => {
					gsap.to("#battle-area", {
						opacity: 1,
						onComplete: () => {
							cancelAnimationFrame(battleAnimationId)
							animate()
							document.querySelector("#user-info").style.display = "none"
							gsap.to("#battle-area", {
								opacity: 0,
							})
							battle.initiated = false
						},
					})
				})
			}
		})

		button.addEventListener("mouseenter", e => {
			const selectedAttack = attacks[e.currentTarget.innerHTML]
			document.querySelector("#attackType").innerHTML = selectedAttack.type
			document.querySelector("#attackType").style.color = selectedAttack.color
		})
	})
}

function animateBattle() {
	battleAnimationId = window.requestAnimationFrame(animateBattle)
	battleBackground.draw()

	console.log(battleAnimationId)

	renderedSprites.forEach(sprite => {
		sprite.draw()
	})
}
animate()

// initBattle()
// animateBattle()

// const tackleBtn = document.getElementById("tackle")
// const fireballBtn = document.getElementById("fireball")

document.querySelector("#dialogue").addEventListener("click", e => {
	if (queue.length > 0) {
		queue[0]()
		queue.shift()
	} else {
		e.currentTarget.style = "none"
		console.log("clicked dialogue")
	}
})
