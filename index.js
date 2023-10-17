import {PaisesOriginalEquipos, PaisesFronterasOriginales} from "./paises.js?3";

let ListaOriginalEquipos = PaisesOriginalEquipos;


let FronterasOriginales = PaisesFronterasOriginales;


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
function agregarCelda(tr, equipo) {
  let c  = document.createElement('td');
  let td = document.createElement('td');
  let nombre = Nombre(equipo);
  td.innerHTML = nombre;
  c.classList.add('td_equipo');
  c.classList.add('td_'+equipo);
  tr.appendChild(c);
  tr.appendChild(td);
}
function actualizarTablaEquipos() {
  let tabla = document.getElementById('tablaEquipos');
  let tbody = document.createElement('tbody');
  let anterior = tabla.tBodies[0]
  for (let index = 0; index < Equipos.length; index++) {
    const equipo = Equipos[index];
    let tr = document.createElement('tr');
    agregarCelda(tr, equipo);
    tbody.appendChild(tr);
  }
  tabla.replaceChild(tbody, anterior)
}
function agregarPartidoTabla(ganador, perdedor) {
  let tbody = document.getElementById("tbodyPartidos");
  let tr = document.createElement('tr');
  agregarCelda(tr, ganador);
  agregarCelda(tr, perdedor);
  tbody.appendChild(tr);
}
function actualizarBotones() {
  let bmostrarAtacantes      = true;
  let bseleccionarAtacante   = true;
  let bmostrarAdversarios    = true;
  let bseleccionarAdversario = true;
  let bmostrarPartido        = true;
  let biniciarCombate        = true;
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
  let colores = document.getElementById('colores').sheet;
  Equipos.forEach(equipo => {
    let color = Color(equipo);
    let regla = '.'+equipo+' {fill: '+color+';}';
    colores.insertRule(regla);
    regla = '.td_'+equipo+' {background: '+color+';}';
    colores.insertRule(regla);
  });
}
function reiniciarJuego() {
  Fronteras = FronterasOriginales;
  Equipos = Object.keys(ListaOriginalEquipos);
  
  let EquiposconFronteras = [];
  for (const equipo in Fronteras) {
    if (Object.hasOwnProperty.call(Fronteras, equipo)) {
      const element = Fronteras[equipo];
      EquiposconFronteras.push(equipo);
      for (let index = 0; index < element.length; index++) {
        const equi = element[index];
        const jj = Equipos.indexOf(equi);
        if (jj == -1) {
          console.log('pais no definido ', equi);
        }
      }
    }
  }
  let sinFronteras = [];
  for (let index = 0; index < Equipos.length; index++) {
    const equi = Equipos[index];
    const jj = EquiposconFronteras.indexOf(equi);
    if (jj == -1) {
      console.log('pais sin fronteras ', equi);
      sinFronteras.push(equi);
    }
  }
  let newFronteras = {};
  for (let ii = 0; ii < sinFronteras.length; ii++) {
    const equi = sinFronteras[ii];
    newFronteras[equi] = [];
    for (const equipo in Fronteras) {
      if (Object.hasOwnProperty.call(Fronteras, equipo)) {
        const element = Fronteras[equipo];
        const jj = element.indexOf(equi);
        if (jj != -1) {
          //console.log('agregar ', equipo, ' a ', equi)
          newFronteras[equi].push(equipo)
        }
      }
    }
  }
  let missing = {}
  for (const equipo in Fronteras) {
    if (Object.hasOwnProperty.call(Fronteras, equipo)) {
      const fronteras = Fronteras[equipo];
      for (let index = 0; index < fronteras.length; index++) {
        const equi = fronteras[index];
        const front = Fronteras[equi];
        const jj = front.indexOf(equipo);
        if (jj == -1) {
          if (!missing.hasOwnProperty(equi)) {
            missing[equi] = [];
          }
          missing[equi].push(equipo);
        }
      }
    }
  }
  for (const equipo in missing) {
    if (Object.hasOwnProperty.call(missing, equipo)) {
      const fronteras = missing[equipo];
      let sss = '"'+equipo+'": [';
      for (let index = 0; index < fronteras.length; index++) {
        const equi = fronteras[index];
        sss += '"'+equi+'", ';
      }
      sss += '],';
      console.log(sss);
    }
  }
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
  moverClass(ganador, perdedor);
  agregarPartidoTabla(ganador, perdedor);
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
function moverClass(ganador, perdedor) {
  let elementos = document.getElementsByClassName(perdedor);
  for (let index = elementos.length - 1; index >= 0; index--) {
    const elemento = elementos[index];
    elemento.classList.replace(perdedor, ganador);
  }
}

window.iniciarJuego = iniciarJuego;
window.mostrarAtacantes = mostrarAtacantes;
window.seleccionarAtacante = seleccionarAtacante;
window.mostrarAdversarios = mostrarAdversarios;
window.seleccionarAdversario = seleccionarAdversario;
window.mostrarPartido = mostrarPartido;
window.iniciarCombate = iniciarCombate;
window.Color = Color;
window.Nombre = Nombre;
window.finRuleta = finRuleta;