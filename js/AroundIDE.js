//===================
//PAGE SPLASH
//===================
$(document).on ('pageinit', '#splash', function (event) {
    $("#tabExit0").bind('click', function(event, ui){
    	navigator.app.exitApp();
    }); 
});

//==================
//PAGE HOME
//==================
$(document).on ('pageinit', '#home', function (event) {
    $("#tabExit1").bind('click', function(event, ui){
    	navigator.app.exitApp();
    }); 
});
$(document).on ('pageshow', '#home', function (event) {
	//getLocation();
});

//==================
//PAGE CONFIGURACIO
//==================
$(document).on ('pageinit', '#configuracio', function (event) {
    $("#btnAcceptarLocalitzacio").bind('click', function(event, ui){
        $("input[name*=radio-localitzacio]:checked").each(function() {
        	metodeLocalitzacio = $(this).val();
        })
        if (metodeLocalitzacio=="GPS")
        {
        	if (watchID == null)
        	{
        		initLocation();
        	}
        };
        $.mobile.changePage("#home");
    }); 
});

//==================
//PAGE ENCERTS
//==================
$(document).on ('pageinit', '#encerts', function (event) {
	if (map==null)
	{
	    document.getElementById('mapCanvas').style.height = (window.innerHeight - 135) + 'px';
	    document.getElementById('mapCanvas').style.width = (window.innerWidth) + 'px';

	    document.getElementById('mapCanvas2').style.height = (parseInt(window.innerHeight) /2) + 'px';
	    document.getElementById('mapCanvas2').style.width = (window.innerWidth) + 'px';    

	    initMap();
	}
});

//==================
//PAGE MAPA
//==================
$(document).on ('pageshow', '#pageMapa', function (event) {
	map.setCenter(new OpenLayers.LonLat(geoLocationX,geoLocationY).transform(new OpenLayers.Projection("EPSG:4326" ), new OpenLayers.Projection("EPSG:25831")), 9);
	var punt = new OpenLayers.Geometry.Point(geoLocationX,geoLocationY).transform(new OpenLayers.Projection("EPSG:4326" ), new OpenLayers.Projection("EPSG:25831"));
	centreMapa = [new OpenLayers.Feature.Vector(punt, { icon:'img/icones/target32.png', etiqueta:'', width:32, height:32})];
	vectors.addFeatures(centreMapa);			    
});

$(document).on ('pageinit', '#pageMapa', function (event) {
    $("#tabMapa1").bind('click', function(event, ui){
			map.setBaseLayer(map.layers[0]);
			map.layers[0].setIsBaseLayer(true);
			map.layers[1].setVisibility(false);
    });
    $("#tabMapa2").bind('click', function(event, ui){
			map.setBaseLayer(map.layers[1]);
			map.layers[1].setIsBaseLayer(true);
			map.layers[0].setVisibility(false);
    }); 
});

//==================
//PAGE DETALL
//==================
$(document).on ('pageshow', '#detall', function (event) {
	var punt = new OpenLayers.Geometry.Point(geoLocationX,geoLocationY).transform(new OpenLayers.Projection("EPSG:4326" ), new OpenLayers.Projection("EPSG:25831"));
	centreMapa = [new OpenLayers.Feature.Vector(punt, { icon:'img/icones/target32.png', etiqueta:'', width:32, height:32})];
	vectors2.addFeatures(centreMapa);			    
});
$(document).on ('pageinit', '#detall', function (event) {
    $("#tabMapa3").bind('click', function(event, ui){
			map2.setBaseLayer(map2.layers[0]);
			map2.layers[0].setIsBaseLayer(true);
			map2.layers[1].setVisibility(false);
    });
    $("#tabMapa4").bind('click', function(event, ui){
			map2.setBaseLayer(map2.layers[1]);
			map2.layers[1].setIsBaseLayer(true);
			map2.layers[0].setVisibility(false);
    });	
});

