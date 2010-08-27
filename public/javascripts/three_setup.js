var canvasWidth = 800;
var canvasHeight = 350;

var stats;
var container;

var camera;
var scene;
var renderer;

/*var cube, plane;*/
var mesh;

var mouseX = 0;
var mouseXOnMouseDown = 0;
var targetXRotation = 0;
var targetXRotationOnMouseDown = 0;
var targetXRotationOnMouseUp = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;
var targetYRotation = 0;
var targetYRotationOnMouseDown = 0;
var targetYRotationOnMouseUp = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var timer = 0;
var moving = 0;

initScene("canvas_container");
// setInterval(sceneLoop, 1000/60);

function initScene(containerId) {

  container = document.getElementById(containerId);
  container.style.position = 'relative';
  container.innerHTML = "";

  camera = new THREE.Camera( 75, canvasWidth / canvasHeight, 0.0001, 10000 );
  camera.position.z = -500;
  camera.position.x = 500;
  camera.position.y = 500;

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

	renderer.domElement.addEventListener('mousedown', onCanvasMouseDown, false);
	renderer.domElement.addEventListener('mousemove', onCanvasMouseMove, false);
	renderer.domElement.addEventListener('mouseup', onCanvasMouseUp, false);
	renderer.domElement.addEventListener('mouseout', onCanvasMouseOut, false);

  renderer.domElement.addEventListener('DOMMouseScroll', onCanvasScroll, false);

	renderer.domElement.addEventListener('touchstart', onCanvasTouchStart, false);
	renderer.domElement.addEventListener('touchmove', onCanvasTouchMove, false);
	renderer.domElement.addEventListener('gesturechange', onCanvasGestureChange, false);
}

//

function onCanvasScroll(event) {
  event.preventDefault();
  
  var rolled = 0;
  
  if (event.wheelDelta === undefined) {   // Firefox
          // The measurement units of the detail and wheelDelta properties are different.
      rolled = -40 * event.detail;
  }
  else {
      rolled = event.wheelDelta;
  }
  
  if (rolled > 0) {
    // up
    camera.position.z += 50;
  } else {
    // down
    camera.position.z -= 50;
  }
}

function onCanvasGestureChange(event) {
  event.preventDefault();
  
  if (event.scale > 1) {
    camera.position.z += event.scale * 10;
  } else {
    camera.position.z -= event.scale * 10;
  }
}

function onCanvasMouseDown(event) {
  event.preventDefault();

  moving = 1;

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetXRotation = targetXRotationOnMouseUp;
	targetXRotationOnMouseDown = targetXRotationOnMouseUp;

	mouseYOnMouseDown = event.clientY - windowHalfY;
	targetYRotation = targetYRotationOnMouseUp;
	targetYRotationOnMouseDown = targetYRotationOnMouseUp;
}

function onCanvasMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
	targetXRotation = targetXRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

	mouseY = event.clientY - windowHalfY;
	targetYRotation = targetYRotationOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
}

function onCanvasMouseUp(event) {
  targetXRotationOnMouseUp = targetXRotation;
  targetYRotationOnMouseUp = targetYRotation;
  moving = 0;  
}

function onCanvasMouseOut(event) {
  moving = 0;
}

function onCanvasTouchStart(event) {
	if (event.touches.length == 1) {
	  moving = 1;
    
		event.preventDefault();

		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		targetXRotationOnMouseDown = targetXRotation;

		mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
		targetYRotationOnMouseDown = targetYRotation;
	}
}

function onCanvasTouchMove(event) {
	if(event.touches.length == 1) {
		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		targetXRotation = targetXRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

		mouseY = event.touches[0].pageY - windowHalfY;
		targetYRotation = targetYRotationOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
	}
}

//

