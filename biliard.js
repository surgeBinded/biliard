const TABLE_WIDTH = 25;
const TABLE_LENGTH = 45;

const FRONT_FEET_X = -TABLE_LENGTH + 35;
const BACK_FEET_X = TABLE_LENGTH - 16;
const LEFT_FEET_Z = 0;
const RIGHT_FEET_Z = TABLE_WIDTH - 9;
const TABLE_FEET_Y = 0;
const TABLE_FEET_WIDTH = 2.5;
const TABLE_FEET_HEIGHT = 15;
const TABLE_FEET_DEPTH = 3;

const GENERIC_BORDER_WIDTH = 1;
const GENERIC_BORDER_DEPTH = 1;
const TABLE_BORDERS_Y = 9;
const BORDER_HEIGHT = 3;

const TABLE_FEET_COLOR = "#663300";
const LIGHT_COLOR = "#ffffef";
const TABLE_COLOR = "#298031";

const LIGHT_X_POSITION = 0;
const LIGHT_Y_POSITION = 30;
const LIGHT_Z_POSITION = 0;

const LIGHTBULB_RADIUS = 1;
const LIGHTBULB_SEGMENT_WIDTH_HEIGHT = 32;

const textures = [
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball8.jpg'), side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball9.jpg'), side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball10.jpg'), side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball11.jpg'), side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball12.jpg'), side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball13.jpg'), side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball14.jpg'), side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/Ball15.jpg'), side: THREE.DoubleSide }),
];

//* Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor('rgb(255,255,255)');
renderer.shadowMap.enabled = true;

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 0.1, 1000);
// camera.position.set(-10, 20, 50);
camera.position.set(-50, 25, 20); // camera position
// camera.position.set(-5, 50, 2); // camera view from above

const ambientLight = new THREE.AmbientLight(0x909090);
const spotLight = new THREE.SpotLight(LIGHT_COLOR);

spotLight.castShadow = true;
spotLight.position.set(LIGHT_X_POSITION, LIGHT_Y_POSITION, LIGHT_Z_POSITION);

scene.add(spotLight);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const biliardTable = new THREE.Object3D();
biliardTable.position.set(-10, 0, -6);

// biliardTable.rotation.y = 0.5;

class Box { //   this class is used for creating the feet and the borders of the table AWA the table plane. 
    constructor(width, height, depth, color, xPosition, yPosition, zPosition) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({ color: color })
        );

        this.meshBoxHelper = new THREE.BoxHelper(this.mesh, "red");
        this.meshBBox = new THREE.Box3();
        this.meshBBox.setFromObject(this.meshBoxHelper);

        this.mesh.position.x = xPosition;
        this.mesh.position.y = yPosition;
        this.mesh.position.z = zPosition;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}
//  on the helper axis 
//  z - blue arrow 
//  x - red arrow 
//  y - green arrow 

class Sphere { //    this class will be used for the creation of the biliard balls  
    constructor(radius, widthSegment, heightSegment, color, texture, xPosition, yPosition, zPosition) {

        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, widthSegment, heightSegment),
            texture
        );

        this.meshBoxHelper = new THREE.BoxHelper(this.mesh, "red");
        this.meshBBox = new THREE.Box3();
        this.meshBBox.setFromObject(this.meshBoxHelper);

        this.mesh.position.x = xPosition;
        this.mesh.position.y = yPosition;
        this.mesh.position.z = zPosition;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

//  create the lightbulb 
const lightBulb = new Sphere(LIGHTBULB_RADIUS, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, LIGHT_COLOR, undefined, LIGHT_X_POSITION, LIGHT_Y_POSITION, LIGHT_Z_POSITION);
// lightBulb.mesh.material.color(LIGHT_COLOR);
console.log("material: " + lightBulb.mesh.material);
lightBulb.mesh.castShadow = false;
lightBulb.mesh.receiveShadow = false;

