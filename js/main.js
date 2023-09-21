import * as THREE from 'three'
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'

const progressBarContainer = document.querySelector('.progress-container');
progressBarContainer.style.opacity = 1;

const progressValue = document.querySelector('.progress-value');
const progressBar = document.querySelector('.progress-bar');
getComputedStyle(progressBar);

const manager = new THREE.LoadingManager();

/*manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};*/

manager.onLoad = function ( ) {
	fadeBar();	
};

function fadeBar () {
	if (progressBarContainer.style.opacity > 0){
	requestAnimationFrame(fadeBar);
	progressBarContainer.style.opacity -= 0.01;
	}
}

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	progressBar.style= `background: radial-gradient(closest-side, rgb(0, 0, 0) 79%, rgba(0, 0, 0, 0) 0%),
	linear-gradient(90deg, rgba(90, 186, 199, 0.192) 0%, rgba(191, 69, 202, 0.459) 51%,rgba(90, 186, 199, 0.192) 99.9%, rgb(0, 225, 255) 100%),
	conic-gradient(hotpink ${(itemsLoaded/itemsTotal)*360}deg, #ffffff7e 0deg)`;
	progressValue.textContent = `${Math.trunc((itemsLoaded/itemsTotal)*100)}%`;
};

let camera, scene, renderer, rendererCSS, objectCSS, sceneCSS, furnitureArray, currentDiv;

let none = document.getElementById('none');

let furniture = document.getElementById('furniture');
furnitureArray = ["assets/images/01-furniture/0001.png", "assets/images/01-furniture/0002.png", "assets/images/01-furniture/0003.png", "assets/images/01-furniture/0004.png",
"assets/images/01-furniture/0005.png", "assets/images/01-furniture/0006.png", "assets/images/01-furniture/0007.png", "assets/images/01-furniture/0008.png",
"assets/images/01-furniture/0009.png", "assets/images/01-furniture/0010.png"]

let connie01 = document.getElementById('connie01'), connie02 =  document.getElementById('connie02'), televideo = document.getElementById('televideo');
let visualsArray = [connie01, connie02, televideo];

let vg = document.getElementById('virtual-gallerys');
let vgArray = ["assets/images/02-vg/01.png", "assets/images/02-vg/02.png", "assets/images/02-vg/03.png", "assets/images/02-vg/04.png", "assets/images/02-vg/05.png",
"assets/images/02-vg/06.png", "assets/images/02-vg/07.png"];

let teleparto = document.getElementById('teleparto');
let telepartoArray = ["assets/images/03-teleparto/00.jpg","assets/images/03-teleparto/01.jpg","assets/images/03-teleparto/02.jpg","assets/images/03-teleparto/03.jpg",
"assets/images/03-teleparto/04.jpg","assets/images/03-teleparto/05.jpg"]

let reel = document.getElementById('reel');

let back = document.getElementById('back');

let aboutMe = document.getElementById('about-me');

var divs = [none, furniture, reel, back, connie01, connie02, televideo, vg, teleparto, aboutMe];

/* preload images*/

let images = [...furnitureArray, ...vgArray, ...telepartoArray]


function preload_images() {
	for (var i = 0; i < images.length; i++) {
	var image = new Image();
	image.src = images[i];
	//console.log(image);
	}
  }


preload_images();

/* init */

init();
render();

