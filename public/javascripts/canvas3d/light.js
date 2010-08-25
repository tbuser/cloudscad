/*
 * Javascript/Canvas Textured 3D Renderer v0.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com
 * This software is free to use for non-commercial purposes. For anything else, please contact the author.
 */


Canvas3D.Light = function() {
	this._oPosition = new Canvas3D.Vec3(0,0,0);
	this._oColor = {r:255,g:255,b:255};
	this._fIntensity = 1.0;

};
	
Canvas3D.Light.prototype.setPosition = function(oPos) 
{
	this._oPosition = oPos;
}

Canvas3D.Light.prototype.getPosition = function() 
{
	return this._oPosition;
}

Canvas3D.Light.prototype.setColor = function(oColor) 
{
	this._oColor = oColor;
}

Canvas3D.Light.prototype.getColor = function() 
{
	return this._oColor;
}

Canvas3D.Light.prototype.setIntensity = function(fIntensity) 
{
	this._fIntensity = fIntensity;
}

Canvas3D.Light.prototype.getIntensity = function(fIntensity) 
{
	return this._fIntensity;
}

Canvas3D.Light.prototype.setScene = function(oScene)
{
	if (this._oScene != oScene) {
		this._oScene = oScene;
	}
}

Canvas3D.Light.prototype.draw = function(oContext, iOffsetX, iOffsetY) 
{
	var oScene = this._oScene;
	var oCam = oScene.getActiveCamera();

	var oPos2D = oCam.transform2D(oCam.transformPoint(this._oPosition));

	var iRadius = 3;

	oContext.beginPath();
	oContext.moveTo(oPos2D.x + iOffsetX + iRadius, oPos2D.y + iOffsetY);
	oContext.arc(oPos2D.x + iOffsetX, oPos2D.y + iOffsetY, iRadius, 0, 360, false);
	oContext.fillStyle = "rgb(255,255,0)";
	oContext.fill();
}
