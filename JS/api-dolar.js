function obtenerDolar(tipoCambio) {  //API de Dolar Sí para la cotización.      
    let url="https://www.dolarsi.com/api/api.php?type=valoresprincipales"
    const api = new XMLHttpRequest();
    api.open('GET',url,true);
    api.send();
    api.onreadystatechange = function(){
        if(this.status == 200 && this.readyState==4){ //si fué exitosa la consulta y ha terminado.
            let datos = JSON.parse(this.responseText);
            if(tipoCambio==0)$('#cotizacion').append(' - Comprador: '+Object.values(datos[0].casa)[tipoCambio]+' - ');
            if(tipoCambio==1)$('#cotizacion').append(' - Vendedor: '+Object.values(datos[0].casa)[tipoCambio]+' - ');
        } else if(this.status > 400)$('#cotizacion').append('Error en la aplicación del Proveedor, inténtelo en unos momentos')//codigos de errores.
    }
}

$('#modalDolar').on('show.bs.modal',()=>{
    document.getElementById("cotizacion").innerHTML='';
    $('#cotizacion').append('Aguarde un instante...')
    obtenerDolar(0);
    obtenerDolar(1);
  })