function init() {

	//const container = document.createElement( 'div' );
	//document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 0.25, 20 );
	camera.position.set( 3, 0, 0 );
	//camera.position.set( 2, 1.15, 0 );
	camera.rotation.set(0,1.57,0)
	scene = new THREE.Scene();

	new RGBELoader(manager)
		.setPath( 'assets/hdr/' )
		.load( 'belfast_sunset_puresky_4k.hdr', function ( texture ) {

			texture.mapping = THREE.EquirectangularReflectionMapping;

			scene.background = texture;
			scene.environment = texture;

			render();

			// model

			const loader = new GLTFLoader(manager).setPath( 'assets/glb/' );
			loader.load( 'portfolio-base.glb', function ( base ) {
				base.scene.traverse((child, i) => {
					if (child.isMesh) {
					  child.name = 'base_mesh';
					}
				  });
				
				scene.add( base.scene );
			render();

			} );
			

		} );


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.body.appendChild( renderer.domElement );

	sceneCSS = new THREE.Scene();
	rendererCSS = new CSS3DRenderer();
	rendererCSS.setSize( window.innerWidth, window.innerHeight );

	const monitor = document.getElementById('monitor');

	let el = document.createElement('div');
	el.innerHTML = "<h1>Hello CSS3D</h1>"

	objectCSS = new CSS3DObject(monitor);


	objectCSS.position.set(-0.4,1.2,0);
	objectCSS.scale.set(0.00058,0.00058,0.00058);
	objectCSS.rotation.set(0,1.55,0);

	document.getElementById('container').appendChild( rendererCSS.domElement );


	sceneCSS.add(objectCSS);

	//const controls = new OrbitControls( camera, rendererCSS.domElement );
	//controls.addEventListener( 'change', render ); // use if there is no animation loop
	//controls.minDistance = 2;
	//controls.maxDistance = 10;
	//controls.target.set( 0, 0.5, - 0.2 );
	//controls.update();
	//controls.enableDamping = true;


	window.addEventListener( 'resize', onWindowResize );

	cargarEstrellas();

}

/* botones */

function cargarEstrellas() {

	const estrellaMAT = new THREE.MeshStandardMaterial({
		color: 0x000000,
		emissive: 0x000000,
	});
	
	const estrella = new THREE.Object3D();
	estrella.name = 'estrella';
	
	const loader = new GLTFLoader(manager).setPath( 'assets/glb/' );
	loader.load( 'portfolio-botones.glb', function ( boton ) {
	
	
		let model = boton.scene;
	
		model.traverse((child, i) => {
			if (child.isMesh) {
			  child.material = estrellaMAT.clone();
			  child.material.side = THREE.DoubleSide;
			  child.name = 'estrella_boton';
			}
		  });
		
		estrella.add(model);			
	
		render();
	
	} );

	scene.add(estrella);
}

/*pantalla*/

const screenName = new THREE.TextureLoader().load( 'assets/screen/screen-name.jpg' );
screenName.colorSpace = THREE.SRGBColorSpace;

const screenFurniture = new THREE.TextureLoader().load( 'assets/screen/screen-furniture.jpg' );
screenFurniture.colorSpace = THREE.SRGBColorSpace;

const screenReel = new THREE.TextureLoader().load( 'assets/screen/screen-reel.jpg' );
screenReel.colorSpace = THREE.SRGBColorSpace;

const screenVG = new THREE.TextureLoader().load( 'assets/screen/screen-vg.jpg' );
screenVG.colorSpace = THREE.SRGBColorSpace;

const screenVisuals = new THREE.TextureLoader().load( 'assets/screen/screen-visuals.jpg' );
screenVisuals.colorSpace = THREE.SRGBColorSpace;

const screenAM = new THREE.TextureLoader().load( 'assets/screen/screen-am.jpg' );
screenAM.colorSpace = THREE.SRGBColorSpace;

const screenTeleparto = new THREE.TextureLoader().load( 'assets/screen/screen-teleparto.jpg' );
screenTeleparto.colorSpace = THREE.SRGBColorSpace;

const pantallaMAT = new THREE.MeshStandardMaterial({
	color: 0x000000,
	emissive: 0xffffff,
	emissiveMap: screenName,
});

const pantalla = new THREE.Object3D();
pantalla.name = 'pantalla';


const loader = new GLTFLoader(manager).setPath( 'assets/glb/' );
loader.load( 'portfolio-pantalla.glb', function ( scr ) {


	let model = scr.scene;

	model.traverse((child, i) => {
		if (child.isMesh) {
		  child.material = pantallaMAT;
		  //child.material.side = THREE.DoubleSide;
		  child.name = 'pantalla_mesh';
		}
	  });
	
	pantalla.add(model);
	

	render();

} );

scene.add(pantalla);

