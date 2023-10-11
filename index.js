let ListaOriginalEquipos = {
  'equipoA' : { 'nombre': "Equipo 1", 'color': '#eeeeee'},
  'equipoB' : { 'nombre': "Equipo 2", 'color': '#eeeeee'},
  'equipoC' : { 'nombre': "Equipo 3", 'color': '#eeeeee'},
  'equipoD' : { 'nombre': "Equipo 4", 'color': '#eeeeee'},
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
