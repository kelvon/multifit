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
        url:  'http://192.168.1.4:1234/clients/count',
        success: function(result){
            result.count = ("0000" + result.count).slice(-4);
            $('#countUser').html(result.count);
        }
    });

    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/products/count',
        success: function(result){
            result.count = ("0000" + result.count).slice(-4);
            $('#countProduct').html(result.count);
        }
    });

    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/categories/count',
        success: function(result){
            result.count = ("0000" + result.count).slice(-4);
            $('#countCategory').html(result.count);
        }
    });

    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/order/count',
        success: function(result){
            result.count = ("0000" + result.count).slice(-4);
            $('#countOrder').html(result.count);
        }
    });

});