//  create balls at random locations
const BALLS_RADIUS = 1.2;
const BALLS_Y_POSITION = 9.7;
const NUMBER_OF_BALLS = 8;

let arrOfBalls = [];
generateBalls();

//  adding balls to the scene
arrOfBalls.forEach((sphere) => {
    biliardTable.add(sphere.mesh);
    // biliardTable.add(sphere.meshBoxHelper);
    // sphere.meshBoxHelper.update(); // updating position of ball box helper 
});

//  creating the feet of the table
const leftFrontFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, FRONT_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightFrontFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, FRONT_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);
const leftBackFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, BACK_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightBackFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, BACK_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);

//  creating the table top
const tableTop = new Box(TABLE_LENGTH, 1, TABLE_WIDTH, TABLE_COLOR, 9, 8, 7.5);

//  creating the borders of the table
const backBorder = new Box(GENERIC_BORDER_WIDTH, BORDER_HEIGHT, TABLE_WIDTH, TABLE_COLOR, 31, TABLE_BORDERS_Y, 7.5);
const frontBorder = new Box(GENERIC_BORDER_WIDTH, BORDER_HEIGHT, TABLE_WIDTH, TABLE_COLOR, -13, TABLE_BORDERS_Y, 7.5);
const leftBorder = new Box(TABLE_LENGTH, BORDER_HEIGHT, GENERIC_BORDER_DEPTH, TABLE_COLOR, 9, TABLE_BORDERS_Y, -4.5);
const rightBorder = new Box(TABLE_LENGTH, BORDER_HEIGHT, GENERIC_BORDER_DEPTH, TABLE_COLOR, 9, TABLE_BORDERS_Y, 19.5);

const roomFloor = new Box(370, 1, 350, "gray", 0, -8, 0);

//  adding biliard table objects to biliardTable object
[backBorder, frontBorder, leftBorder, rightBorder, leftBackFoot, leftFrontFoot, rightBackFoot, rightFrontFoot, tableTop].forEach(object => {
    biliardTable.add(object.mesh);
    // biliardTable.add(object.meshBoxHelper);
    // object.meshBoxHelper.update();
});

//  adding objects to the scene
[biliardTable, lightBulb.mesh, roomFloor.mesh].forEach(object => scene.add(object));

function generateBalls() {
    for (let i = 0; i < NUMBER_OF_BALLS; i++) {
        let { randX, randZ } = getCoordinates();
        const biliardBall = new Sphere(BALLS_RADIUS, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, "red", textures[i], randX, BALLS_Y_POSITION, randZ);
        //  check if the balls are intersecting
        if (arrOfBalls.length > 0) {
            for (let index = 0; index < arrOfBalls.length; index++) {
                let dist = arrOfBalls[index].mesh.position.clone().sub(biliardBall.mesh.position);
                while (dist.length() < 2 * BALLS_RADIUS) {
                    let { randX, randZ } = getCoordinates();
                    biliardBall.mesh.position.x = randX;
                    biliardBall.mesh.position.z = randZ;
                    dist = arrOfBalls[index].mesh.position.clone().sub(biliardBall.mesh.position);
                    index = 0;
                }
            }
        }
        arrOfBalls.push(biliardBall);
    }
}

function getCoordinates() {
    let randX = Math.floor(Math.random() * 29);
    let randZ = Math.floor(Math.random() * 17);

    const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
    const plusOrMinusZ = Math.random() < 0.5 ? -1 : 1;

    if (randX >= 0 && randX <= 11) {
        randX *= plusOrMinusX;
    }

    if (randZ >= 0 && randZ <= 2.5) {
        randZ *= plusOrMinusZ;
    }
    return { randX, randZ };
}

//  generate movement of the balls 

//  make the balls rotate

//  detect collision of the balls with the table borders

//  detect collision of the balls with other balls


//* Render loop
const controls = new THREE.TrackballControls(camera, canvas);

function render() {
    requestAnimationFrame(render);

    // updateBoxHelpers();

    controls.update();
    renderer.render(scene, camera);
}
render();
