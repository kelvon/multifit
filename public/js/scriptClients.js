var jsonClientes;
$(document).ready(function(){

    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/order/getAcceptOrder',
        success: function(result){
            var dados = result.count;
            var count = dados;
            
            if(count > 0){
                var y = document.getElementById("badges");
                y.className = "badge";
                
                $("#badges").empty();
                $("#badges").append(count);
            }else{
                var y = document.getElementById("badges");
                y.className = "";
                
                $("#badges").empty();
            }
            
        }
    });
    
    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/auth/getAll',
        dataType: 'json',
        success: function(result){
            //alert(result);
            this.jsonClientes = result;
        }
    });
});