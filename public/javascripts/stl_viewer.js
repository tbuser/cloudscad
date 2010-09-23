// var canvasWidth = 800;
// var canvasHeight = 350;

var canvasWidth = parseFloat(document.defaultView.getComputedStyle(document.getElementById('main'),null).getPropertyValue('width'));
var canvasHeight = 300;

window.onresize = function () {
  var canvasWidth = parseFloat(document.defaultView.getComputedStyle(document.getElementById('main'),null).getPropertyValue('width'));
  var canvasHeight = 300;

  if (renderer) {
    renderer.setSize(canvasWidth, 300);
    camera.projectionMatrix = THREE.Matrix4.makePerspective(70, canvasWidth/ canvasHeight, 1, 10000);
  }
}

var container;
var stats;

var camera;
var scene;
var renderer;

var stl, plane;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var view;
var info;

var timer;
var rotateTimer;

if (typeof(stl_string) == "undefined") {
  stl_string = "";
}

if (document.getElementById('canvas_container') != null) {
  initScene("canvas_container");
  sceneLoop();
  // timer = setInterval(sceneLoop, 1000/60);
}

function initScene(containerId) {

  container = document.getElementById(containerId);
  container.style.position = 'relative';
  container.innerHTML = "";

	info = document.createElement('div');
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = 'Loading STL...';
	container.appendChild(info);

	camera = new THREE.Camera( 70, canvasWidth / canvasHeight, 1, 10000 );
	scene = new THREE.Scene();

	// STL

  load_stl_string(stl_string);
  
	// Plane

	plane = new THREE.Mesh( new Plane( 100, 100, 10, 10 ), new THREE.MeshColorStrokeMaterial( 0xafafaf, 0.5, 1) );
  // plane.rotation.x = -90 * ( Math.PI / 180 );        
  scene.addObject(plane);

	renderer = new THREE.CanvasRenderer();
	renderer.setSize(canvasWidth, canvasHeight);

  renderer.domElement.style.backgroundColor = "#606060";
	container.appendChild(renderer.domElement);

  camera_view("diagonal");
  stl_material("solid");

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild(stats.domElement);

  renderer.domElement.addEventListener('mouseover', onDocumentMouseOver, false);
  renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);
	renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

	renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
	renderer.domElement.addEventListener('touchend', onDocumentTouchEnd, false);
	renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
	
  renderer.domElement.addEventListener('DOMMouseScroll', onDocumentScroll, false);
	renderer.domElement.addEventListener('mousewheel', onDocumentScroll, false);
	renderer.domElement.addEventListener('gesturechange', onDocumentGestureChange, false);      	
}

//

function onDocumentScroll(event) {
  event.preventDefault();

  var rolled = 0;

  if (event.wheelDelta === undefined) {
    // Firefox
    // The measurement units of the detail and wheelDelta properties are different.
    rolled = -40 * event.detail;
  } else {
    rolled = event.wheelDelta;
  }

  if (rolled > 0) {
    // up
    camera_zoom(+5);
  } else {
    // down
    camera_zoom(-5);
  }
}

function onDocumentGestureChange(event) {
  event.preventDefault();

  if (event.scale > 1) {
    camera_zoom(+5);
  } else {
    camera_zoom(-5);
  }
}

function onDocumentMouseOver(event) {
  targetRotation = stl.rotation.z;
  
  timer = setInterval(sceneLoop, 1000/60);
  // renderer.domElement.addEventListener('mouseout', onDocumentMouseOut, false);
}

// function onDocumentMouseOut(event) {
//   clearInterval(timer);
//   timer = nil;
// }

