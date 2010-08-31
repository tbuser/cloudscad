var canvasWidth = 800;
var canvasHeight = 350;

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

if (typeof(stl_string) == "undefined") {
  stl_string = "";
}

if (document.getElementById('canvas_container') != null) {
  initScene("canvas_container");
  setInterval(sceneLoop, 1000/60);
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

  top_button = document.createElement('button');
  top_button.style.position = 'absolute';
  top_button.style.top = '10px';
  top_button.style.right = '10px';
  top_button.innerHTML = 'Top View';
  top_button.onclick = function(e){camera_view("top");};
  container.appendChild(top_button);

  side_button = document.createElement('button');
  side_button.style.position = 'absolute';
  side_button.style.top = '30px';
  side_button.style.right = '10px';
  side_button.innerHTML = 'Side View';
  side_button.onclick = function(e){camera_view("side");};
  container.appendChild(side_button);

  bottom_button = document.createElement('button');
  bottom_button.style.position = 'absolute';
  bottom_button.style.top = '50px';
  bottom_button.style.right = '10px';
  bottom_button.innerHTML = 'Bottom View';
  bottom_button.onclick = function(e){camera_view("bottom");};
  container.appendChild(bottom_button);

  diagonal_button = document.createElement('button');
  diagonal_button.style.position = 'absolute';
  diagonal_button.style.top = '70px';
  diagonal_button.style.right = '10px';
  diagonal_button.innerHTML = 'Diagonal View';
  diagonal_button.onclick = function(e){camera_view("diagonal");};
  container.appendChild(diagonal_button);

  zoom_in_button = document.createElement('button');
  zoom_in_button.style.position = 'absolute';
  zoom_in_button.style.top = '50px';
  // zoom_in_button.style.right = '10px';
  zoom_in_button.innerHTML = 'Zoom +';
  zoom_in_button.onclick = function(e){camera_zoom(5);};
  container.appendChild(zoom_in_button);

  zoom_out_button = document.createElement('button');
  zoom_out_button.style.position = 'absolute';
  zoom_out_button.style.top = '70px';
  // zoom_out_button.style.right = '10px';
  zoom_out_button.innerHTML = 'Zoom -';
  zoom_out_button.onclick = function(e){camera_zoom(-5);};
  container.appendChild(zoom_out_button);

  wireframe_button = document.createElement('button');
  wireframe_button.style.position = 'absolute';
  wireframe_button.style.top = '90px';
  // wireframe_button.style.right = '10px';
  wireframe_button.innerHTML = 'Wireframe';
  wireframe_button.onclick = function(e){stl_material("wireframe");};
  container.appendChild(wireframe_button);

  solid_button = document.createElement('button');
  solid_button.style.position = 'absolute';
  solid_button.style.top = '110px';
  // solid_button.style.right = '10px';
  solid_button.innerHTML = 'Solid';
  solid_button.onclick = function(e){stl_material("solid");};
  container.appendChild(solid_button);

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

	renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
	renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
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

	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	document.removeEventListener('mouseup', onDocumentMouseUp, false);
	document.removeEventListener('mouseout', onDocumentMouseOut, false);
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

  if (view == "bottom") {
    plane.rotation.z = stl.rotation.z -= (targetRotation + stl.rotation.z) * 0.05;
  } else {
    plane.rotation.z = stl.rotation.z += (targetRotation - stl.rotation.z) * 0.05;
  }

	renderer.render(scene, camera);
	stats.update();
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
}