function sceneLoop() {
  // plane.rotation.z = cube.rotation.y += (targetRotation - cube.rotation.y) * 0.05;
  if (moving == 1) {
    //mesh.rotation.y += (targetXRotation - mesh.rotation.y) * 0.05;
    //mesh.rotation.x -= (targetYRotation + mesh.rotation.x) * 0.05;

    mesh.rotation.y = targetXRotation;
    mesh.rotation.x = targetYRotation;
  }

	//camera.position.x += (mouseX - camera.position.x) * 0.05;
	//camera.position.y += (-mouseY - camera.position.y) * 0.05;
	
	// mesh.rotation.y += 0.005;
	
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


var mySTLMesh = function(vertexes, faces) {
	THREE.Geometry.call(this);

	var scope = this;

  for (var i=0; i<vertexes.length; i++) {
    v(vertexes[i][0], vertexes[i][1], vertexes[i][2]);
    // log("vertex = " + vertexes[i][0] + ", " + vertexes[i][1] + ", " + vertexes[i][2]);
  }

  for (var i=0; i<faces.length; i++) {
    f3(faces[i][0], faces[i][1], faces[i][2]);
    // log("face = " + faces[i][0] + ", " + faces[i][1] + ", " + faces[i][2]);
  }

  function v(x, y, z) {
    scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
  }

  function f3(a, b, c) {
    scope.faces.push( new THREE.Face3( a, b, c ) );
  }

	this.computeNormals();
}

mySTLMesh.prototype = new THREE.Geometry();
mySTLMesh.prototype.constructor = mySTLMesh;

















// solid
//   facet normal -1.000000 0.000000 0.000000
//     outer loop
//       vertex -5.000000 -5.000000 5.000000
//       vertex -5.000000 5.000000 5.000000
//       vertex -5.000000 -5.000000 -5.000000
//     endloop
//   endfacet
//   facet normal -1.000000 -0.000000 0.000000
//     outer loop
//       vertex -5.000000 -5.000000 -5.000000
//       vertex -5.000000 5.000000 5.000000
//       vertex -5.000000 5.000000 -5.000000
//     endloop
//   endfacet
//   facet normal 0.000000 0.000000 1.000000
//     outer loop
//       vertex -5.000000 -5.000000 5.000000
//       vertex 5.000000 -5.000000 5.000000
//       vertex 5.000000 5.000000 5.000000
//     endloop
//   endfacet
//   facet normal 0.000000 -0.000000 1.000000
//     outer loop
//       vertex -5.000000 5.000000 5.000000
//       vertex -5.000000 -5.000000 5.000000
//       vertex 5.000000 5.000000 5.000000
//     endloop
//   endfacet
//   facet normal -0.000000 -1.000000 0.000000
//     outer loop
//       vertex -5.000000 -5.000000 -5.000000
//       vertex 5.000000 -5.000000 -5.000000
//       vertex 5.000000 -5.000000 5.000000
//     endloop
//   endfacet
//   facet normal 0.000000 -1.000000 0.000000
//     outer loop
//       vertex -5.000000 -5.000000 5.000000
//       vertex -5.000000 -5.000000 -5.000000
//       vertex 5.000000 -5.000000 5.000000
//     endloop
//   endfacet
//   facet normal 0.000000 0.000000 -1.000000
//     outer loop
//       vertex -5.000000 5.000000 -5.000000
//       vertex 5.000000 5.000000 -5.000000
//       vertex -5.000000 -5.000000 -5.000000
//     endloop
//   endfacet
//   facet normal -0.000000 0.000000 -1.000000
//     outer loop
//       vertex -5.000000 -5.000000 -5.000000
//       vertex 5.000000 5.000000 -5.000000
//       vertex 5.000000 -5.000000 -5.000000
//     endloop
//   endfacet
//   facet normal 0.000000 1.000000 -0.000000
//     outer loop
//       vertex -5.000000 5.000000 5.000000
//       vertex 5.000000 5.000000 5.000000
//       vertex -5.000000 5.000000 -5.000000
//     endloop
//   endfacet
//   facet normal 0.000000 1.000000 0.000000
//     outer loop
//       vertex -5.000000 5.000000 -5.000000
//       vertex 5.000000 5.000000 5.000000
//       vertex 5.000000 5.000000 -5.000000
//     endloop
//   endfacet
//   facet normal 1.000000 0.000000 0.000000
//     outer loop
//       vertex 5.000000 -5.000000 -5.000000
//       vertex 5.000000 5.000000 -5.000000
//       vertex 5.000000 5.000000 5.000000
//     endloop
//   endfacet
//   facet normal 1.000000 0.000000 -0.000000
//     outer loop
//       vertex 5.000000 -5.000000 5.000000
//       vertex 5.000000 -5.000000 -5.000000
//       vertex 5.000000 5.000000 5.000000
//     endloop
//   endfacet
// endsolid

// using plain javascript instead of jquery so that it's easily portable and I can share it...

// indexOf only finds strings? seriously Javascript, seriously?!
Array.prototype.indexOf = function(searchstring, indexstart) {
  if (indexstart == undefined) {
    indexstart = 0;
  }
  
	var result = -1;
	for (i=indexstart; i<this.length; i++) {
		if (this[i] == searchstring) {
			result = i;
			break;
		}
	}
	return result;
};

// FIXME: optimization me please!
function parse_stl(stl_data) {
  // build stl's vertex and face arrays
  
  var vertexes  = [];
  var normals   = [];
  var faces     = [];
  
  var face_vertexes = [];
  
  stl_data = stl_data.replace(/\n/g, " ");
  stl_data = stl_data.replace(/\s+/g, " ");

  // document.getElementById('debug').innerHTML = stl_data;

  facet_blocks = stl_data.match(/facet normal.*?endfacet/g);
  log("found " + facet_blocks.length + " blocks");
  for (var i=0; i<facet_blocks.length; i++) {
    facet_block = facet_blocks[i];
    // log(i + " BLOCK: " + facet_block + "\n");

    // FIXME: some STL files have extended notation like 1.12312e-12, should probably just split on spaces instead of regex...
    normal_blocks = /normal ([-+]?[0-9]*\.?[0-9]+) ([-+]?[0-9]*\.?[0-9]+) ([-+]?[0-9]*\.?[0-9]+) outer/.exec(facet_block);
    normal_points = [parseFloat(normal_blocks[1]), parseFloat(normal_blocks[2]), parseFloat(normal_blocks[3])];
    normals.push(normal_points);

    vertex_parts = facet_block.match(/vertex ([-+]?[0-9]*\.?[0-9]+) ([-+]?[0-9]*\.?[0-9]+) ([-+]?[0-9]*\.?[0-9]+) /g);
    for (var vpi=0; vpi<vertex_parts.length; vpi++) {      
      vertex_part = vertex_parts[vpi];
      // console.log("vertex_part = " + vertex_part);
      vertex_blocks = /vertex ([-+]?[0-9]*\.?[0-9]+) ([-+]?[0-9]*\.?[0-9]+) ([-+]?[0-9]*\.?[0-9]+)/.exec(vertex_part);
      vertex_points = [parseFloat(vertex_blocks[1]), parseFloat(vertex_blocks[2]), parseFloat(vertex_blocks[3])];
      
      if (vertexes.indexOf(vertex_points) == -1) {
        vertexes.push(vertex_points);
      }

      if (face_vertexes[i] == undefined) {
        face_vertexes[i] = [];
      }
      face_vertexes[i].push(vertex_points);
    }
  }

  log("calculating faces")
  for (var i=0; i<face_vertexes.length; i++) {
    // log("face vertex " + i + " = " + face_vertexes[i]);
    
    if (faces[i] == undefined) {
      faces[i] = [];
    }
  
    for (var fvi=0; fvi<face_vertexes[i].length; fvi++) {
      // log(i + " looking for " + face_vertexes[i][fvi])
      faces[i].push(vertexes.indexOf(face_vertexes[i][fvi]))
      // log("found " + vertexes.indexOf(face_vertexes[i][fvi]))
    }
  
    // for material
    faces[i].push(0);
  }
  
  // for (var i=0; i<normals.length; i++) {
    // log('passing normal: ' + normals[i][0] + ", " + normals[i][1] + ", " + normals[i][2]);
  // }
  
  // for (var i=0; i<vertexes.length; i++) {
    // log('passing vertex: ' + vertexes[i][0] + ", " + vertexes[i][1] + ", " + vertexes[i][2]);
  // }
  
  // for (var i=0; i<faces.length; i++) {
    // log('passing face: ' + faces[i][0] + ", " + faces[i][1] + ", " + faces[i][2]);
  // }
  // 
  // log("end");
  // document.getElementById('debug').innerHTML = stl_data;
  
  log("finished parsing stl")
  return [vertexes, normals, faces];
}

function load_stl_mesh(stl_data) {
  var stl_parts = parse_stl(stl_data);  
  
  var vertexes = stl_parts[0];
  var normals = stl_parts[1];
  var faces = stl_parts[2];
  
  // build and load mesh into scene
  scene.removeObject(mesh);

  log("creating geometry")
  geometry = new mySTLMesh(vertexes, faces);

  log("coloring faces")
  for (var i = 0; i < geometry.faces.length; i++) {
    geometry.faces[i].color.setRGBA(Math.random() * 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1);
    //geometry.faces[i].color.setRGBA(3, 9, 3, 1);
    // log("coloring face " + i)
  }
  mesh = new THREE.Mesh(geometry, new THREE.MeshFaceColorFillMaterial());

  //mesh = new THREE.Mesh(geometry, new THREE.MeshColorFillMaterial( 0xc0c0c0 ));
  // mesh.overdraw = true;
  // mesh.doubleSided = true;
  // mesh.flipSided = true;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 50;

  log("adding mesh to scene")
  scene.addObject(mesh);

  timer = setInterval(sceneLoop, 1000/60);
  renderer.render(scene, camera);
}

