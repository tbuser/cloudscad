/*
	Test Cube Script for CloudSCAD

	Tony Buser <tbuser@gmail.com>
*/

// Size of cube on X axis
width = 10;

// Size of cube on Y axis
length = 10;

// How tall the cube is on Z axis
height = 10;

// Diameter of the hole in the center
hole_diameter = 4; // 3, 4, 8

// Which way should the hole go?
hole_orientation = "vertical"; // vertical, horizontal

module test_cube() {
	difference() {
		cube([width, length, height], center = true);

		if (hole_orientation == "horizontal") {
			rotate([0,90,0]) {
				cylinder(width+2, hole_diameter/2, hole_diameter/2, center = true);
			}
		} else {
			cylinder(height+2, hole_diameter/2, hole_diameter/2, center = true);
		}
	}
}

translate([0, 0, height/2]) {
	test_cube();
}
