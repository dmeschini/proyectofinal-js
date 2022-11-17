class mensajes{
    constructor(nombre,email,mensaje,telefono){
        this.nombre=nombre;
        this.email=email;
        this.mensaje=mensaje;     
        this.telefono=telefono;           
        ///cualquier otra propiedad que se añada o quite está contemplada por el codigo////
    }
}
//////////// VARIABLES GLOBALES:INICIO ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

const propiedadesMensajes = mensajes.length;//cuenta la cantida de propiedades del constructor
let ind; //variable para acceder a las propiedades de los objetos.
const APIURL = "https://my-json-server.typicode.com/dmeschini/json-server/posts";//URL para posteos
//////////// VARIABLES GLOBALES:FIN ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/////////// FUNCIONES:INICIO ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

function camposVacios(cantCampos){ //verifica que todos los campos estén completos.
    for (w=0;w<cantCampos;w++ ) {
       if(document.getElementById(w).value=='')return false;
    }
    return true;
 }

 function limpiarModal(cantCampos) { //borra campos del modal          
    for (let k = 0; k < cantCampos; k++) {
        document.getElementById(k).value='';
    }
 }

 function alertas(mensaje,dom,tipo,delay){ //mustra mensajes en el dom especificado durante "delay" milisegundos. Si es "0" lo muestra hasta que el usuario lo cierre.      
    $('#'+dom).prepend('<div id="mens" class="alert alert-'+tipo+' modal-dialog modal-header " role="alert"> <h5 class="modal-title">'+mensaje+'</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>');
    if(delay!=0) {
        setInterval(() => { $('#'+dom).children().remove("#mens");}, delay);
    }         
   } 
/////////// FUNCIONES:FIN ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

 //////////// EVENTO ABRIR MODAL DE MENSAJES:INICIO ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

$('#modalMensajes').on('show.bs.modal', () => {  
    $('#modalMensajes').slideDown("slow");  
    $('#modalMensajes').children().remove("#mens");
    let listaprod =document.getElementById("listaModal"); 
         if((listaprod.childNodes.length)==1){ //esa cantidad de hijos indica que se debe añadir al dom, si es mayor, no se debe.
              for (w=0;w<propiedadesMensajes;w++) {//añadimos al dom del modal los inputs y sus etiquetas.
               $('#listaModal').append('<label for="'+w+'" class="col-form-label">'+Object.keys(new mensajes())[w]+'</label>'); //el objeto vacío se crea para poder generar las etiquetas obteniendo los nombres de las claves del mismo, no pude encontrar una técnica para acceder directamente a las claves del constructor.
               $('#listaModal').append('<input type="text" class="form-control" id="'+w+'">');                                   
              }
         }       
         limpiarModal(propiedadesMensajes);
})
//////////// EVENTO ABRIR MODAL DE MENSAJES: FIN ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/////////////EVENTO DEL BOTON GUARDAR MENSAJES:INICIO ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

$('#botonenviar').on('click', ()=>{   
    if((document.getElementById("modalMensajes")).childNodes.length>0)$('#modalMensajes').children().remove("#mens");    
    if(camposVacios(propiedadesMensajes)==true){
        auxiliar=new mensajes();//creamos un objeto vacío para luego modifiar sus propiedades y dejarlos con las solicitadas por el usuario, resultando en un nuevo objeto.
        ind=0;     
        for(const u in auxiliar){ //modifica el objeto auxiliar con los datos cargados
           auxiliar[u]=document.getElementById(ind).value;
           ind++;
           }
           ////POSTEA EN LA API Y GUARDA EN EL STORAGE////
           $.ajax({
            method: "POST",
            url:  APIURL,
            data: auxiliar,            
            success: function(respuesta){
                alertas(respuesta.nombre+": "+"¡Su Mensaje ha sido enviado con éxito!","modalMensajes","info",3000);               
                limpiarModal(propiedadesMensajes);
            },
            error: () =>{
                alertas("Error en el envío, intente en unos momentos.","modalMensajes","danger",3000);
             }                   
        });         
          
}else alertas("Complete los campos vacíos","modalMensajes","danger",3000);
})
/////////////EVENTO DEL BOTON GUARDAR MENSAJES:FIN ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////