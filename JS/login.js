/////////////VARIABLES GLOBALES:INICIO ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

const propiedadesLogin=2;//constante de la cantidad de campos para el login.
let operacion; //variable para el tipo de operacion de usuario.
let auxiliar;
/////////////VARIABLES GLOBALES:FIN ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/////////////FUNCIONES:INICIO ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

 function guardarEnStorage (clave,o) { //guarda objetos "o" en storage
    localStorage.setItem(clave,JSON.stringify(o));
  }
 function buscarEnStorage (obj) { //busca objetos JSON en el storage por clave y los devuelve parseados.
    for(i=0;i<localStorage.length;i++){      
        if(localStorage.key(i)==obj) return JSON.parse(localStorage.getItem(obj));      
    }
    return 0;//significa no encontrado.
  }
  function alertas(mensaje,dom,tipo,delay){ //mustra mensajes en el dom especificado durante "delay" milisegundos. Si es "0" lo muestra hasta que el usuario lo cierre.      
    $('#'+dom).prepend('<div id="mens" class="alert alert-'+tipo+' modal-dialog modal-header " role="alert"> <h5 class="modal-title">'+mensaje+'</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>');    
    if(delay!=0) {
      setInterval(() => { $('#'+dom).children().remove("#mens");}, delay);            
    }   
  }      
  function prepararDom (logueo){ //muestra el dom según el estado de logueo.
    if(logueo==true){
      $('#admAcceso').remove();// borramos primero para que no se acumulen.
      $('#barra').prepend('<li id="admAcceso"><a class="nav-link active" aria-current="page" href="./adm.html" >ADM</a></li>');
      $('#btnSesion').remove();//eliminamos el boton para iniciar sesión.
      $('#btnNuevo').remove();//eliminamos el boton para ingresar nuevo usuario.
      $('#barra').append('<li class="nav-item"><button id="btnSesion" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalSalir" >Salir</button></li>');//añadimos el boton para cerrar sesión.
     } else{     
      $('#btnSesion').remove();//eliminamos el boton para cerrar sesión.
      $('#btnNuevo').remove();//eliminamos el boton para nuevo usuario.
      $('#barra').append('<li class="nav-item"><button id="btnSesion" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalIngreso" data-bs-whatever="usuarioExistente" >Ingresar</button></li>');   
      $('#barra').append('<li class="nav-item"><button id="btnNuevo" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalIngreso" data-bs-whatever="usuarioNuevo" >Nuevo Usuario</button></li>');      
      $('#admAcceso').remove();}//eliminamos el acceso a la administración.
    }
    
/////////////FUNCIONES:FIN ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
  
///// PREPARA EL DOM SEGUN EL ESTADO DE LOGUEO: INICIO //////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

if (localStorage.length!=0){
  for(i=0;i<localStorage.length;i++){
    if(buscarEnStorage(localStorage.key(i)).tipo=="cliente"){
      if(buscarEnStorage(localStorage.key(i)).sesion==true){            
        prepararDom(true);
        break;
      } else{
        prepararDom(false);
        break; 
      }
    }else prepararDom(false);    
  }
}else{
  prepararDom(false);
}  
///// PREPARA EL DOM SEGUN EL ESTADO DE LOGUEO: FIN //////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/////////////EVENTO DEL BOTON ENVIAR LOGIN:INICIO ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

$('#botonenviarLogin').on('click', ()=>{  
    if((document.getElementById("usuario").value!='')&&(document.getElementById("clave").value!='')){//verifica campos vacíos.
      if(buscarEnStorage(document.getElementById("usuario").value)!=0 && operacion==false) {//verifica que exista el usuario y que sea una operación de búsqueda.
        if(buscarEnStorage(document.getElementById("usuario").value).clave===document.getElementById("clave").value){//verifica que la clave sea correcta.       
          alertas("¡Login exitoso!","modalIngreso","info",3000);   
          guardarEnStorage(document.getElementById("usuario").value,{usuario:document.getElementById("usuario").value,clave:document.getElementById("clave").value,sesion:true,tipo:"cliente"});//actualizamos el estado de sesión.          
          prepararDom(true);//actualizamos el dom
        }else alertas("Verifique sus datos e intentelo nuevamente.","modalIngreso","danger",3000);//existe el usuario pero no coincide la clave.
      }else {
        if(operacion==false) alertas("Usuario inexistente, debe registrarse primero.","modalIngreso","danger",3000);//no encontró al usuario, y es una operación de búsqueda.
        else { //es una operación de añadir nuevo usuario.       
        if(buscarEnStorage(document.getElementById("usuario").value)==0){//comprueba que esté disponible el nombre.
          guardarEnStorage(document.getElementById("usuario").value,{usuario:document.getElementById("usuario").value,clave:document.getElementById("clave").value,sesion:false,tipo:"cliente"});
          alertas("¡Registro Exitoso!","modalIngreso","info",3000);      
        } else { //la busqueda fue exitosa
          alertas("Nombre de Usuario no disponible, elija otro.","modalIngreso","danger",3000);
        }
      }
    } 
}else alertas("Complete los campos vacíos","modalIngreso","danger",3000);
})
/////////////EVENTO DEL BOTON ENVIAR LOGIN:FIN ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/////////////EVENTO DE APERTURA DEL MODAL DE LOGIN:INICIO ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

$('#modalIngreso').on('show.bs.modal',function(e){
  $('#modalIngreso').children().remove("#mens");
  $('#modalIngreso').slideDown("slow"); 
  document.getElementById("usuario").value='';//limpiamos campos
  document.getElementById("clave").value='';//limpiamos campos
  let boton= e.relatedTarget;//obtenemos el orígen que dío lugar a éste evento.
  let opcion =boton.getAttribute('data-bs-whatever'); //obtenemos el atributo 'data-bs-whatever' y en función de eso presentamos el modal. 
  if(opcion=="usuarioNuevo") { 
    $('#modalIngreso .modal-title').text("Añadir Nuevo Usuario")
    operacion=true; //le indica al listener del boton Enviar Datos que debe añadir un nuevo usuario.  
   } else {
    $('#modalIngreso .modal-title').text("Ingrese los datos:");
    operacion=false; //le indica al listener del boton Enviar Datos que debe verificar los datos.
   }
  
})
/////////////EVENTO DE APERTURA DEL MODAL DE LOGIN:FIN ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/////////////EVENTO DE APERTURA DEL MODAL DE SALIDA:INICIO ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

$('#modalSalir').on('show.bs.modal',()=>{  
  $('#modalSalir').children().remove("#mens");
  $('#modalSalir').slideDown("slow");
  if (localStorage.length!=0){
    for(i=0;i<localStorage.length;i++){
      if(buscarEnStorage(localStorage.key(i)).sesion==true){
        auxiliar=buscarEnStorage(localStorage.key(i));//copiamos en auxiliar el objeto del usuario.
        auxiliar.sesion=false; //cambiamos el estado de sesión.
        guardarEnStorage(localStorage.key(i),auxiliar); //lo guardamos de nuevo con el estado de sesión actualizado.
    }
  } 
} else alertas("Error de almacenamiento, debe registrarse nuevamente.","modalSalir","danger",0);
prepararDom(false);
});
/////////////EVENTO DE APERTURA DEL MODAL DE SALIDA:FIN ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////