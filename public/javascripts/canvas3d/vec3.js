/*
 * Javascript/Canvas Textured 3D Renderer v0.2
 * Copyright (c) 2008 Jacob Seidelin, cupboy@gmail.com
 * This software is free to use for non-commercial purposes. For anything else, please contact the author.
 */

(function() {

Canvas3D.Vec3 = function(vx, vy, vz) 
{
	this.x = vx;
	this.y = vy;
	this.z = vz;
}

Canvas3D.Vec3.prototype.set = function(vx, vy, vz) {
	this.x = vx;
	this.y = vy;
	this.z = vz;
}

Canvas3D.Vec3.prototype.addVector = function(V) {
	this.x += V.x;
	this.y += V.y;
	this.z += V.z;
}

Canvas3D.Vec3.prototype.subVector = function(V) {
	this.x -= V.x;
	this.y -= V.y;
	this.z -= V.z;
}

Canvas3D.Vec3.prototype.returnAdd = function(V) {
	return new Canvas3D.Vec3(this.x + V.x, this.y + V.y, this.z + V.z);
}

Canvas3D.Vec3.prototype.returnSub = function(V) {
	return new Canvas3D.Vec3(this.x - V.x, this.y - V.y, this.z - V.z);
}

Canvas3D.Vec3.prototype.clone = function() {
	return new Canvas3D.Vec3(this.x, this.y, this.z);
}

Canvas3D.Vec3.prototype.dot = function(V) {
	return ((this.x * V.x) + (this.y * V.y) + (this.z * V.z));
}

Canvas3D.Vec3.prototype.cross = function(V) {
	var vx = V.x;
	var vy = V.y;
	var vz = V.z;
	return new Canvas3D.Vec3((this.y * vz) - (this.z * vy), (this.z * vx) - (this.x * vz), (this.x * vy) - (this.y * vx));
}

Canvas3D.Vec3.prototype.length = function() {
	return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
}

Canvas3D.Vec3.prototype.unit = function() {
	var l = 1/Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
	return new Canvas3D.Vec3(this.x * l, this.y * l, this.z * l);
}

})();