function onDocumentMouseDown( event ) {
	event.preventDefault();

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('mouseout', onDocumentMouseOut, false);

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp( event ) {
	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	document.removeEventListener('mouseup', onDocumentMouseUp, false);
	document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut( event ) {
  clearInterval(timer);
  timer = null;
  targetRotation = stl.rotation.z;
  
	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	document.removeEventListener('mouseup', onDocumentMouseUp, false);
	document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart( event ) {
  targetRotation = stl.rotation.z;
  
  timer = setInterval(sceneLoop, 1000/60);
  
	if (event.touches.length == 1) {
		event.preventDefault();

		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}
}

function onDocumentTouchEnd(event) {
  clearInterval(timer);
  timer = null;
  targetRotation = stl.rotation.z;
}

function onDocumentTouchMove( event ) {
	if (event.touches.length == 1) {
		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
	}
}

function sceneLoop() {
  if (stats) {
    if (view == "bottom") {
      plane.rotation.z = stl.rotation.z -= (targetRotation + stl.rotation.z) * 0.05;
    } else {
      plane.rotation.z = stl.rotation.z += (targetRotation - stl.rotation.z) * 0.05;
    }

  	renderer.render(scene, camera);
  	stats.update();
  }
}

function rotateLoop() {
  targetRotation += 0.01;
  sceneLoop();
}

function toggleRotate() {
  if (rotateTimer == null) {
    rotateTimer = setInterval(rotateLoop, 1000/60);
  } else {
    clearInterval(rotateTimer);
    rotateTimer = null;
  }
}

function camera_view(dir) {
  view = dir;
  if (dir == "top") {
    plane.flipSided = false;
    camera.position.y = 0;
    camera.position.z = 100;
    // camera.target.position.y = 30;
  } else if (dir == "side") {
    plane.flipSided = false;
    camera.position.y = 100;
    camera.position.z = -0.1;
  } else if (dir == "bottom") {
    plane.flipSided = true;
    camera.position.y = 0;
    camera.position.z = -100;
    // camera.target.position.y = 30;
  } else {
    plane.flipSided = false;
    camera.position.y = -100;
    camera.position.z = 100;
  }
  targetRotation = 0;
  plane.rotation.z = stl.rotation.z = 0;
  
  sceneLoop();
}

function camera_zoom(factor) {
  if (view == "top") {
    camera.position.z -= factor;
  } else if (view == "bottom") {
    camera.position.z += factor;
  } else if (view == "side") {
    camera.position.y -= factor;
  } else {
    camera.position.y += factor;
    camera.position.z -= factor;
  }
  
  sceneLoop();
}

function stl_material(type) {
	scene.removeObject(stl);
  if (type == "wireframe") {
    stl = new THREE.Mesh(geometry, new THREE.MeshColorStrokeMaterial( 0x000, 1, 1) );
		scene.addObject(stl);
  } else {
    stl = new THREE.Mesh(geometry, new THREE.MeshFaceColorFillMaterial() );
		scene.addObject(stl);
  }
  
  sceneLoop();
}

function load_stl_string(stl_string) {
	scene.removeObject(stl);

  geometry = new STLGeometry(stl_string);

	for (var i = 0; i < geometry.faces.length; i++) {
    // geometry.faces[i].color.setRGBA( Math.random() * 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );
    geometry.faces[i].color.setRGBA( Math.random() * 0.5, Math.random() * 0.5 + 0.5, 1, 1 );
    // geometry.faces[i].color.setRGBA( 0, 1, 0, 0.5 );
	}

  // stl = new THREE.Mesh(geometry, new THREE.MeshFaceColorFillMaterial() );
  // stl = new THREE.Mesh(geometry, new THREE.MeshColorFillMaterial( 0xe0e0e0 ) );
  stl = new THREE.Mesh(geometry, new THREE.MeshFaceColorFillMaterial() );
  // stl.position.y = 5;
  // stl.rotation.x = -90 * ( Math.PI / 180 );
  // stl.doubleSided = true;
  // stl.flipSided = true;
  // stl.overdraw = true;
	scene.addObject(stl);

  info.innerHTML = 'Finished Loading ' + geometry.faces.length + ' faces';
  
  sceneLoop();
}
