class Map {
    constructor(lat, lng) {
        this.carte = null;
        this.latitude = lat;
        this.longitude = lng;
        this.nomStation = document.getElementById("station");
        this.adresse = document.getElementById("adresse");
        this.totalPlace = document.getElementById("nbre-places");
        this.velosDispo = document.getElementById("nbre-velos-dispo");
        this.canvas = document.getElementById("canvas");
        this.initialize();
        if (sessionStorage.getItem("tempsRestant")) {
            this.timer();
        }
        this.formulaire();
    }
    //permet de faire apparaitre la carte (Marseille) et d'afficher toutes ses données (les stations) grâce à l'api JC DEcaux.
    initialize() {
        this.carte = L.map('Marseille').setView([this.latitude, this.longitude], 14);
        let osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        });
        this.carte.addLayer(osmLayer);
        fetch('https://api.jcdecaux.com/vls/v1/stations?contract=Marseille&apiKey=7162101df468818b1a47c0a7a8e2095c1cd11dd5')
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    let station = [element.position.lat, element.position.lng];
                    let marker = L.marker(station).addTo(this.carte);
                    marker.addEventListener("click", () => {
                        this.nomStation.innerHTML = element.name;
                        this.adresse.innerHTML = "adresse: " + element.address;
                        this.totalPlace.innerHTML = "nombre de places: " + element.bike_stands;
                        this.velosDispo.innerHTML = "Vélos disponibles: " + element.available_bikes;
                        this.velosDispo.dataset.bikesAvailable = element.available_bikes;
                        document.getElementById("registration").style.display = "block";
                        document.getElementById("signer").style.display = "none";
                    });
                })
            })
    }
    //permet de faire demarrer le compteur avec timer() ou de l'arrêter avec annuler()
    timer() {
        let name = document.getElementById("nom");
        let surname = document.getElementById("prenom");
        let chrono = 20 * 60 * 1000;
        if (sessionStorage.getItem("tempsRestant")) {
            chrono = parseInt(sessionStorage.getItem("tempsRestant"), 10);
        }
        let annuler = document.getElementById("cancel");
        let infoUser = document.getElementById("messageUser");
        let currentDate = new Date().getTime();
        let deadline = currentDate + chrono;
        let countdown = setInterval(() => {
            let timeleft = deadline - currentDate;
            let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            let secondes = Math.floor((timeleft % (1000 * 60)) / 1000);
            sessionStorage.setItem("tempsRestant", timeleft);

            if (timeleft > 0) {
                currentDate = currentDate + 1000;
                infoUser.innerHTML = `Vélo réservé à la station ${sessionStorage.getItem("nomStation")} par ${localStorage.getItem("nom")} ${localStorage.getItem("prenom")} Temps restant: ${minutes} min et ${secondes} s`;
                document.getElementById("cancel").style.display = "block";
                document.getElementById("inscription").style.display = "none";
            } else {
                clearInterval(countdown);
                infoUser.innerHTML = `Vélo réservé à la station ${sessionStorage.getItem("nomStation")} par ${localStorage.getItem("nom")} ${localStorage.getItem("prenom")} : session expirée `
            }
            annuler.onclick = (event) => {
                event.preventDefault();
                console.log("annulation");
                infoUser.innerHTML = `Votre réservation à la station ${sessionStorage.getItem("nomStation")} est annulée`;
                clearInterval(countdown);
                sessionStorage.removeItem('tempsRestant', timeleft);
                document.getElementById("cancel").style.display = "none";
                document.getElementById("inscription").style.display = "block";
                document.getElementById("reserver").style.display = "block";
            }
        }, 1000)
    }
    //Le clic sur "reserver" permet l'apparition du canvas pour le signer, aux conditions qu'un vélo soit disponible et le formulaire correctement rempli; la signature et le clic sur le bouton "enregistrer" déclenchent timer()
    formulaire() {

        let reserver = document.getElementById("reserver");
        let formulaire = document.getElementById("registration");
        let annuler = document.getElementById("cancel");
        let fields = document.getElementsByTagName("form");
        let infoUser = document.getElementById("messageUser");
        let currentDate = new Date().getTime();
        let enregistrer = document.getElementById("enregistrer");
        reserver.onclick = (event) => {
        // but de l'événement: récupérer les données de la carte et du formulaire pour les stocker en sessionStorage pour le nom de la station et en localStorage pour les nom et prénom de l'utilisateur.
            event.preventDefault();
            let name = document.getElementById("nom");
            let surname = document.getElementById("prenom");
            sessionStorage.setItem("nomStation", this.nomStation.textContent);
            localStorage.setItem("nom", name.value);
            localStorage.setItem("prenom", surname.value);
          
            if (this.velosDispo.dataset.bikesAvailable < 1) {
                infoUser.innerHTML = `Aucun vélo n'est disponible pour le moment à la station ${this.nomStation.textContent}, réessayez plus tard`;
            } else if (name.checkValidity() && surname.checkValidity() && this.velosDispo.dataset.bikesAvailable) {
                document.getElementById("signer").style.display = "block";
            } else {infoUser.innerHTML = `Champ invalide: Commencez par une majuscule et ne dépassez pas 15 caractères.`;
            }
        }
        //but de l'événement: la signature suivie du clic sur le bouton "enregistrer" doivent déclencher le Timer et faire apparaitre un message dans le footer avec le bouton annuleren dessous; en l'absence de signature, un message apparait dans le footer et le timer ne démarre pas.
        enregistrer.onclick = (event) => {
            if (maToile.initX != 0) {
                let chrono = 20 * 60 * 1000;
                this.timer();
                document.getElementById("cancel").style.display = "block";
                document.getElementById("registration").style.display = "none";
            } else if (maToile.initX == 0) {
                infoUser.innerHTML = `veuillez signer le formulaire.`;
            }
        }
        //L'événement clearCanvas permet d'effacer la signature sur le canvas.
        let clearCanvas = document.getElementById("effacer")
        clearCanvas.onclick = (event) => {
            maToile.effacer()
        }
    }
}