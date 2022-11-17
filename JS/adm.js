class producto { //clase para crear productos
    constructor(codigo,nombre,stock,precio,proveedor,tipo){        
        this.nombre=nombre;
        this.codigo=codigo;                
        this.stock=stock; 
        this.precio=precio; 
        this.proveedor=proveedor;   
        this.tipo=tipo;  //para diferenciarlo en el storage de los usuarios.            
        ///cualquier otra propiedad que se añada o quite está contemplada por el codigo////
            }
   venta(unidades){ //actualiza el stock y la caja
       this.stock=this.stock-unidades;
       caja=caja+unidades*this.precio;
   }      
}

class clientes { //clase para crear clientes
    constructor(denominacion,mail,descubierto){
        this.denominacion=denominacion;        
        this.mail=mail;
        this.descubierto=descubierto;        
    }
    notificacion(motivo){
        alertas(motivo);//código para enviar un mail
    }    
}

////////////////////////////VARIABLES GLOBALES:INICIO ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

let caja=0;//dinero inicial en caja
const inventario=[];//arreglo de productos
inventario.push(new producto(1234,"Mouse USB",5,150,"infoandina","producto"),new producto(5678,"Teclado USB",10,200,"elit","producto"),new producto(9101112,"Monitor 22",45,1500,"tc","producto"),new producto(13141516,"parlantes USB",124,208,"digitell","producto"));//stock inicial
let operacion = true; //bandera para saber si la operacion es de añadir o modificar productos, true=añade
let indice = 0; //variable para guardar el indice del objeto a modificar
const propiedadesProductos =producto.length;//obtiene la cantidad de propiedades del constructor productos.
let buscaProducto;
let ind; //variable para acceder a las propiedades de los objetos.
let auxiliar; //variable auxiliar para almacenar objetos en forma transitoria.
let flag=false; //bandera utilizada para evitar comportamientos no esperados del modal de Productos.

////////////////////////////VARIABLES GLOBALES:FIN ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

///////////////////////// ALMACENAMIENTO DE DATOS: INICIO /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

for(w in inventario){ //guardamos el stock en storage, emulando una base de datos. La clave es el nombre.
 localStorage.setItem(inventario[w].nombre,JSON.stringify(inventario[w])); 
}

function guardarEnStorage (clave,o) { //guarda objetos "o" en storage
localStorage.setItem(clave,JSON.stringify(o));
}

function buscarEnStorage (obj) { //busca objetos JSON en el storage por clave y los devuelve parseados.
  for(i=0;i<localStorage.length;i++){      
      if(localStorage.key(i)==obj) return JSON.parse(localStorage.getItem(obj));      
  }
  return 0;//significa no encontrado.
 }
 function elimiarDeStorage(item){
     localStorage.removeItem(item);
 }

///////////////////////// TEST DE POSTEO: INICIO /////////////////////////////////
 const URLPOST = "https://my-json-server.typicode.com/dmeschini/json-server/posts";
 const infoPost =  inventario[2];
 $("body").prepend('<button id="btn1">POST</button>');
 $("#btn1").on("click", () => { 
     $.post(URLPOST, infoPost ,(respuesta, estado) => {
         if(estado === "success"){
             $("body").prepend(`<div>
 GUARDADO!: ${respuesta.nombre}
 </div>`);
         }  
     });
 });
 

 URLGET = "https://my-json-server.typicode.com/dmeschini/json-server/posts"
$("body").prepend('<button id="btn2">GET</button>');
$("#btn2").on("click",() => { 
    $.getJSON(URLGET, function (respuesta, estado) {
          if(estado === "success"){
            let misDatos = respuesta;
            for (const dato of misDatos) {
              $("body").prepend(`<div>
                                   <h5> Nombre: ${dato.nombre}</h5>
                                   <h5> Código: ${dato.codigo}</h5>
                                   <h5> Stock: ${dato.stock}</h5>
                                   <h5> Precio: ${dato.precio}</h5>
                                   <h5> Proveedor: ${dato.proveedor}</h5>
                                   <h5> Tipo: ${dato.tipo}</h5>
                                  </div>`);
            }  
          }
    });
});
///////////////////////// TEST DE POSTEO: FIN /////////////////////////////////

