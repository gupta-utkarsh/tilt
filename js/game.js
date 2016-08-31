'use strict';
Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var scene, renderer, tempVector, camera, puzzleMesh, light, keyboard, canvas, ball, ball_geometry, ball_material;


scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3(0,0, -100));

scene.addEventListener(
	'update',
	function(){
		
		scene.simulate(undefined,1);		
	}
);


tempVector = new THREE.Vector3();

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 0, 0, 1500 );
camera.lookAt( new THREE.Vector3() );

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

puzzleMesh = Puzzle1.init(scene);

// light = new THREE.AmbientLight( 0xffffff ); // soft white light
// scene.add( light );

light = new THREE.DirectionalLight( 0xffffff, 0.5 );
light.position.set( 0, 0 ,50 );
scene.add(light);

light = new THREE.PointLight( 0xffffff, 1, 450 );
light.position.set( 450, 450, 0 );
scene.add( light );

light = new THREE.PointLight( 0xffffff, 1, 450 );
light.position.set( -450, -450, 0 );
scene.add( light );

light = new THREE.PointLight( 0xffffff, 1, 450 );
light.position.set( 450, -450, 0 );
scene.add( light );

light = new THREE.PointLight( 0xffffff, 1, 450 );
light.position.set( -450, 450, 0 );
scene.add( light );

light = new THREE.PointLight( 0xffffff, 1, 450 );
light.position.set( 0, 0, 0 );
scene.add( light );
// var spotLight = new THREE.SpotLight( 0x000055 );
// spotLight.position.set( 0, 0, 1000 );

// spotLight.castShadow = true;

// spotLight.shadow.mapSize.width = 1000;
// spotLight.shadow.mapSize.height = 1000;

// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 4000;
// spotLight.shadow.camera.fov = 30;

// scene.add( spotLight );

ball_geometry = new THREE.SphereGeometry( 15, 32, 32 );
ball_material = new Physijs.createMaterial(
					new THREE.MeshLambertMaterial( {color: 0xff0000} ),
					0.8,
					0.9
				);
ball = new Physijs.SphereMesh( ball_geometry, ball_material, 0.1 );

ball.position.set(200, 200, 300);
ball.castShadow = true;
ball.receiveShadow = true;
scene.add( ball );

var constraint = new Physijs.PointConstraint(
    puzzleMesh, // First object to be constrained
    new THREE.Vector3(0,0,-100) // point in the scene to apply the constraint
);
scene.addConstraint( constraint );

// var constraint = new Physijs.DOFConstraint(
//     sphere, // First object to be constrained
//     puzzleMesh, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
//     new THREE.Vector3(500,500,0)
// );

// scene.addConstraint( constraint );
// constraint.setLinearLowerLimit( new THREE.Vector3( -500, -500, 0 ) );
// constraint.setLinearUpperLimit( new THREE.Vector3( 500, 500, 200 ) );

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

canvas = document.getElementsByTagName("canvas")[0];

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    tempVector.set(( mousePos.x / window.innerWidth ) * 2 - 1, - ( mousePos.y / window.innerHeight ) * 2 + 1, 0.5 );
    tempVector.unproject( camera );
	var dir = tempVector.sub( camera.position ).normalize();
	var distance = - camera.position.z / dir.z;
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
	Puzzle1.tilt(pos);
	scene.simulate(undefined,1);
 }, false);

function render() {
	puzzleMesh.__dirtyRotation = true;
	puzzleMesh.updateMatrix();
	scene.simulate();
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}
render();