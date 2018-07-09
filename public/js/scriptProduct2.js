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
        url:  'http://192.168.1.4:1234/products/getAllCategory',
        success: function(result){
            $("#category").empty();

            var dados = result.category;
			$.each(dados, function(i, data) {
                $("#category").append("<option value='"+data._id+"'>"+data.name+"</option>");
            });
        }
    });

});