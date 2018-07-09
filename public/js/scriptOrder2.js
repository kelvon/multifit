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

                var y2 = document.getElementById("badges2");
                y2.className = "badge";
                
                $("#badges").empty();
                $("#badges").append(count);

                $("#badges2").empty();
                $("#badges2").append(count);

            }else{
                var y = document.getElementById("badges");
                y.className = "";

                var y2 = document.getElementById("badges2");
                y2.className = "";
                
                $("#badges2").empty();
            }
            
        }
    });

    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/order/getAllFormasPag',
        success: function(result){
            $(".formaspag").empty();

            var dados = result.formas;
			$.each(dados, function(i, data) {
                $(".formaspag").append("<option value='"+data._id+"'>"+data.name+"</option>");
            });
        }
    });
    
});