/*
 * Javascript/Canvas Textured 3D Renderer v0.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com
 * This software is free to use for non-commercial purposes. For anything else, please contact the author.
 */

Canvas3D.Camera = function() {

	this._oPosition = new Canvas3D.Vec3(0,0,0);

	this._oSideVec = new Canvas3D.Vec3(1,0,0);
	this._oUpVec = new Canvas3D.Vec3(0,1,0);
	this._oOutVec = new Canvas3D.Vec3(0,0,1);

	this._oRotMat = new Canvas3D.Matrix3();

	this._bDirty = false;
	this._iFocal = 500;

	this._iClipNear = 1;
	this._iClipFar = 10000000;

	this._fScale = 1;

	this._oLookAt = new Canvas3D.Vec3(0,0,0);

};

Canvas3D.Camera.prototype.getDirty = function()
{
	return this._bDirty;
}

Canvas3D.Camera.prototype.setDirty = function(bDirty)
{
	this._bDirty = bDirty;
}

Canvas3D.Camera.prototype.setPosition = function(oPos)
{
	this._oPosition.set(oPos.x, oPos.y, oPos.z);
}

Canvas3D.Camera.prototype.getPosition = function()
{
	return this._oPosition;
}

Canvas3D.Camera.prototype.setScale = function(fScale)
{
	this._fScale = fScale;
	this._bDirty = true;
}

Canvas3D.Camera.prototype.getScale = function()
{
	return this._fScale;
}

Canvas3D.Camera.prototype.getSide = function()
{
	return this._oSideVec;
}

Canvas3D.Camera.prototype.getUp = function()
{
	return this._oUpVec;
}

Canvas3D.Camera.prototype.getOut = function()
{
	return this._oOutVec;
}


Canvas3D.Camera.prototype.moveSideways = function(d)
{
	this._oPosition.x += this._oSideVec.x * d;
	this._oPosition.y += this._oSideVec.y * d;
	this._oPosition.z += this._oSideVec.z * d;
	this.setDirty(true);
}

Canvas3D.Camera.prototype.moveUpwards = function(d)
{
	this._oPosition.x += this._oUpVec.x * d;
	this._oPosition.y += this._oUpVec.y * d;
	this._oPosition.z += this._oUpVec.z * d;
	this.setDirty(true);
}

Canvas3D.Camera.prototype.moveForward = function(d)
{
	this._oPosition.x += this._oOutVec.x * d;
	this._oPosition.y += this._oOutVec.y * d;
	this._oPosition.z += this._oOutVec.z * d;
	this.setDirty(true);
}

// rotate around the camera's side axis with a target center point (uses camera target if oTarget is null)
Canvas3D.Camera.prototype.pitchAroundTarget = function(fTheta, oTarget)
{
	var M = new Canvas3D.Matrix3();
	var oPos = this.getPosition();
	oTarget = oTarget || this.getLookAt();

	// translate position to target space
	oPos.subVector(oTarget);

	// rotate around side axis
	M.loadRotationAxis(this._oSideVec, Math.sin(fTheta * Math.PI / 180.0), Math.cos(fTheta * Math.PI / 180.0));
	oPos = M.multiplyVector(oPos);

	// translate position out of target space
	oPos.addVector(oTarget);

	this.setPosition(oPos);
	this.setDirty(true);
}

// rotate around the camera's up axis with a target center point (uses camera target if oTarget is null)
Canvas3D.Camera.prototype.yawAroundTarget = function(fTheta, oTarget)
{
	var M = new Canvas3D.Matrix3();
	var oPos = this.getPosition();
	oTarget = oTarget || this.getLookAt();

	// translate position to target space
	oPos.subVector(oTarget);

	// rotate around up axis
	M.loadRotationAxis(this._oUpVec, Math.sin(fTheta * Math.PI / 180.0), Math.cos(fTheta * Math.PI / 180.0));
	oPos = M.multiplyVector(oPos);

	// translate position out of target space
	oPos.addVector(oTarget);

	this.setPosition(oPos);
	this.setDirty(true);
}


// rotate around the camera's out axis with a target center point (uses camera target if oTarget is null)
Canvas3D.Camera.prototype.rollAroundTarget = function(fTheta, oTarget)
{
	var M = new Canvas3D.Matrix3();
	var oPos = this.getPosition();
	oTarget = oTarget || this.getLookAt();

	// translate position to target space
	oPos.subVector(oTarget);

	// rotate around out axis
	M.loadRotationAxis(this._oOutVec, Math.sin(fTheta * Math.PI / 180.0), Math.cos(fTheta * Math.PI / 180.0));
	oPos = M.multiplyVector(oPos);

	// translate position out of target space
	oPos.addVector(oTarget);

	this.setPosition(oPos);
	this.setDirty(true);
}


Canvas3D.Camera.prototype.lookAt = function(P, Up)
{
	Up = Up || this._oUpVec;
	this._oOutVec  = P.returnSub(this._oPosition).unit();

	//this._oSideVec = this._oOutVec.cross(new Canvas3D.Vec3 (0.0, 1.0, 0.0)).unit();
	//this._oSideVec = this._oOutVec.cross(this._oUpVec).unit();
	this._oSideVec = this._oOutVec.cross(Up).unit();
	this._oUpVec   = this._oSideVec.cross(this._oOutVec).unit();
	this._vecLookAt = P.clone();
	this.setDirty(true);
}

Canvas3D.Camera.prototype.getLookAt = function() {
	return this._vecLookAt;
}

Canvas3D.Camera.prototype.updateRotationMatrix = function()
{
	var e0 = this._oRotMat.e[0];
	var e1 = this._oRotMat.e[1];
	var e2 = this._oRotMat.e[2];

	e0[0] = this._oSideVec.x;
	e0[1] = this._oSideVec.y;
	e0[2] = this._oSideVec.z;

	e1[0] = this._oUpVec.x;
	e1[1] = this._oUpVec.y;
	e1[2] = this._oUpVec.z;

	e2[0] = this._oOutVec.x;
	e2[1] = this._oOutVec.y;
	e2[2] = this._oOutVec.z;
}

Canvas3D.Camera.prototype.transformPoint = function(P)
{
	var e = this._oRotMat.e;
	var oPos = this._oPosition;

	var e0 = e[0];
	var e1 = e[1];
	var e2 = e[2];

	var vx = P.x - oPos.x;
	var vy = P.y - oPos.y;
	var vz = P.z - oPos.z;

	return new Canvas3D.Vec3(
		vx * e0[0] + vy * e0[1] + vz * e0[2],
		vx * e1[0] + vy * e1[1] + vz * e1[2],
		vx * e2[0] + vy * e2[1] + vz * e2[2]
	);
}

Canvas3D.Camera.prototype.transform2D = function(P)
{
	var iFocal = this._iFocal;
	return {
		x:-(P.x * iFocal / (P.z + iFocal))*this._fScale,
		y:-(P.y * iFocal / (P.z + iFocal))*this._fScale
	};
}

Canvas3D.Camera.prototype.isBehind = function(P)
{
	if (P.z > 0) return false;
	return false;
}

Canvas3D.Camera.prototype.getClipNear = function()
{
	return this._iClipNear;
}

Canvas3D.Camera.prototype.getClipFar = function()
{
	return this._iClipFar;
}

Canvas3D.Camera.prototype.clip = function(P)
{
	if (P.z > this._iClipNear && P.z < this._iClipFar) {
		return false;
	} else {
		return true;
	}
}
