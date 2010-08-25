/*
 * Javascript/Canvas Textured 3D Renderer v0.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com
 * This software is free to use for non-commercial purposes. For anything else, please contact the author.
 */

var Canvas3D = {};

(function() {

Canvas3D.addEvent = function(oObject, strEvent, fncAction) {
	if (oObject.addEventListener) { 
		oObject.addEventListener(strEvent, fncAction, false); 
	} else if (oObject.attachEvent) { 
		oObject.attachEvent("on" + strEvent, fncAction); 
	}
}

Canvas3D.Scene = function(oCanvas, iWidth, iHeight) {

	this._oDrawCanvas = oCanvas;
	this._oDrawContext = oCanvas.getContext("2d");

	Canvas3D.addEvent(oCanvas, "selectstart", function() {return false;});

	this._iWidth = iWidth;
	this._iHeight = iHeight;

	oCanvas.width = iWidth;
	oCanvas.height = iHeight;

	oCanvas.style.width = iWidth+"px";
	oCanvas.style.height = iHeight+"px";
	this._oActiveCamera = null;

	this._aObjects = [];

	this._bRunning = false;

	this._bMouseRotate = true;
	this._bMouseRotateY = true;
	this._bMouseRotateX = true;

	this._oUpVector = new Canvas3D.Vec3(0,1,0);

	this._oAmbientLight = {r:70,g:70,b:70};

	this._bDrawLights = false;
	this._aLights = [];

	var me = this;

	Canvas3D.addEvent(this._oDrawCanvas, "mousedown", 
		function(e) {
			e = e || window.event;
			me._iMouseDownX = e.clientX;
			me._iMouseDownY = e.clientY;
			me._bMouseIsDown = true;
		}
	);

	Canvas3D.addEvent(this._oDrawCanvas, "mouseup", 
		function(e) {
			e = e || window.event;
			me._bMouseIsDown = false;
		}
	);

	Canvas3D.addEvent(this._oDrawCanvas, "mousemove",
		function(e) {
			e = e || window.event;
			if (me._bMouseRotate) {
				if (me._bMouseIsDown) {
					var iMouseX = e.clientX;
					var iMouseY = e.clientY;
					var fDeltaX = (iMouseX - me._iMouseDownX) / 3;
					var fDeltaY = -((iMouseY - me._iMouseDownY) / 3);
					me.rotateCamera(fDeltaX, fDeltaY);
					me._iMouseDownX = e.clientX;
					me._iMouseDownY = e.clientY;
				}
			}
		}
	);


	Canvas3D.addEvent(document, "keydown",
		function(e) {
			e = e || window.event;
			var iKeyCode = e.keyCode;
			var oCam;
			if (iKeyCode == 107 || iKeyCode == 87) { // "+" or "w"
				if (oCam = me.getActiveCamera()) {
					oCam.setScale(oCam.getScale() * 1.5);
					//oCam.moveForward(50);
					//oCam.lookAt(oCam.getLookAt(), me.getUpVector());

				}
			}
			if (iKeyCode == 109 || iKeyCode == 83) { // "-" or "s"
				if (oCam = me.getActiveCamera()) {
					oCam.setScale(oCam.getScale() / 1.5);
					//oCam.moveForward(-50);
					//oCam.lookAt(oCam.getLookAt(), me.getUpVector());

				}
			}
		}
	);

}

Canvas3D.Scene.prototype.rotateCamera = function(fX, fY)
{
	var oCam = this.getActiveCamera();

	oCam.pitchAroundTarget(fY);
	oCam.yawAroundTarget(fX);

	oCam.lookAt(oCam.getLookAt(), this.getUpVector());
	oCam.updateRotationMatrix();
}


Canvas3D.Scene.prototype.setUpVector = function(oVec)
{
	this._oUpVector = oVec;
}

Canvas3D.Scene.prototype.getUpVector = function()
{
	return this._oUpVector;
}

Canvas3D.Scene.prototype.getAmbientLight = function()
{
	return this._oAmbientLight;
}

Canvas3D.Scene.prototype.zoomCamera = function(fZoom)
{
	this.getActiveCamera().moveForward(fZoom);
}

Canvas3D.Scene.prototype.getObjects = function()
{
	return this._aObjects;
}

Canvas3D.Scene.prototype.addObject = function(obj)
{
	this._aObjects.push(obj);
	obj.setScene(this);

	this.setDirty(true);
}

Canvas3D.Scene.prototype.addLight = function(oLight)
{
	oLight.setScene(this);
	return this._aLights.push(oLight);
}

Canvas3D.Scene.prototype.getLights = function()
{
	return this._aLights;
}


Canvas3D.Scene.prototype.clearObjects = function()
{
	this._aObjects = [];
}


Canvas3D.Scene.prototype.setActiveCamera = function(oCam)
{
	this._oActiveCamera = oCam;
}

Canvas3D.Scene.prototype.getActiveCamera = function()
{
	return this._oActiveCamera;
}

Canvas3D.Scene.prototype.begin = function()
{
	this._bRunning = true;
	this.getActiveCamera().setDirty(true);
	this.drawAll();
	var me = this;
	this._iInterval = setInterval(function() { me.drawAll(); }, 50);
}

Canvas3D.Scene.prototype.end = function()
{
	this._bRunning = false;
	clearInterval(this._iInterval);
}

Canvas3D.Scene.prototype.setDirty = function(bDirty)
{
	this._bDirty = bDirty;
}

Canvas3D.Scene.prototype.getDirty = function()
{
	return this._bDirty;
}

Canvas3D.Scene.prototype.drawAll = function()
{
	if (!this._bRunning) return;

	var oCam = this.getActiveCamera();

	var iOffsetX = Math.floor(this._iWidth / 2);
	var iOffsetY = Math.floor(this._iHeight / 2);

	var aObjects = this._aObjects;
	var bCamDirty = oCam.getDirty();

	if (bCamDirty || this.getDirty()) {
		this._oDrawContext.clearRect(0,0,this._iWidth,this._iHeight);



		for (var c=0;c<aObjects.length;c++) {
			var oObject = aObjects[c];
			oObject.draw(this._oDrawContext, iOffsetX, iOffsetY);
		}
		if (this._bDrawLights) {
			for (var c=0;c<this._aLights.length;c++) {
				var oLight = this._aLights[c];
				oLight.draw(this._oDrawContext, iOffsetX, iOffsetY);
			}
		}
	}
	oCam.setDirty(false);
	this.setDirty(false);

}

})();
