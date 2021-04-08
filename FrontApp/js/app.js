// URL vers l'API
const API = "http://localhost:8001";
//Lucas : const API = "http://localhost/affichage_dyn/mediascreen_ezcorp/API/public/index.php";

// Récuperer le token dans le local storage
let token = localStorage.getItem('token');

// Element HTML "body"
let body = document.querySelector("body");

// Instanciation du convertisseur MarkDown -> HTML
let converter = new showdown.Converter();
let timer = 0;
let index = 0;

if(token == null || token == '') {
    document.location.href = 'index.html';
} else {
    // Récupération des écrans appartenant à une séquence donnée
    fetch(API + "/get/" + token)
    .then(response => response.json())
    .then(function (screens) {
        // Si la séquence ne contient pas d'écran(s)
        if(screens.length < 1) {
            document.location.href = '/';
        // Sinon si le token est invalide
        } else if('Error' in screens) {
            alert('Token invalide !');
            localStorage.removeItem('token');
            document.location.href = '/';
        } else {
            wait(screens[index].contenu, screens[index].temps, screens, screens[index].id_type);
        }
    });
}

// Fonction permettant d'attendres X secondes avant de passer à l'écran suivant
function wait(contenu, temps, screens, id_type) {
    if(id_type == 1) {
        body.innerHTML = converter.makeHtml(contenu);
    } else {
        body.innerHTML = "<iframe src='https://www.youtube.com/embed/" + contenu + "?rel=0&autoplay=1&mute=1' frameborder='0' allowfullscreen></iframe>";
    }
    setTimeout(function() {
        if(screens[index + 1]) {
          index++;
        } else {
          index = 0;
          refresh();
        }
        wait(screens[index].contenu, screens[index].temps, screens, screens[index].id_type);
    }, temps);
}

// Rafraichissement de la page
function refresh() {
    window.location.reload();
}