/* renderer*/

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	rendererCSS.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

//

function render() {
	rendererCSS.render( sceneCSS, camera );
	renderer.render( scene, camera );	
}

/*interaction*/

const pointer = new THREE.Vector2();
const clicker = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let currentIntersection;
const onMouseMove = (event) => {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);

	for (let i = 0; i < intersects.length; i++) {
		if (intersects.length > 0 && intersects[0].object.name == 'estrella_boton'){
		currentIntersection = intersects[0].object;	
		currentIntersection.material.emissive.set(0xff0000);
		//console.log(currentIntersection.name);
		document.body.style.cursor = 'pointer'; 
		switch (intersects[i].object.userData.name) {
			case 'm_cajonera_cajonMid_boton.004':
				pantallaMAT.emissiveMap = screenReel;
			break;

			case 'm_cajonera_cajonMid_boton.01':
				pantallaMAT.emissiveMap = screenFurniture;
			break;

			case 'm_cajonera_cajonMid_boton.002':
				pantallaMAT.emissiveMap = screenVisuals;
			break;

			case 'm_cajonera_cajon_boton.010':
				pantallaMAT.emissiveMap = screenVG;
			break;

			case 'm_cajonera_cajon_boton.011':
				pantallaMAT.emissiveMap = screenTeleparto;
			break;

			case 'm_cajonera_cajonMid_boton.003':
				pantallaMAT.emissiveMap = screenAM;
			break;

			case 'm_botonMid.01':
				back.style.display = 'block';
			break;
		}		
		render();
		} else if (currentIntersection !== null && currentIntersection != undefined) {
			currentIntersection.material.emissive.set( 0x000000 );
			currentIntersection = null;
			document.body.style.cursor = 'default';
			pantallaMAT.emissiveMap = screenName;
			back.style.display = 'none';
			render();
		  } else {
		  }
	} 	
}

const onMouseClick = (event) => {
	clicker.x = (event.clientX / window.innerWidth) * 2 - 1;
	clicker.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	raycaster.setFromCamera(clicker, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);
		
	
	for (let i = 0; i < intersects.length; i++) {
		if (intersects.length > 0 && intersects[i].object.name == 'estrella_boton'){
		//console.log(intersects[i].object.userData.name);		
		switch (intersects[i].object.userData.name) {
			case 'm_botonR.002':
				switchRight();
				break;

			case 'm_botonL.01' :
				switchLeft();
				break;

			case 'm_cajonera_cajonMid_boton.004':				
				//camera.position.set(2, 1.15, 0 );
				if (!movingUP) {
					movingUP = true;
					currentDiv = reel;
					updateDiv(reel);
					cameratoScreen();
				}

			break;

			case 'm_cajonera_cajonMid_boton.01':				
				if (!movingUP) {
					movingUP = true;
					currentDiv = furniture;
					updateDiv(furniture);
					cameratoScreen();
				}
				//camera.position.set(2, 1.15, 0 );
			break;

			case 'm_cajonera_cajon_boton.010':				
				if (!movingUP) {
					movingUP = true;
					currentDiv = vg;
					updateDiv(vg);
					cameratoScreen();
				}
			break;

			case 'm_cajonera_cajonMid_boton.002':
				if (!movingUP) {
					movingUP = true;
					currentDiv = visualsArray;
					updateDiv(connie01);
					cameratoScreen();
				}
			break;

			case 'm_cajonera_cajon_boton.011':
				if (!movingUP) {
					movingUP = true;
					currentDiv = teleparto;
					updateDiv(teleparto);
					cameratoScreen();
				}
			break;

			case 'm_cajonera_cajonMid_boton.003':
				if (!movingUP) {
					movingUP = true;
					currentDiv = aboutMe;
					updateDiv(aboutMe);
					cameratoScreen();
				}
			break;


			case 'm_botonMid.01':
				updateDiv(none);
				//camera.position.set( 3, 0, 0 );
				if (movingUP){
					movingUP = false;
					pantallaMAT.emissiveMap = screenName;
					cameratoDrawers();
				}
			break;
		}		
	} else{}
}
}

