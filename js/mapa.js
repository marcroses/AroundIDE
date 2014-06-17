var map=null;
var map2=null;
var vectors=null;
var vectors2=null;
var metodeLocalitzacio="HTML5";
var geoLocationX=null;
var geoLocationY=null;

var optionsMapa=null;
var centreMapa=null;

var matriuPunts=null;

function getLocation()
{
	if (navigator.geolocation)
    {
    	navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
}

function showPosition(position)
{
	geoLocationY = position.coords.latitude; 
  	geoLocationX = position.coords.longitude;	
	//alert("Estàs a la posició: " + geoLocationX + "   " + geoLocationY);
}

function showError(error)
{
  switch(error.code) 
    {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
    }
}


function initMap()
{
		//Opcions del mapa
		optionsMapa = {
                projection: new OpenLayers.Projection('EPSG:25831'),
				displayProjection: new OpenLayers.Projection('EPSG:25831'),
                units: 'm',
				maxExtent: new OpenLayers.Bounds(567000, 4406000, 614000, 4439000),
                maxResolution: 'auto',
				theme: null,
		        controls: [
		            new OpenLayers.Control.TouchNavigation({
		                dragPanOptions: {
		                    enableKinetic: true
		                }
		            }),
		            new OpenLayers.Control.Zoom({zoomInText: "", zoomOutText: ""})
		        ]   
		};		
	
		//Capes WMS Base
		layerRef = new OpenLayers.Layer.WMS(
				"Base referència WMS",
				"http://ide.cime.es/menorca/wms/base_referencia", 
				{layers: 
					[
						'ombres',
						'RE007RUS_municipis',
						'RE007RUS_entitatsurbanes',
						'OR007POR_limpn',
						'RE007RUS_equipaments',
						'RE007RUS_edificis25000',
						'RE007RUS_edificis10000',
						'RE007RUS_edificis5000',
						'RE007RUS_piscines',
						'RE007RUS_piscines_s2',
						'RE007RUS_torrents',
						'RE007RUS_zoneshumides',
						'RE007RUS_parets5000',
						'RE007RUS_parets25000',
						'RE007RUS_corvesnivell',
						'RE007RUS_xarxaviaria',
						'RE007RUS_xarxaviaria_s2',
						'RE007URB_carrer',
						'RE007URB_zverda',
						'RE007URB_vorera',
						'RE007URB_torrent',
						'RE007URB_places',
						'RE007URB_parking',
						'RE007URB_constru',
						'RE007URB_piscina',
						'RE007URB_eixcarrer',
						'RE007URB_portals',
						'RE007URB_arbres',
						'RE007URB_jardins',
						'RE007RUS_llocs',
						'RE007RUS_lterme',
						'RE007TOP_topo05',
						'RE007TOP_topo10',
						'RE007TOP_topo25',
						'RE007TOP_topo50',
						'RE007TOP_top100',
						'RE007RUS_costal',
						'RE007TOP_top200'
					],
					transparent: 'TRUE'
				},
				{isBaseLayer: true, visibility: true, opacity: 0.85}
			);
			
		layerOrto = new OpenLayers.Layer.WMS(
				"Ortofoto 2012",
				"http://ideib.caib.es/pub_ideib/public/IMATGES_OR2012_R25/MapServer/WMSServer", 
				{layers: ['0'],
					transparent: 'TRUE'
				},
				{isBaseLayer: true, visibility: true, opacity: 0.85}
			);			
			
        vectors = new OpenLayers.Layer.Vector(
            "markador",
            {
                styleMap: new OpenLayers.StyleMap({
                    "default": {
                        externalGraphic: "${icon}",
                        graphicWidth: "${width}",
                        graphicHeight: "${height}",
                        labelYOffset: 25,
                        graphicYOffset: -19,
                        label: "${etiqueta}"
                    }
                })
            }
        );
        

		//Preparem el mapa
		map = new OpenLayers.Map('mapCanvas', optionsMapa);
		map.addLayers([layerRef,layerOrto,vectors]);
		map.setCenter(new OpenLayers.LonLat(607227,4415490), 7);

		//Control de selecció		
		var selectControl = new OpenLayers.Control.SelectFeature(vectors, {
		    onSelect: onFeatureSelect
		});
		map.addControl(selectControl);
    	selectControl.activate();		
		
		//Preparem el mapa de la pàgina de detall
		map2 = new OpenLayers.Map('mapCanvas2',
			{
                projection: new OpenLayers.Projection('EPSG:25831'),
				displayProjection: new OpenLayers.Projection('EPSG:25831'),
                units: 'm',
				maxExtent: new OpenLayers.Bounds(567000, 4406000, 614000, 4439000),
                maxResolution: 'auto',
				theme: null,
		        controls: [
		            new OpenLayers.Control.TouchNavigation({
		                dragPanOptions: {
		                    enableKinetic: true
		                }
		            }),
		            new OpenLayers.Control.Zoom({zoomInText: "", zoomOutText: ""})
		        ]   
			}		
		);
		
		//Capes WMS Base
		var layerRef2 = new OpenLayers.Layer.WMS(
				"Base referència WMS",
				"http://ide.cime.es/menorca/wms/base_referencia", 
				{layers: 
					[
						'ombres',
						'RE007RUS_municipis',
						'RE007RUS_entitatsurbanes',
						'OR007POR_limpn',
						'RE007RUS_equipaments',
						'RE007RUS_edificis25000',
						'RE007RUS_edificis10000',
						'RE007RUS_edificis5000',
						'RE007RUS_piscines',
						'RE007RUS_piscines_s2',
						'RE007RUS_torrents',
						'RE007RUS_zoneshumides',
						'RE007RUS_parets5000',
						'RE007RUS_parets25000',
						'RE007RUS_corvesnivell',
						'RE007RUS_xarxaviaria',
						'RE007RUS_xarxaviaria_s2',
						'RE007URB_carrer',
						'RE007URB_zverda',
						'RE007URB_vorera',
						'RE007URB_torrent',
						'RE007URB_places',
						'RE007URB_parking',
						'RE007URB_constru',
						'RE007URB_piscina',
						'RE007URB_eixcarrer',
						'RE007URB_portals',
						'RE007URB_arbres',
						'RE007URB_jardins',
						'RE007RUS_llocs',
						'RE007RUS_lterme',
						'RE007TOP_topo05',
						'RE007TOP_topo10',
						'RE007TOP_topo25',
						'RE007TOP_topo50',
						'RE007TOP_top100',
						'RE007RUS_costal',
						'RE007TOP_top200'
					],
					transparent: 'TRUE'
				},
				{isBaseLayer: true, visibility: true, opacity: 0.85}
			);
			
		layerOrto2 = new OpenLayers.Layer.WMS(
				"Ortofoto 2012",
				"http://ideib.caib.es/pub_ideib/public/IMATGES_OR2012_R25/MapServer/WMSServer", 
				{layers: ['0'],
					transparent: 'TRUE'
				},
				{isBaseLayer: true, visibility: true, opacity: 0.85}
			);			
			
			
        vectors2 = new OpenLayers.Layer.Vector(
            "markador",
            {
                styleMap: new OpenLayers.StyleMap({
                    "default": {
                        externalGraphic: "${icon}",
                        graphicWidth: "${width}",
                        graphicHeight: "${height}",
                        labelYOffset: 25,
                        graphicYOffset: -19,
                        label: "${etiqueta}"
                    }
                })
            }
        );		
		
		map2.addLayers([layerRef2,layerOrto2,vectors2]);
		map2.setCenter(new OpenLayers.LonLat(607227,4415490), 7);		
		
}		

function onFeatureSelect(feature){
	//Cidrem la funció detall quan fem un click al damunt
    for (var i=0; i<matriuPunts.length;i++)
    {
    	if (feature.id==matriuPunts[i].substr(0,matriuPunts[i].indexOf('#')))
    	{
	    	placeDetall(matriuPunts[i].substr(matriuPunts[i].indexOf('#')+1));
	    	break;	
    	}
    }
    
}
	

