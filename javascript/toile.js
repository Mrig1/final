class Toile {
    constructor() {
        this.signer = false; // n'est pas en train de signer
        this.initX = 0; // coordonnée X avant de cliquer pour signer (pas de tracé)
        this.initY = 0; // coordonnée Y avant de cliquer pour signer
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.strokeStyle = 'black';
        this.ctx.linewidth = 2;
        this.canvas.addEventListener("mousedown", (e) => {
            this.signer = true; // est en train de signer
            this.initX = e.clientX - this.canvas.offsetLeft; //position de x moins nombre de pixel sur horizontale x (au départ du clic)
            this.initY = e.pageY - this.canvas.offsetTop
        });
        //indique un mouvement de la souris pour signer, le but étant de récuperer les coordonnées du tracé sur le canvas
        this.canvas.addEventListener("mousemove", (e) => {
            if (this.signer == true) {
                let currX = e.clientX - this.canvas.offsetLeft; // recupérer les nouvelles coordonnées
                let currY = e.pageY - this.canvas.offsetTop;
                this.draw(this.initX, this.initY, currX, currY) //tracé entre point de départ et les nouvelles coordonnées
                this.initX = currX;
                this.initY = currY;
            }
        });
        //le pointeur se trouve sur le canvas mais il n'y a aucune pression sur le bouton de la souris permettant un quelconque tracé
        this.canvas.addEventListener("mouseup", () => {
            this.signer = false;
        })
        //le pointeur de la souris se trouve en dehors du canvas, la signature est impossible
        this.canvas.addEventListener("mouseout", () => {
            this.signer = false
        })
    }

    draw(fromX, fromY, toX, toY) { // methode pour dessiner c'est à dire pour tracer d'un point à un autre
        this.ctx.beginPath(); // commence le tracé
        this.ctx.moveTo(fromX, fromY); //point de depart
        this.ctx.lineTo(toX, toY); //point d'arrivée du tracé
        this.ctx.closePath(); // stoppe le tracé message 
        this.ctx.stroke(); 
    }
    //Méthode pour effacer la signature
    effacer() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

}