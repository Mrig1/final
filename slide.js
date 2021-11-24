class Slide {
	constructor(tabImages, speed = 5000) {
		this.images = tabImages;
		this.speed = speed;
		this.index = 0;
		this.play = document.getElementById("play-slide");
		this.play.classList.add('invisible');
		this.pause = document.getElementById("pause");
		this.previous = document.getElementById("left");
		this.next = document.getElementById("right");
		this.slideAuto = null;
		this.slide = document.querySelector("#tutorial");
		this.displaySlide();
		this.intervalle = null;
		this.autoPlay();
		this.figure = document.querySelectorAll(".slide-velo");
		this.leftArrow();
		this.rightArrow();
		this.pauseSlide();
		this.playSlide();
		this.clavier();

	}
	// fait apparaître les images lorsqu'elles ont  la classe .active dans css
	displaySlide() {
		for (let i = 0; i < this.images.length; i++) {
			this.slide.innerHTML += `<figure class="slide-velo"><img src="${this.images[i]}" alt="f"/></figure>`;
		}
		let figure = document.querySelectorAll(".slide-velo");
		figure[this.index].classList.add('active')
	}
	//Cette méthode fait apparaitre les images les unes après les autres toutes les 5 secondes
	autoPlay() {
		this.intervalle = setInterval(() => {
			this.figure[this.index].classList.remove('active');
			this.index++;
			if (this.index === this.images.length) {
				this.index = 0
			};
			this.figure[this.index].classList.add('active')
		}, this.speed);
	}
	//faire fonctionner la flèche gauche pour revenir à l'image précédente
	leftArrow() {
		this.previous.addEventListener("click", () => {
			this.left();
		});
	}
	//faire fonctionner la flèche droite pour passer à l'image suivante
	rightArrow() {
		this.next.addEventListener("click", () => {
			this.right();
		});
	}
	//mettre le diaporama en pause
	pauseSlide() {
		this.pause.addEventListener("click", () => {
			this.pause.classList.add('invisible');
			this.play.classList.remove('invisible');
			clearInterval(this.intervalle);
		});
	}
	//reprendre le défilement des images après une pause
	playSlide() {
		this.play.addEventListener("click", () => {
			this.autoPlay();
			this.play.classList.add('invisible');
			this.pause.classList.remove('invisible');
		});
	}
	//utiliser les flèches gauche et droite du clavier pour voir les images précédentes ou suivantes
	clavier() {
		window.addEventListener("keydown", (event) => {
			let ctrl = event.key;

			if (ctrl === "ArrowLeft") {
				this.left();
			} else if (ctrl === "ArrowRight") {
				this.right();
			}
		})
	}
	//aller à l'image précédente 
	left() {
		this.figure[this.index].classList.remove('active');

		if (this.index == 0) {
			this.index = this.images.length - 1;
			this.figure[this.index].classList.add('active');
		} else {
			this.index--;
			this.figure[this.index].classList.add('active');
		}
	}
	//aller à l'image suivante
	right() {
		this.figure[this.index].classList.remove('active');
		this.index++;

		if (this.index === this.images.length) {
			this.index = 0
		};
		this.figure[this.index].classList.add('active');
	}
}