function find(valor)
{
	url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + geoLocationY + "," + geoLocationX + "&radius=" + $("#infoListDistance").val() + "&types=" + valor + "&sensor=false&key=AIzaSyBYbAJw6aAbrVOxx-OaxNiLDlVmvxyCoPc";
	//alert(url);
	$.ajax({
		url: url,
		cache: false,
		dataType: 'json',
		success: function(data) { 
			if(!data.error){
				//Inicialitza la llista desplegable
				$("#llistaEncerts").empty();
				if(data.results!=null){
					if(data.results.length==0){
						alert("no hi ha encerts!");
					}
					else{
						var numResultats=0;
						try{
							//Esborrem les icones del mapa
							vectors.destroyFeatures();
							matriuPunts = new Array();
							//Per a cada encerte, farem el següent:
							$.each(data.results, function(i, item) {
								//Afegir l'encert a la llista
								$("#llistaEncerts").append('<li onclick="placeDetall(\'' + item.reference + '\')"><a href="#"><h3>' + item.name +'</h3><div style="font-size:12px;">' + item.vicinity + '</div></a></li>');
								//Afegir l'encert al mapa
								var punto = new OpenLayers.Geometry.Point(item.geometry.location.lng,item.geometry.location.lat).transform(new OpenLayers.Projection("EPSG:4326" ), new OpenLayers.Projection("EPSG:25831"));
								var feature = new OpenLayers.Feature.Vector(punto, { icon:item.icon, etiqueta:item.name, width:32, height:32});
								matriuPunts.push(feature.id + "#" + item.reference);
						    	vectors.addFeatures(feature);
						    	numResultats++;			    
							});
						}
						catch(e)
						{
							alert(e.toString());
						}
					}
					//Actualiza la lista
					$("#llistaEncerts").listview("refresh");
					$("#contentEncerts").html("Hi ha " + numResultats + " encerts:");
				}
			}else{
				alert("Error carregant dades.");
			}
		},
		error: function(data) {
			alert("Error carregant dades: "+data.responseText);
			$.mobile.hidePageLoadingMsg( 'Searching' );
		}
	});
	//Mostrem la pàgina d'encerts
	$.mobile.changePage("#encerts");
}


function placeDetall(valor)
{
	url="https://maps.googleapis.com/maps/api/place/details/json?reference=" + valor + "&sensor=true&key=AIzaSyBYbAJw6aAbrVOxx-OaxNiLDlVmvxyCoPc";
	$.ajax({
		url: url,
		cache: false,
		dataType: 'json',
		success: function(data) { //Si se ejecuta correctamente
			if(!data.error){
				$("#contentDetall").html("");
				if(data.result!=null){
					var contentHtml="";
					if(data.result.length==0){
						alert("no hi ha encerts!");
					}
					else{
						vectors2.destroyFeatures();
						var punto = new OpenLayers.Geometry.Point(data.result.geometry.location.lng,data.result.geometry.location.lat).transform(new OpenLayers.Projection("EPSG:4326" ), new OpenLayers.Projection("EPSG:25831"));
				    	vectors2.addFeatures([new OpenLayers.Feature.Vector(punto, {icon:data.result.icon, etiqueta:data.result.name, width:32, height:32})]);			    
						map2.setCenter(new OpenLayers.LonLat(data.result.geometry.location.lng,data.result.geometry.location.lat).transform(new OpenLayers.Projection("EPSG:4326" ), new OpenLayers.Projection("EPSG:25831")), 10);
						
						contentHtml = "<h1>" + data.result.name + "<hr></h1>";
						contentHtml += "<b>Adre&ccedil;a:</b> " + data.result.formatted_address + "<br>";
						contentHtml += "<b>Tel&eacute;fon:</b> " + data.result.formatted_phone_number + "<br>";
						contentHtml += "<b>web:</b> " + data.result.website + "<br>";
					}
					$("#contentDetall").html(contentHtml);
				}
			}else{
				alert("Error carregant dades.");
			}
		},
		error: function(data) {
			alert("Error carregant dades: "+data.responseText);
		}
	});
	$.mobile.changePage("#detall");
}
