let ListaOriginalEquipos = {
  "sm_state_GB": { "nombre": "GB" , "color": "#FF5733"},
  "sm_state_SE": { "nombre": "SE" , "color": "#33FF57"},
  "sm_state_UA": { "nombre": "UA" , "color": "#3366FF"},
  "sm_state_SI": { "nombre": "SI" , "color": "#A93226"},
  "sm_state_SK": { "nombre": "SK" , "color": "#FFCE63"},
  "sm_state_MK": { "nombre": "MK" , "color": "#0B3C49"},
  "sm_state_CY": { "nombre": "CY" , "color": "#982136"},
  "sm_state_RS": { "nombre": "RS" , "color": "#77D970"},
  "sm_state_MD": { "nombre": "MD" , "color": "#6E45E2"},
  "sm_state_ME": { "nombre": "ME" , "color": "#FF7F00"},
  "sm_state_ES": { "nombre": "ES" , "color": "#1A936F"},
  "sm_state_IE": { "nombre": "IE" , "color": "#DDA15E"},
  "sm_state_AT": { "nombre": "AT" , "color": "#865680"},
  "sm_state_CZ": { "nombre": "CZ" , "color": "#F4C542"},
  "sm_state_IT": { "nombre": "IT" , "color": "#00818A"},
  "sm_state_AL": { "nombre": "AL" , "color": "#D44919"},
  "sm_state_IS": { "nombre": "IS" , "color": "#5B8B2A"},
  "sm_state_EE": { "nombre": "EE" , "color": "#007991"},
  "sm_state_AD": { "nombre": "AD" , "color": "#EA5C5A"},
  "sm_state_CH": { "nombre": "CH" , "color": "#FFC512"},
  "sm_state_XK": { "nombre": "XK" , "color": "#3C53A3"},
  "sm_state_PL": { "nombre": "PL" , "color": "#8E44AD"},
  "sm_state_RO": { "nombre": "RO" , "color": "#3498DB"},
  "sm_state_LU": { "nombre": "LU" , "color": "#28B463"},
  "sm_state_LT": { "nombre": "LT" , "color": "#E77F67"},
  "sm_state_LV": { "nombre": "LV" , "color": "#59ABE3"},
  "sm_state_LI": { "nombre": "LI" , "color": "#DFC95E"},
  "sm_state_TR": { "nombre": "TR" , "color": "#F39C12"},
  "sm_state_NO": { "nombre": "NO" , "color": "#27AE60"},
  "sm_state_PT": { "nombre": "PT" , "color": "#E74C3C"},
  "sm_state_NL": { "nombre": "NL" , "color": "#3498DB"},
  "sm_state_GR": { "nombre": "GR" , "color": "#28B463"},
  "sm_state_BY": { "nombre": "BY" , "color": "#D35400"},
  "sm_state_FI": { "nombre": "FI" , "color": "#F1C40F"},
  "sm_state_HU": { "nombre": "HU" , "color": "#3498DB"},
  "sm_state_BA": { "nombre": "BA" , "color": "#28B463"},
  "sm_state_DE": { "nombre": "DE" , "color": "#E74C3C"},
  "sm_state_HR": { "nombre": "HR" , "color": "#8E44AD"},
  "sm_state_DK": { "nombre": "DK" , "color": "#D35400"},
  "sm_state_BG": { "nombre": "BG" , "color": "#F1C40F"},
  "sm_state_FR": { "nombre": "FR" , "color": "#3498DB"},
  "sm_state_BE": { "nombre": "BE" , "color": "#28B463"}  
}

let FronterasOriginales = {
  'equipoA' : ['equipoB', 'equipoC'],
  'equipoB' : ['equipoA', 'equipoD'],
  'equipoC' : ['equipoA', 'equipoD'],
  'equipoD' : ['equipoB', 'equipoC'],
}

let Fronteras = {};
let Equipos = [];
let Atacante = null;
let Adversario = null;
let RuletaActiva = false;

function Nombre(equipo) {
  return ListaOriginalEquipos[equipo]['nombre'];
}
function Color(equipo) {
  return ListaOriginalEquipos[equipo]['color'];
}

