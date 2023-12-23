const collisionsMapForest = []
for (let i = 0; i < collisionsForest.length; i += 64) {
	collisionsMapForest.push(collisionsForest.slice(i, i + 64))
}

const battleZoneMapForest = []
for (let i = 0; i < battleZoneForest.length; i += 64) {
	battleZoneMapForest.push(battleZoneForest.slice(i, i + 64))
}

const boundariesForest = []

const offsetForest = {
	x: -4000,
	y: -3000,
}

collisionsMapForest.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 1076)
			boundariesForest.push(
				new Boundary({
					position: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y,
					},
				})
			)
	})
})

const battleZonesForest = []

battleZoneMapForest.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 1067)
			battleZonesForest.push(
				new Boundary({
					position: {
						x: j * Boundary.width + offset.x,
						y: i * Boundary.height + offset.y,
					},
				})
			)
	})
})

const imageForest = new Image()
image.src = "./images/forest-map.png"

const foregroundImageForest = new Image()
foregroundImage.src = "./images/foreground-forest-map.png"

const backgroundForest = new Sprite({
	position: {
		x: offsetForest.x,
		y: offsetForest.y,
	},
	image: imageForest,
})

const foregroundForest = new Sprite({
	position: {
		x: offsetForest.x,
		y: offsetForest.y,
	},
	image: foregroundImageForest,
})

let animationForestId

function aniamteForestMap() {
	const animationForestId = window.requestAnimationFrame(animate)
	backgroundForest.draw()

	boundariesForest.forEach(boundary => {
		boundary.draw()
	})
	battleZonesForest.forEach(square => {
		square.draw()
	})

	player.position = {
		x: -4000,
		y: -3000,
	}
}
