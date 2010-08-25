/* Author: Tony Buser

*/

jQuery.ajaxSetup({  
  'beforeSend': function (xhr) {xhr.setRequestHeader("Accept", "text/javascript")}  
});

jQuery.fn.submitWithAjax = function () {  
  this.submit(function () {  
    $.post($(this).attr('action'), $(this).serialize(), null, "script");  
    return false;  
  });  
};

$(document).ready(function() {
  $('#custom_preview').click(function() {
    $.get($(this).attr('action'), $('#custom_form').serialize(), null, "script");  
    return false;  
  });
});







var canvasWidth = 800;
var canvasHeight = 350;

var stats;
var container;

var camera;
var scene;
var renderer;

/*var cube, plane;*/
var mesh;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

initScene("canvas_container");
/*setInterval(sceneLoop, 1000/60);*/

function initScene(containerId) {

  container = document.getElementById(containerId);
  container.style.position = 'relative';
  container.innerHTML = "";

  camera = new THREE.Camera( 75, canvasWidth / canvasHeight, 0.0001, 10000 );
  camera.position.z = -1000;

  scene = new THREE.Scene();

  renderer = new THREE.CanvasRenderer();
  renderer.setSize(canvasWidth, canvasHeight);

  // initBitmapMaterial(texturePath);

  // mesh = new THREE.Mesh(new Rat(), material);
  // mesh.scale.x = mesh.scale.y = mesh.scale.z = 50;
  // scene.addObject(mesh);

  renderer.domElement.style.backgroundColor = "#606060";
  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);

  //renderer.domElement.addEventListener('mouseover', onCanvasMouseOver, false);
  //renderer.domElement.addEventListener('mouseout', onCanvasMouseOut, false);
  //renderer.domElement.addEventListener('mousemove', onCanvasMouseMove, false);

/*  container = document.createElement('div');
  document.body.appendChild(container);

  var info = document.createElement('div');
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = 'Drag to spin the cube';
  container.appendChild(info);

  camera = new THREE.Camera( 70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
  camera.position.y = 150;
  camera.position.z = 500;
  camera.target.position.y = 150;

  scene = new THREE.Scene();

  // Cube

  geometry = new Cube( 200, 200, 200 );

  for (var i = 0; i < geometry.faces.length; i++) {

    geometry.faces[i].color.setRGBA( Math.random() * 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );
  }

  cube = new THREE.Mesh(geometry, new THREE.MeshFaceColorFillMaterial() );
  cube.position.y = 150;
  scene.addObject(cube);

  // Plane

  plane = new THREE.Mesh( new Plane( 200, 200, 4, 4 ), new THREE.MeshColorFillMaterial( 0xe0e0e0 ) );
  plane.rotation.x = -90 * ( Math.PI / 180 );
  scene.addObject(plane);

  renderer = new THREE.CanvasRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild(stats.domElement);
*/
	renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
	renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
	renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
}

//

function onDocumentMouseDown( event ) {

	event.preventDefault();

	renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
	renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
	renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp( event ) {

	renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
	renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
	renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut( event ) {

	renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
	renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
	renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart( event ) {

	if(event.touches.length == 1) {

		event.preventDefault();

		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;

	}
}

function onDocumentTouchMove( event ) {

	if(event.touches.length == 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

	}
}

//

function sceneLoop() {

/*  plane.rotation.z = cube.rotation.y += (targetRotation - cube.rotation.y) * 0.05;*/
  mesh.rotation.y += (targetRotation - mesh.rotation.y) * 0.05;

	renderer.render(scene, camera);
	stats.update();
}






/*var CloudSCADMesh = function () {

  THREE.Geometry.call(this);

  var scope = this;

  
  
      v(-5.0, -5.0, 0.0);
      v(-5.0, -5.0, 10.0);
      v(-5.0, 5.0, 0.0);
      v(-5.0, 5.0, 10.0);
      v(5.0, -5.0, 0.0);
      v(5.0, -5.0, 10.0);
      v(1.24698, 1.563663, 0.0);
      v(5.0, 5.0, 0.0);
      v(-1.801938, 0.867767, 0.0);
      v(-1.801938, -0.867767, 0.0);
      v(-0.445042, -1.949856, 0.0);
      v(1.24698, -1.563663, 0.0);
      v(2.0, 0.0, 0.0);
      v(-0.445042, 1.949856, 0.0);
      v(5.0, 5.0, 10.0);
      v(-0.445042, -1.949856, 10.0);
      v(-1.801938, -0.867767, 10.0);
      v(-1.801938, 0.867767, 10.0);
      v(-0.445042, 1.949856, 10.0);
      v(1.24698, 1.563663, 10.0);
      v(2.0, 0.0, 10.0);
      v(1.24698, -1.563663, 10.0);
  
      f3(2, 1, 0);
      f3(3, 1, 2);
      f3(4, 0, 1);
      f3(4, 1, 5);
      f3(7, 2, 6);
      f3(8, 2, 0);
      f3(9, 8, 0);
      f3(10, 9, 0);
      f3(4, 10, 0);
      f3(10, 4, 11);
      f3(11, 4, 12);
      f3(7, 12, 4);
      f3(6, 2, 13);
      f3(7, 6, 12);
      f3(13, 2, 8);
      f3(7, 3, 2);
      f3(14, 3, 7);
      f3(5, 1, 15);
      f3(16, 1, 3);
      f3(17, 16, 3);
      f3(18, 3, 14);
      f3(5, 19, 14);
      f3(19, 18, 14);
      f3(5, 20, 19);
      f3(5, 21, 20);
      f3(5, 15, 21);
      f3(15, 1, 16);
      f3(3, 18, 17);
      f3(7, 4, 5);
      f3(7, 5, 14);
      f3(17, 18, 13);
      f3(17, 13, 8);
      f3(16, 17, 8);
      f3(16, 8, 9);
      f3(18, 19, 6);
      f3(18, 6, 13);
      f3(12, 19, 20);
      f3(6, 19, 12);
      f3(21, 12, 20);
      f3(11, 12, 21);
      f3(15, 11, 21);
      f3(10, 11, 15);
      f3(16, 10, 15);
      f3(9, 10, 16);
  
  function v(x, y, z) {

    scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
  }

  function f3(a, b, c) {

    scope.faces.push( new THREE.Face3( a, b, c ) );
  }

  this.computeNormals();

}

CloudSCADMesh.prototype = new THREE.Geometry();
CloudSCADMesh.prototype.constructor = CloudSCADMesh;

geometry = new CloudSCADMesh();

for (var i = 0; i < geometry.faces.length; i++) {
  geometry.faces[i].color.setRGBA( Math.random() * 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );
}

mesh = new THREE.Mesh(geometry, new THREE.MeshFaceColorFillMaterial());
mesh.scale.x = mesh.scale.y = mesh.scale.z = 50;
scene.addObject(mesh);

setInterval(sceneLoop, 1000/60);*/
