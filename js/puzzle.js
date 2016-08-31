var Puzzle = {
	halfGridSize : 500,
	gridUnit : 50,
	elements : {},
	init : function init(scene){
		this.scene = scene;

		var base = this.baseInit();
		this.elements.base = base;
		// var grid = this.gridInit();
		// this.elements.grid = grid;
		return this.elements;
	},	

	baseInit : function baseInit(){
		var loader = new THREE.TextureLoader();
		var geometry = new THREE.CubeGeometry( 1000, 1000, 200 );
		var material = new Physijs.createMaterial(
						new THREE.MeshLambertMaterial({color: 0x0cadd8 }),
						0.8,
						0.1
					);
		var cube = new Physijs.BoxMesh( geometry, material, 10);
		cube.position.set(0,0,-100);
		return cube;
	},

	gridInit : function gridInit(){
		var geometry = new THREE.Geometry();
		geometry.colorsNeedUpdate = true;

		for ( var i = - this.halfGridSize; i <= this.halfGridSize; i += this.gridUnit ) {
			geometry.vertices.push( new THREE.Vector3( - this.halfGridSize, i, 0 ) );
			geometry.vertices.push( new THREE.Vector3(   this.halfGridSize, i, 0 ) );

			geometry.vertices.push( new THREE.Vector3( i, - this.halfGridSize, 0 ) );
			geometry.vertices.push( new THREE.Vector3( i, this.halfGridSize, 0 ) );
		}
		var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 1, transparent: false } );

		var line = new THREE.LineSegments( geometry, material );
		return line;
	}
}



var Puzzle1 = {
	materialId : 1,
	boxes : [],
	mesh : {},
	init : function init(scene){
		this.scene = scene;

		var baseElements = Puzzle.init(scene);

		var box = this.createBox(0,-475,100,1000,50,200);
		this.boxes.push(box);

		box = this.createBox(-475,0,100,50,1000,200);
		this.boxes.push(box);

		box = this.createBox(475,0,100,50,1000,200);
		this.boxes.push(box);

		box = this.createBox(0,475,100,1000,50,200);
		this.boxes.push(box);		

		this.mesh = this.createMesh(baseElements);

		this.addToScene(this.mesh);
		// this.boxes.forEach(this.addToScene);
		return this.mesh;
	},
	getMaterial : function getMaterial(){
		switch(this.materialId) {
			case 1 : 
				return new Physijs.createMaterial(
					new THREE.MeshLambertMaterial({color:  0x08de8a }),
					0.8,
					0.1
				);
			default :
				return new THREE.MeshLambertMaterial({color: 0xFFFFFF});		
		}	
	},
	createBox : function createBox(x,y,z,l,b,h){
		var geometry = new THREE.CubeGeometry( l, b, h );
		var material = this.getMaterial();
		var cube = new Physijs.BoxMesh( geometry, material );
		cube.position.set(x,y,z);
		return cube;
	},
	
	addToScene : function addToScene(element){
		scene.add( element );		
	},

	createMesh : function createMesh(baseElements){
		// var singleGeometry = new THREE.Geometry();
				
		// for(var key in baseElements){
		// 	if(baseElements.hasOwnProperty(key) && key == "base") {
		// 		baseElements[key].updateMatrix();
		// 		singleGeometry.merge(baseElements[key].geometry, baseElements[key].matrix);
		// 	}
		// }

		this.boxes.forEach(function(element, index, array){
			element.updateMatrix();
			baseElements["base"].add(element);
			// singleGeometry.merge(element.geometry, element.matrix);
		});

		// var materialA = new THREE.MeshLambertMaterial({color: 0x00ffaa });
		// var materialB = new THREE.MeshLambertMaterial({color: 0xff0000 });

		// singleGeometry.materials = [materialA, materialB];

		// for(var i = 0; i < singleGeometry.faces.length; i++){
		// 	// singleGeometry.faces[i].materialIndex = 0;
		// 	singleGeometry.faces[i].color.setHex(Math.random() * 0xFFFFFF);
		// }
		// singleGeometry.faces[0].materialIndex = 1; 

		// var material = this.getMaterial();
		// var mesh = new Physijs.ConvexMesh(singleGeometry,new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors }), 20);
		return baseElements["base"];
	},

	tilt : function tilt(pos){
		if(pos.x < 500 && pos.x > -500 && pos.y < 500 && pos.y > -500){
			this.mesh.lookAt(new THREE.Vector3(pos.x, pos.y, 1500));

			// var slope = pos.y/pos.x;

			// var newRotx = - (Math.PI/360) * (50/500) * pos.x; 	
			// var newRoty = - (Math.PI/360) * (50/500) * pos.y;
			
			// this.mesh.rotateX(newRotx - this.mesh.rotation.x);
			// this.mesh.rotateY(newRoty - this.mesh.rotation.y);	
		}
	}

}