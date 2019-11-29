const FRONT_FEET_X = -5;
const BACK_FEET_X = 25;
const LEFT_FEET_Z = 0;
const RIGHT_FEET_Z = 15;
const TABLE_FEET_Y = 0;

const TABLE_FEET_COLOR = "#663300";
const LIGHT_COLOR = "#f5f57a";
const TABLE_COLOR = "#298031";

const TABLE_WIDTH = 25;
const TABLE_LENGTH = 45;

const BORDER_HEIGHT = 3;

const LIGHT_Y_POSITION = 30;

//* Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor('rgb(255,255,255)');

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 0.1, 1000);
// camera.position.set(-10, 20, 50);
camera.position.set(-50, 25, 20); // camera position

const ambientLight = new THREE.AmbientLight(0x909090);
// const directionalLight = new THREE.DirectionalLight(0x444444);

const spotLight = new THREE.SpotLight(LIGHT_COLOR);
renderer.shadowMap.enabled = true;
spotLight.castShadow = true;

// directionalLight.position.set(0, 10, 0);
spotLight.position.set(0, LIGHT_Y_POSITION, 0);
// scene.add(spotLight);
scene.add(ambientLight);
// scene.add(directionalLight);

let axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const biliardTable = new THREE.Object3D();
biliardTable.position.set(-10, 0, -6);

// biliardTable.rotation.y = 0.5;

class Box { //   this class is used for creating the feet and the borders of the table AWA the table plane. 
    constructor(width, height, depth, color, xPosition, yPosition, zPosition) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshPhongMaterial({ color: color })
        );
        this.mesh.position.x = xPosition;
        this.mesh.position.y = yPosition;
        this.mesh.position.z = zPosition;

        return this.mesh;
    }
}
//  on the helper axis 
//  z - the blue arrow 
//  x - the red arrow 
//  y - the green arrow 


class Sphere { //    this class will be used for the creation of the biliard balls  
    constructor(radius, widthSegment, heightSegment, color, xPosition, yPosition, zPosition) {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, widthSegment, heightSegment),
            new THREE.MeshPhongMaterial({ color: color })
        );

        this.mesh.position.x = xPosition;
        this.mesh.position.y = yPosition;
        this.mesh.position.z = zPosition;

        return this.mesh;
    }
}

const lightBulb = new Sphere(1, 32, 32, LIGHT_COLOR, 0, LIGHT_Y_POSITION, 0);

//  creating the feet of the table
const leftFrontFoot = new Box(2.5, 15, 3, TABLE_FEET_COLOR, FRONT_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightFrontFoot = new Box(2.5, 15, 3, TABLE_FEET_COLOR, FRONT_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);
const leftBackFoot = new Box(2.5, 15, 3, TABLE_FEET_COLOR, BACK_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightBackFoot = new Box(2.5, 15, 3, TABLE_FEET_COLOR, BACK_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);

//  creating the table top
const tableTop = new Box(TABLE_LENGTH, 1, TABLE_WIDTH, TABLE_COLOR, 9, 8, 7.5);

const GENERIC_BORDER_WIDTH = 1;
const GENERIC_BORDER_DEPTH = 1;

//  creating the borders of the table
const backBorder = new Box(GENERIC_BORDER_WIDTH, BORDER_HEIGHT, TABLE_WIDTH, TABLE_COLOR, 31, 9, 7.5);
const frontBorder = new Box(GENERIC_BORDER_WIDTH, BORDER_HEIGHT, TABLE_WIDTH, TABLE_COLOR, -13, 9, 7.5);
const leftBorder = new Box(TABLE_LENGTH, BORDER_HEIGHT, GENERIC_BORDER_DEPTH, TABLE_COLOR, 9, 9, -4.5);
const rightBorder = new Box(TABLE_LENGTH, BORDER_HEIGHT, GENERIC_BORDER_DEPTH, TABLE_COLOR, 9, 9, 19.5);

//  adding biliard table objects to biliardTable object
[backBorder, frontBorder, leftBorder, rightBorder, leftBackFoot, leftFrontFoot, rightBackFoot, rightFrontFoot, tableTop].forEach(object => biliardTable.add(object));

//  adding objects to the scene
[biliardTable, lightBulb, spotLight].forEach(object => scene.add(object));

//* Render loop
const controls = new THREE.TrackballControls(camera, canvas);

function render() {
    requestAnimationFrame(render);

    controls.update();
    renderer.render(scene, camera);
}

render();