function actualizarTablaEquipos() {
  let tabla = document.getElementById('tablaEquipos');
  var tbody = document.createElement('tbody');
  var anterior = tabla.tBodies[0]
  for (let index = 0; index < Equipos.length; index++) {
    const equipo = Equipos[index];
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let nombre = Nombre(equipo);
    td.innerHTML = nombre;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
  tabla.replaceChild(tbody, anterior)
}

function actualizarBotones() {
  let bmostrarAtacantes = 
  bseleccionarAtacante = 
  bmostrarAdversarios = 
  bseleccionarAdversario = 
  bmostrarPartido =
  biniciarCombate = true;
  if(!RuletaActiva){
    bmostrarAtacantes = false;
    bseleccionarAtacante = false;
    if (Boolean(Atacante)) bmostrarAdversarios = false;
    if (Boolean(Atacante) && !Boolean(Adversario)) bseleccionarAdversario = false;
    if (Boolean(Atacante) && !Boolean(Adversario)) bmostrarAdversarios = false;
    if (Boolean(Atacante) && Boolean(Adversario))  biniciarCombate = false;
    if (Boolean(Atacante) && Boolean(Adversario))  bmostrarPartido = false;
    if (Boolean(Atacante) && Boolean(Adversario))  bseleccionarAdversario = false;
  }

  document.getElementById('bmostrarAtacantes').disabled = bmostrarAtacantes;
  document.getElementById('bseleccionarAtacante').disabled = bseleccionarAtacante;
  document.getElementById('bmostrarAdversarios').disabled = bmostrarAdversarios;
  document.getElementById('bseleccionarAdversario').disabled = bseleccionarAdversario;
  document.getElementById('bmostrarPartido').disabled = bmostrarPartido;
  document.getElementById('biniciarCombate').disabled = biniciarCombate;

  document.getElementById('atacante').innerText = Atacante ? Nombre(Atacante) : 'Atacante';
  document.getElementById('adversario').innerText = Adversario ? Nombre(Adversario) : 'Adversario';
}

function iniciarJuego() {
  reiniciarJuego();
}
function reiniciarJuego() {
  Fronteras = FronterasOriginales;
  Equipos = Object.keys(ListaOriginalEquipos);
  actualizar();
}
function hayEquipos() {
  if(Equipos.length < 2) return false;
  return true;
}
function actualizar() {
  actualizarTablaEquipos();
  actualizarBotones();
  actualizarRuleta();
}
function mostrarAtacantes(){
  if (!hayEquipos()) return;
  Atacante = null;
  Adversario = null;
  actualizarRuleta();
}
function seleccionarAtacante(){
  if (!hayEquipos()) return;
  mostrarAtacantes();
  RuletaActiva = true;
  spineWheel();
}

function mostrarAdversarios(){
  if (!hayEquipos()) return;
  Adversario = null;
  actualizarRuleta();
}
function seleccionarAdversario(){
  if (!hayEquipos()) return;
  mostrarAdversarios();
  RuletaActiva = true;
  spineWheel();
}

function mostrarPartido() {
  if (!hayEquipos()) return;
  actualizarRuleta();
}
function iniciarCombate(){
  if (!hayEquipos()) return;
  RuletaActiva = true;
  spineWheel();
}

function actualizarRuleta() {
  if(!(typeof initRouletteWheel !== 'undefined')) return;
  if (!hayEquipos()) return;
  if(!RuletaActiva){
    if (!Boolean(Atacante)) {
      initRouletteWheel(Equipos);
    }
    if (Boolean(Atacante) && !Boolean(Adversario)) {
      if (Fronteras[Atacante].length == 1) {
        Adversario = Fronteras[Atacante][0];
      } else {
        initRouletteWheel(Fronteras[Atacante]);
      }
    }
    if (Boolean(Atacante) && Boolean(Adversario)) {
      initRouletteWheel([Atacante, Adversario]);
    }
  }
}

function eliminarEquipo(lista, equipo) {
  const index = lista.indexOf(equipo);
  if(index != -1) {
    lista.splice(index, 1);
  }
  return lista;
}

function reemplazarEquipo(lista, equipo1, equipo2) {
  const index = lista.indexOf(equipo1);
  if(index != -1) {
    lista.splice(index, 1);
    lista.push(equipo2);
    lista = lista.filter((item, pos) => lista.indexOf(item) === pos);
  }
  return lista;
}

function unirFronteras(lista1, lista2) {
  let c = lista1.concat(lista2);
  return c.filter((item, pos) => c.indexOf(item) === pos);
}

function finPartido(ganador) {
  let perdedor = ganador == Atacante ? Adversario : Atacante;
  Equipos = eliminarEquipo(Equipos, perdedor);
  for (let index = 0; index < Equipos.length; index++) {
    const equipo = Equipos[index];
    let fronteras = Fronteras[equipo];
    fronteras = reemplazarEquipo(fronteras, perdedor, ganador)
    if(equipo == ganador) {
      fronteras = unirFronteras(fronteras, Fronteras[perdedor]);
      fronteras = eliminarEquipo(fronteras, ganador);
    }
    Fronteras[equipo] = fronteras;
  }
  Atacante = null;
  Adversario = null;
  actualizarTablaEquipos();
  actualizarBotones();
  if(Equipos.length == 1) {
    // Campeon
  }
}

function finRuleta(equipo) {
  //
  if (!Boolean(Atacante)) {
    Atacante = equipo; 
    if(Fronteras[Atacante].length == 1) {
      Adversario = Fronteras[Atacante][0];
    }
  } else if (!Boolean(Adversario)) {
    Adversario = equipo;
  } else {
    finPartido(equipo);
  }
  RuletaActiva = false;
  actualizarBotones();
}