///////////////////////// ALMACENAMIENTO DE DATOS: FIN /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////MANIPULACION DEL DOM: INICIO ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function eliminarDelDom(item,lista){ //elimina uno o todos los items de una lista,según los argumentos      
    let list = document.getElementById(lista); //obtenemos la lista de productos  
    if(item!="todos"){
        for (let p = 1; p < list.childNodes.length; p++) { //por alguna razón que desconozco, el indice del arreglo que representa los items comienza en 1, no en 0, por eso p=1.            
            if (item==list.childNodes[p].innerHTML){
             list.removeChild(list.childNodes[p]); // borra sólo el item solicitado por el argumento
             break;//evitamos que el for ejecute ciclos innecesarios   
            } 
         } 
    } else  list.innerHTML=""; //elimina todos los items     
   }

function agregarAlDom(item,lista){ //añade al dom un item li en la lista ul según los argumentos    
    $('#'+lista).append('<div><button id="'+item+'" type="button" class="ajustefondos contenedor oferta" data-bs-toggle="modal" data-bs-whatever="'+item+'" data-bs-target="#modalProductos">'+item+'</button></div>')
   }
function actualizarDomProductos(){ //añadimos al dom el inventario actual 
    for(i=0;i<localStorage.length;i++){   
        if (buscarEnStorage(localStorage.key(i)).tipo=="producto"){
            agregarAlDom(buscarEnStorage(localStorage.key(i)).nombre,"listaProductos");
        }               
    } 
  }

function limpiarModal(tipoModal,indice) { //borra campos del modal          
    for (let k = indice; k < tipoModal; k++) {
        if($('#'+k).val()!="producto") $('#'+k).val('');
    }
    $('#botonEliminarProducto').prop('disabled',true);
 }
function camposVacios(tipoModal){ //verifica que todos los campos estén completos.
    for (w=0;w<tipoModal;w++ ) {
       if(document.getElementById(w).value=='')return false;
    }
    return true;
 } 
function alertas(mensaje,dom,tipo){ //mustra mensajes en el dom especificado durante 2 segundos.
 $('#'+dom).prepend('<div id="mens" class="alert alert-'+tipo+' modal-dialog modal-header " role="alert">' + mensaje +'</div>');   
 setInterval(() => { $('#'+dom).children().remove("#mens");}, 2000);    
}

 actualizarDomProductos();//presentamos en el html la lista de productos
 
 ////////////////////////////MANIPULACION DEL DOM: FIN ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

/////////////EVENTO DEL BOTON GUARDAR INGRESO-MODIFICACION:INICIO ////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

$('#botonenviar').on("click",() => { // añadimos un oyente para el evento click sobre el botón Guardar.     
  if(camposVacios(propiedadesProductos)==true){        
        if(operacion==true){ //añadimos nuevo producto    
        auxiliar=new producto();//creamos un objeto vacío para luego modifiar sus propiedades y dejarlos con las solicitadas por el usuario, resultando en un nuevo objeto.
        eliminarDelDom("todos","listaProductos"); //eliminamos la lista para después actualizarla.
    ind=0;     
        for(const u in auxiliar){ //modifica el objeto auxiliar con los datos cargados
        auxiliar[u]=document.getElementById(ind).value;
        ind++;
        }
    }
        else  { //modificamos el producto       
        ind=0;
        if(auxiliar!=0) eliminarDelDom("todos","listaProductos"); //eliminamos la lista para después actualizarla.         
        else alertas("¡El producto no exsite!","modalProductos","danger");
        for(const u in auxiliar){ //modificamos las propiedades del objeto
            auxiliar[u]=document.getElementById(ind).value;
            ind++;
         }    
    }
    if(auxiliar!=0) guardarEnStorage(auxiliar.nombre,auxiliar); //guarda el nuevo objeto en el storage
    if(auxiliar!=0) actualizarDomProductos();//actualizamos la lista en el dom.
    limpiarModal(propiedadesProductos,0);    
}else alertas("Complete los campos vacíos","modalProductos","danger")
})

