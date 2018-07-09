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

    var d = new Date();
    if(d.getDay() < 10 && d.getMonth()+1 < 10){
        var str_data = '0'+d.getDay() + '/0' + (d.getMonth()+1) + '/' + d.getFullYear();
    }else if(d.getDay() > 10 && d.getMonth()+1 < 10){
        var str_data = d.getDay() + '/0' + (d.getMonth()+1) + '/' + d.getFullYear();
    }else if(d.getDay() < 10 && d.getMonth()+1 > 10){
        var str_data = '0'+d.getDay() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
    }else if(d.getDay() > 10 && d.getMonth()+1 > 10){
        var str_data = d.getDay() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
    }
    
    var str_hora = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/order/getAllUsers',
        success: function(result){
            $(".cliente").empty();

            var dados = result.users;
			$.each(dados, function(i, data) {
                $(".cliente").append("<option value='"+data._id+"'>"+data.firstname+" "+data.lastname+"</option>");
            });
        }
    });

    $("#date").val(str_data);
    $("#hour").val(str_hora);

});