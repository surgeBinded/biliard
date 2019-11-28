// Create a house

//* Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor('rgb(255,255,255)');
// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(-10, 20, 50);

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set(1.5, 1, 1);
scene.add(light);

let axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const biliardTable = new THREE.Object3D();
biliardTable.position.x = -10;
// biliardTable.rotation.y = 1;

class Box { //   this class is used for creating the feet and the borders of the table AWA the table plane. 
    constructor(width, height, depth, color, xPosition, yPosition, zPosition) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshBasicMaterial({ color: color })
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
    constructor(radius, widthSegment, heightSegment, color) {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, widthSegment, heightSegment),
            new THREE.MeshBasicMaterial({ color: color })
        );
        return this.mesh;
    }
}

const ball = new Sphere(5, 32, 32, "red");
ball.position.x = 1;


const FRONT_FEET_X = -5;
const BACK_FEET_X = 25;
const LEFT_FEET_Z = 0;
const RIGHT_FEET_Z = 15;
const TABLE_FEET_Y = 0;

const leftFrontFoot = new Box(2.5, 15, 3, "brown", FRONT_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightFrontFoot = new Box(2.5, 15, 3, "brown", FRONT_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);
const leftBackFoot = new Box(2.5, 15, 3, "brown", BACK_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightBackFoot = new Box(2.5, 15, 3, "brown", BACK_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);
const tableTop = new Box(45, 1, 20, "green", 9, 8, 7.5);

[leftBackFoot, leftFrontFoot, rightBackFoot, rightFrontFoot, tableTop].forEach(object => biliardTable.add(object));

scene.add(biliardTable);

//* Render loop
const controls = new THREE.TrackballControls(camera, canvas);

function render() {
    requestAnimationFrame(render);

    controls.update();
    renderer.render(scene, camera);
}

render();