function updateDiv(toDiv){
	for (let i =0; i< divs.length; i++) {
		if (divs[i] == toDiv) {
			divs[i].style.display = 'block';
			//console.log(divs[i]);
		} else { 
			//console.log(divs[i]);
			divs[i].style.display = 'none';
		}
	}
}

var furnitureNum = 0, visualsNum = 0, vgNum = 0, telepartoNum = 0;

function switchRight(){	

	switch (currentDiv) {	

	case furniture: 
		if (furnitureNum >= 0 && furnitureNum <= 8) {
			furnitureNum = furnitureNum + 1;
			furniture.src=furnitureArray[furnitureNum];	
			//console.log(furnitureNum);
		} else {
			furnitureNum = 0;
			furniture.src=furnitureArray[furnitureNum];		
			//console.log(furnitureNum);	
		}
	break;

	case visualsArray:
		if (visualsNum >= 0 && visualsNum <= 1) {		
			visualsNum = visualsNum +1;
			updateDiv(visualsArray[visualsNum]);	
			//console.log(visualsNum);
		} else {		
			visualsNum = 0;
			updateDiv(visualsArray[visualsNum]);
			//console.log(visualsNum);
	}

	case vg: 
		if (vgNum >= 0 && vgNum <= 5) {
			vgNum = vgNum + 1;
			vg.src=vgArray[vgNum];	
			//console.log(vgNum);
		} else {
			vgNum = 0;
			vg.src=vgArray[vgNum];		
			//console.log(vgNum);	
		}
	break;

	case teleparto: 
		if (telepartoNum >= 0 && telepartoNum <= 4) {
			telepartoNum = telepartoNum + 1;
			teleparto.src=telepartoArray[telepartoNum];	
			//console.log(telepartoNum);
		} else {
			telepartoNum = 0;
			teleparto.src=telepartoArray[telepartoNum];		
			//console.log(telepartoNum);	
		}
	break;

}
}

function switchLeft(){

	switch (currentDiv) {	

	case furniture: 
		if (furnitureNum >= 1 && furnitureNum <=9) {		
			furnitureNum = furnitureNum -1;
			furniture.src=furnitureArray[furnitureNum];	
			//console.log(furnitureNum);
		} else {		
			furnitureNum = 9;
		furniture.src=furnitureArray[furnitureNum];
			//console.log(furnitureNum);
	}
	break;

	case visualsArray:
		if (visualsNum >= 1 && visualsNum <= 2) {		
			visualsNum = visualsNum -1;
			updateDiv(visualsArray[visualsNum]);	
			//console.log(visualsNum);
		} else {		
			visualsNum = 2;
			updateDiv(visualsArray[visualsNum]);
			//console.log(visualsNum);
	}

	break;

	case vg: 
		if (vgNum >= 1 && vgNum <= 6) {		
			vgNum = vgNum -1;
			vg.src=vgArray[vgNum];	
			//console.log(vgNum);
		} else {		
			vgNum = 6;
			vg.src=vgArray[vgNum];
			//console.log(vgNum);
	}
	break;

	case teleparto: 
		if (telepartoNum >= 1 && telepartoNum <= 4) {		
			telepartoNum = telepartoNum -1;
			teleparto.src=telepartoArray[telepartoNum];	
			//console.log(telepartoNum);
		} else {		
			telepartoNum = 4;
			teleparto.src=telepartoArray[telepartoNum];
			//console.log(telepartoNum);
	}
	break;

}
}

var movingUP = false, isMoving;

function cameratoScreen() {
	if (camera.position.y < 1.15 && movingUP){
	requestAnimationFrame(cameratoScreen);
	camera.position.y += 0.008;
	camera.position.x -= 0.006;
	render();
	} else {}
}

function cameratoDrawers() {
	if (camera.position.y > 0 && !movingUP){
		requestAnimationFrame(cameratoDrawers);
		camera.position.y -= 0.008;
		camera.position.x += 0.006;
		render();
		} else {}
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseClick);
updateDiv(none);
