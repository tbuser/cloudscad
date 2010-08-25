/*
 * Canvas 3D
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com
 * This software is free to use for non-commercial purposes. For anything else, please contact the author.
 */

//(function(){

var $$$ = function(id) {return document.getElementById(id);};

function HTTPRequest(strURL, fncCallBack)
{
	var oHTTP = null;
	if (window.XMLHttpRequest) {
		oHTTP = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (oHTTP) {
		if (fncCallBack) {
			if (typeof(oHTTP.onload) != "undefined")
				oHTTP.onload = function() {
					fncCallBack(this);
				};
			else {
				oHTTP.onreadystatechange = function() {
					if (this.readyState == 4) {
						fncCallBack(this);
					}
				};
			}
		}
		oHTTP.open("GET", strURL, true);
		oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		oHTTP.send(null);
	}

}

var oScene;

function init() 
{

	oScene = new Canvas3D.Scene($$$("scene"), 800, 300);

	var oCam = new Canvas3D.Camera();

	oCam.setPosition(new Canvas3D.Vec3(0,0,-100));

	oCam.setScale(3);

	oCam.lookAt(new Canvas3D.Vec3(0,0,0), oScene.getUpVector());

	oCam.updateRotationMatrix();

	oScene.setActiveCamera(oCam);

	oLight = new Canvas3D.Light();
	oLight.setPosition(new Canvas3D.Vec3(50,100,0));
	oLight.setIntensity(1);
	oScene.addLight(oLight);

	oLight2 = new Canvas3D.Light();
	oLight2.setPosition(new Canvas3D.Vec3(0,0,-100));
	oLight2.setIntensity(1);
	oScene.addLight(oLight2);

	oScene.begin();

	Canvas3D.addEvent($$$("meshlist"), "change", onListChange);
                    
	Canvas3D.addEvent($$$("chkrenderlights"), "change", onRenderLightsChange);
	Canvas3D.addEvent($$$("chklighting"), "change", onLightingChange);
	Canvas3D.addEvent($$$("chkbackface"), "change", onBackfaceChange);
	Canvas3D.addEvent($$$("chkzsort"), "change", onZSortChange);
	Canvas3D.addEvent($$$("chkfill"), "change", onFillChange);
	Canvas3D.addEvent($$$("chkwire"), "change", onWireChange);
	Canvas3D.addEvent($$$("chktexture"), "change", onTextureChange);
	Canvas3D.addEvent($$$("chktextureshading"), "change", onTextureShadingChange);

}

function onSceneLoaded(oHTTP) 
{
	var oSceneData = eval("("+oHTTP.responseText+")");

	if (oSceneData) {
		var oMesh = new Canvas3D.Mesh();

		oMesh._bShading = $$$("chklighting").checked;
		oMesh._bWire = $$$("chkwire").checked;
		oMesh._bFill = $$$("chkfill").checked;
		oMesh._bZSort = $$$("chkzsort").checked;
		oMesh._bBackfaceCull = $$$("chkbackface").checked;
		oMesh._bTexture = $$$("chktexture").checked;
		oMesh._bTextureShading = $$$("chktextureshading").checked;

		oMesh.setMeshData(oSceneData, oScene);
		oScene.clearObjects();
		oScene.addObject(oMesh);

		$$$("sceneinfo").innerHTML = "Scene currently has " + oMesh._aVertices.length + " vertices, " + oMesh._aFaces.length + " faces"
	}
}

function onListChange()
{
	var oList = $$$("meshlist");
	if (oList.options[oList.selectedIndex]) {
		HTTPRequest("scenes/" + oList.options[oList.selectedIndex].value + ".json3d", onSceneLoaded);		
	}
}


function onRenderLightsChange()
{
	oScene._bDrawLights = $$$("chkrenderlights").checked;
	oScene.setDirty(true);
}

function onLightingChange()
{
	var aObjects = oScene.getObjects();
	for (var i=0;i<aObjects.length;i++) {
		if (aObjects[i].setLighting) {
			aObjects[i].setLighting($$$("chklighting").checked)
		}
	}
	oScene.setDirty(true);
}

function onBackfaceChange()
{
	var aObjects = oScene.getObjects();
	for (var i=0;i<aObjects.length;i++) {
		if (aObjects[i].setBackfaceCull) {
			aObjects[i].setBackfaceCull($$$("chkbackface").checked)
		}
	}
	oScene.setDirty(true);
}

function onZSortChange()
{
	var aObjects = oScene.getObjects();
	for (var i=0;i<aObjects.length;i++) {
		if (aObjects[i].setZSort) {
			aObjects[i].setZSort($$$("chkzsort").checked)
		}
	}
	oScene.setDirty(true);
}

function onFillChange()
{
	var aObjects = oScene.getObjects();
	for (var i=0;i<aObjects.length;i++) {
		if (aObjects[i].setFill) {
			aObjects[i].setFill($$$("chkfill").checked)
		}
	}
	oScene.setDirty(true);
}

function onWireChange()
{
	var aObjects = oScene.getObjects();
	for (var i=0;i<aObjects.length;i++) {
		if (aObjects[i].setWire) {
			aObjects[i].setWire($$$("chkwire").checked)
		}
	}
	oScene.setDirty(true);
}

function onTextureChange()
{
	var aObjects = oScene.getObjects();
	for (var i=0;i<aObjects.length;i++) {
		if (aObjects[i].setTexture) {
			aObjects[i].setTexture($$$("chktexture").checked)
		}
	}
	oScene.setDirty(true);
}

function onTextureShadingChange()
{
	var aObjects = oScene.getObjects();
	for (var i=0;i<aObjects.length;i++) {
		if (aObjects[i].setTextureShading) {
			aObjects[i].setTextureShading($$$("chktextureshading").checked)
		}
	}
	oScene.setDirty(true);
}



Canvas3D.addEvent(window, "load", init);

//})();
