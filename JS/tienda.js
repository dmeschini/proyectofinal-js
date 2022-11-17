function buscarEnStorage (obj) { //busca objetos JSON en el storage por clave y los devuelve parseados.
    for(i=0;i<localStorage.length;i++){      
        if(localStorage.key(i)==obj) return JSON.parse(localStorage.getItem(obj));      
    }
    return 0;//significa no encontrado.
   }   

function actualizarDomProductos(){ //añadimos al dom el inventario actual 
    let j=0;
    for(i=0;i<localStorage.length;i++){           
        if (buscarEnStorage(localStorage.key(i)).tipo=="producto"){                                  
            $('#grillaProductos').append('<div class="ajustefondos grillatienda oferta"><h5>'+buscarEnStorage(localStorage.key(i)).nombre+'</h5></div>');
            j++;
       }               
   } 
  }
  actualizarDomProductos();