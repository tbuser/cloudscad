/**
 * @author Tony Buser / http://tonybuser.com
 */

var STLGeometry = function(stl_string) {
	THREE.Geometry.call(this);

	var scope = this;

  var stl_info  = parse_stl(stl_string);
  var vertexes  = stl_info[0];
  var normals   = stl_info[1];
  var faces     = stl_info[2];

  for (var i=0; i<vertexes.length; i++) {
    v(vertexes[i][0], vertexes[i][1], vertexes[i][2]);
    // console.log("vertex = " + vertexes[i][0] + ", " + vertexes[i][1] + ", " + vertexes[i][2]);
  }

  for (var i=0; i<faces.length; i++) {
    f3(faces[i][0], faces[i][1], faces[i][2]);
    // console.log("face = " + faces[i][0] + ", " + faces[i][1] + ", " + faces[i][2]);
  }

  function v(x, y, z) {
    scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
  }

  function f3(a, b, c) {
    scope.faces.push( new THREE.Face3( a, b, c ) );
  }

  // console.log("Starting to compute normals")

  // this.computeNormals();
	
  // console.log("Finished STLGeometry")
}

STLGeometry.prototype = new THREE.Geometry();
STLGeometry.prototype.constructor = STLGeometry;

// indexOf only finds strings? seriously Javascript, seriously?!
Array.prototype.myIndexOf = function(searchstring, indexstart) {
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

  // console.log(stl_data);

  // strip out extraneous stuff
  stl_data = stl_data.replace(/\n/g, " ");
  stl_data = stl_data.replace(/solid\s(\w+)?/, "");
  stl_data = stl_data.replace(/facet normal /g,"");
  stl_data = stl_data.replace(/outer loop/g,"");  
  stl_data = stl_data.replace(/vertex /g,"");
  stl_data = stl_data.replace(/endloop/g,"");
  stl_data = stl_data.replace(/endfacet/g,"");
  stl_data = stl_data.replace(/endsolid\s(\w+)?/, "");
  stl_data = stl_data.replace(/\s+/g, " ");
  stl_data = stl_data.replace(/^\s+/, "");

  // console.log(stl_data);

  var facet_count = 0;
  var block_start = 0;

  var points = stl_data.split(" ");

  for (var i=0; i<points.length/12-1; i++) {
    normal = [parseFloat(points[block_start]), parseFloat(points[block_start+1]), parseFloat(points[block_start+2])]
    normals.push(normal)
    // console.log(normal)
    
    for (var x=0; x<3; x++) {
      vertex = [parseFloat(points[block_start+x*3+3]), parseFloat(points[block_start+x*3+4]), parseFloat(points[block_start+x*3+5])];

      if (vertexes.myIndexOf(vertex) == -1) {
        vertexes.push(vertex);
        // console.log(vertex);
      }

      if (face_vertexes[i] == undefined) {
        face_vertexes[i] = [];
      }
      face_vertexes[i].push(vertex);
    }
    
    block_start = block_start + 12;
  }

  // console.log("calculating faces")
  for (var i=0; i<face_vertexes.length; i++) {
    // console.log("face vertex " + i + " = " + face_vertexes[i]);
    
    if (faces[i] == undefined) {
      faces[i] = [];
    }
  
    for (var fvi=0; fvi<face_vertexes[i].length; fvi++) {
      // console.log(i + " looking for " + face_vertexes[i][fvi])
      faces[i].push(vertexes.myIndexOf(face_vertexes[i][fvi]))
      // console.log("found " + vertexes.indexOf(face_vertexes[i][fvi]))
    }
  
    // for material
    faces[i].push(0);
  }
  
  // for (var i=0; i<normals.length; i++) {
  //   console.log('passing normal: ' + normals[i][0] + ", " + normals[i][1] + ", " + normals[i][2]);
  // }
  // 
  // for (var i=0; i<vertexes.length; i++) {
  //   console.log('passing vertex: ' + vertexes[i][0] + ", " + vertexes[i][1] + ", " + vertexes[i][2]);
  // }
  // 
  // for (var i=0; i<faces.length; i++) {
  //   console.log('passing face: ' + faces[i][0] + ", " + faces[i][1] + ", " + faces[i][2]);
  // }
  // 
  // console.log("end");
  // document.getElementById('debug').innerHTML = stl_data;
  
  // console.log("finished parsing stl")
  return [vertexes, normals, faces];
}