/////////////EVENTO DEL BOTON GUARDAR INGRESO-MODIFICACION:FIN //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//////////// EVENTO ABRIR MODAL INGRESO-MODIFICACION:INICIO ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

 $('#modalProductos').on('show.bs.modal', function (event){ //listener del evento de despliegue del Modal.       
 $('#modalProductos').slideDown("slow");   
 let boton= event.relatedTarget;//obtenemos el orígen que dío lugar a éste evento.
 let opcion =boton.getAttribute('data-bs-whatever'); //obtenemos el atributo 'data-bs-whatever' para saber si se pulsó el botón de añadir o el de modificar un producto, y en función de eso presentamos el modal.  
 if(opcion=="añade") { 
     $('#modalProductos .modal-title').text("Añadir Nuevo Producto")
     operacion=true; //le indica al listener del boton Guardar que debe añadir un nuevo producto          
    }
 else {
    $('#modalProductos .modal-title').text("Buscar Producto");//seteamos título del modal
     operacion=false; //le indica al listener del boton Guardar que debe modificar un producto     
      }        
      let listaprod =document.getElementById("listaModal");      
 if((listaprod.childNodes.length)==1){ //esa cantidad de hijos indica que se debe añadir al dom, si es mayor, no se debe.
      for (w=0;w<propiedadesProductos;w++) {//añadimos al dom del modal los inputs y sus etiquetas.      
      $('#listaModal').append('<label for="'+w+'" class="col-form-label">'+Object.keys(new producto())[w]+'</label>'); //el objeto vacío se crea para poder generar las etiquetas obteniendo los nombres de las claves del mismo, no pude encontrar una técnica para acceder directamente a las claves del constructor.
      $('#listaModal').append('<input type="text" class="form-control" id="'+w+'">');        
      if(Object.keys(new producto())[w]=="tipo") {
            $('#'+w).val("producto"); 
            $('#'+w).prop('disabled',true);
           }
        } 
 }                  
       limpiarModal(propiedadesProductos,0);        
       if(opcion!="añade" && opcion!="modifica") {//significa que se hizo click en algun producto del dom.
        for (k = 0; k < propiedadesProductos; k++) {//carga datos del objeto en el modal
            $('#'+k).val(Object.values(buscarEnStorage(opcion))[k]);
            operacion=false;  //vamos a modificar 
            auxiliar = buscarEnStorage($('#0').val());//variable objeto auxiliar, pasada al boton Guardar            
        }
        $('#botonEliminarProducto').prop('disabled',false); 
       } 
      //////////// EVENTO CAMBIO EN EL CAMPO NOMBRE DEL MODAL: INICIO ///////////////////////////  
      //////////////////////////////////////////////////////////////////////////////////////////////
      $('#0').on("click", ()=>{flag=false});//resetea la bandera para iniciar otra operación de búsqueda.
      $('#0').on("focus", ()=>{flag=false});//resetea la bandera para iniciar otra operación de búsqueda.
      $('#0').on("change", ()=>{ //listener que detecta un cambio en el contenido del campo Nombre del modal       
       if (flag==false){ //evita repeticiones inesperadas del evento change. Dichas repeticiones tienen un orígen desconodido para mí.        
      flag=true;            
        auxiliar = buscarEnStorage($('#0').val());//variable objeto auxiliar 
            if(auxiliar.nombre==$('#0').val()){                                     
                for (k = 0; k < propiedadesProductos; k++) {//carga datos del objeto en el modal
                    $('#'+k).val(Object.values(auxiliar)[k]);                     
                }                                
                if(operacion==true) alertas("¡El producto ya exsite!","modalProductos","danger");
                $('#botonEliminarProducto').prop('disabled',false);
               }
             if(auxiliar==0 && operacion==false) {//no se encontró el producto a modificar.                                        
                    alertas("¡El producto no exsite!","modalProductos","danger");                         
                }
       }     if(auxiliar==0) limpiarModal(propiedadesProductos,1); 
            })
      //////////// EVENTO CAMBIO EN EL CAMPO NOMBRE DEL MODAL: FIN ///////////////////////////  
      //////////////////////////////////////////////////////////////////////////////////////////////      
})
//////////// EVENTO ABRIR MODAL INGRESO-MODIFICACION:FIN ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//////////// EVENTO BOTON ELIMINAR PRODUCTO: INICIO ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
$('#botonEliminarProducto').on('click',()=>{
    localStorage.removeItem($('#0').val());
    limpiarModal(propiedadesProductos,0);
    eliminarDelDom("todos","listaProductos");
    actualizarDomProductos();
})
//////////// EVENTO BOTON ELIMINAR PRODUCTO: FIN ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////