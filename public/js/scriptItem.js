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
        url:  'http://192.168.1.4:1234/item/getAllCategories',
        success: function(result){
            $(".category").empty();

            var dados = result.category;
            $(".category").append("<option value='0'>Selecione uma categoria</option>");
			$.each(dados, function(i, data) {
                $(".category").append("<option value='"+data._id+"'>"+data.name+"</option>");
            });
        }
    });

});

function getProducts(orderID){
    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/item/getAllProducts/'+orderID,
        success: function(result){
            $(".product").empty();

            var dados = result.product;
            $(".product").append("<option value='0'>Selecione um produto</option>");
			$.each(dados, function(i, data) {
                $(".product").append("<option value='"+data._id+"'>"+data.name+"</option>");
            });
        }
    });
}

function setInfoProduct(productID){
    $.ajax({
        type: 'GET',
        url:  'http://192.168.1.4:1234/item/getProduct/'+productID,
        success: function(result){
            var dados = result.product;
            $("#priceUnit").val(dados.price);
        }
    });
}

function setTotalValue(value){
					
    var valor = value;
    var qtde    = $("#itemValue").val();
    if(qtde == ""){
        qtde = "0";
        $("#itemValue").val("0");
    }

    var descont = $("#priceDescont").val();
    if(descont == ""){
        descont = "0";
        $("#priceDescont").val("0");
    }

    var total = qtde*(valor - ((valor*descont)/100));
    
    var totalId = "#priceTotal";
    $(totalId).val(total.toFixed(2).toString().replace(".", ","));
    
}

function setTotalDescont(value){
					
    var valId = "#priceUnit";
    var valor = $(valId).val();
    if(valor == ""){
        valor = "0.00";
        $(valId).val("0.00");
    }

    var qtde    = $("#itemValue").val();
    if(qtde == ""){
        qtde = "0";
        $("#itemValue").val("0");
    }

    var descont = value;
    var total = qtde*(valor - ((valor*descont)/100));
    
    var totalId = "#priceTotal";
    $(totalId).val(total.toFixed(2).toString().replace(".", ","));
    
}

function setTotal(value){
					
    var valId = "#priceUnit";
    var valor = $(valId).val();
    if(valor == ""){
        valor = "0.00";
        $(valId).val("0.00");
    }

    var qtde    = value;
    var descont = $("#priceDescont").val();
    if(descont == ""){
        descont = "0";
        $("#priceDescont").val("0");
    }

    var total = qtde*(valor - ((valor*descont)/100));
    
    var totalId = "#priceTotal";
    $(totalId).val(total.toFixed(2).toString().replace(".", ","));
    
}