const BALLS_SPEED = 3;
const FRICTION_AND_REFLECTION = 0.2;

const TABLE_TOP_WIDTH = 25;
const TABLE_TOP_LENGTH = 45;
const TABLE_X = 9;
const TABLE_Y = 8;
const TABLE_Z = 7.5;

const FRONT_FEET_X = -TABLE_TOP_LENGTH + 35;
const BACK_FEET_X = TABLE_TOP_LENGTH - 16;
const LEFT_FEET_Z = 0;
const RIGHT_FEET_Z = TABLE_TOP_WIDTH - 9;
const TABLE_FEET_Y = 0;
const TABLE_FEET_WIDTH = 2.5;
const TABLE_FEET_HEIGHT = 15;
const TABLE_FEET_DEPTH = 3;

const GENERIC_BORDER_WIDTH = 1;
const GENERIC_BORDER_DEPTH = 1;
const TABLE_BORDERS_Y = 9;
const BORDER_HEIGHT = 3;

const TABLE_FEET_COLOR = "#663300";
const LIGHT_COLOR = "#ffffff";
const TABLE_COLOR = "#298031";

const LIGHT_X_POSITION = 0;
const LIGHT_Y_POSITION = 30;
const LIGHT_Z_POSITION = 0;

const LIGHTBULB_RADIUS = 1;
const LIGHTBULB_SEGMENT_WIDTH_HEIGHT = 64; // change to 64

const BALLS_RADIUS = 1;
const BALLS_Y_POSITION = 9.7;
const NUMBER_OF_BALLS = 8;

const ROOM_WIDTH = 370;
const ROOM_LENGTH = 350;
const FLOOR_Y_POSITION = -8;
const CEILING_Y_POSITION = 50;
const BULBWIRE_Y_POSITION = LIGHT_Y_POSITION + 10;
const WIRE_GIRTH = 0.3;
const WIRE_LENGTH = CEILING_Y_POSITION - 30;

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
// camera.position.set(-43, 31, 22); // camera the final view
// camera.position.set(-50, 25, 20); // camera position
camera.position.set(-24, 43, 10); // camera view from above
// camera.position.set(-63, 38, 25);

const ambientLight = new THREE.AmbientLight(LIGHT_COLOR);
const spotLight = new THREE.SpotLight(LIGHT_COLOR);

spotLight.castShadow = true;
spotLight.position.set(LIGHT_X_POSITION, LIGHT_Y_POSITION, LIGHT_Z_POSITION);

scene.add(spotLight);
scene.add(ambientLight);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const biliardTable = new THREE.Object3D();
biliardTable.position.set(-10, 0, -6);
// biliardTable.position.set(0, 0, 0);

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

    updateBox() {
        this.meshBoxHelper.setFromObject(this.mesh);
        this.meshBoxHelper.update();
        this.meshBBox.setFromObject(this.mesh);
    }
}
//  on the helper axis 
//  z - blue arrow 
//  x - red arrow 
//  y - green arrow 

class Sphere { //    this class will be used for the creation of the biliard balls  
    constructor(radius, widthSegment, heightSegment, texture, xPosition, yPosition, zPosition) {

        if (texture === LIGHT_COLOR) {  //  special case for the lightbulb
            this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(radius, widthSegment, heightSegment),
                new THREE.MeshStandardMaterial({ color: LIGHT_COLOR })
            );
        } else {
            this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(radius, widthSegment, heightSegment),
                texture
            );
        }

        this.meshBoxHelper = new THREE.BoxHelper(this.mesh, "red");
        this.meshBBox = new THREE.Box3();
        this.meshBBox.setFromObject(this.mesh);

        this.mesh.position.x = xPosition;
        this.mesh.position.y = yPosition;
        this.mesh.position.z = zPosition;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    updateBox() {
        this.meshBoxHelper.setFromObject(this.mesh);
        this.meshBoxHelper.update();
        this.meshBBox.setFromObject(this.meshBoxHelper);
    }
}

//  create the lightbulb 
const lightBulb = new Sphere(LIGHTBULB_RADIUS, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, LIGHT_COLOR, LIGHT_X_POSITION, LIGHT_Y_POSITION, LIGHT_Z_POSITION);
lightBulb.mesh.castShadow = false;
lightBulb.mesh.receiveShadow = false;


//  creating the feet of the table
const leftFrontFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, FRONT_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightFrontFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, FRONT_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);
const leftBackFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, BACK_FEET_X, TABLE_FEET_Y, LEFT_FEET_Z);
const rightBackFoot = new Box(TABLE_FEET_WIDTH, TABLE_FEET_HEIGHT, TABLE_FEET_DEPTH, TABLE_FEET_COLOR, BACK_FEET_X, TABLE_FEET_Y, RIGHT_FEET_Z);

//  creating the table top
const tableTop = new Box(TABLE_TOP_LENGTH, 1, TABLE_TOP_WIDTH, TABLE_COLOR, TABLE_X, TABLE_Y, TABLE_Z);

//  creating the borders of the table
const backBorder = new Box(GENERIC_BORDER_WIDTH, BORDER_HEIGHT, TABLE_TOP_WIDTH, TABLE_COLOR, 31, TABLE_BORDERS_Y, 7.5);
const frontBorder = new Box(GENERIC_BORDER_WIDTH, BORDER_HEIGHT, TABLE_TOP_WIDTH, TABLE_COLOR, -13, TABLE_BORDERS_Y, 7.5);
const leftBorder = new Box(TABLE_TOP_LENGTH, BORDER_HEIGHT, GENERIC_BORDER_DEPTH, TABLE_COLOR, 9, TABLE_BORDERS_Y, -4.5);
const rightBorder = new Box(TABLE_TOP_LENGTH, BORDER_HEIGHT, GENERIC_BORDER_DEPTH, TABLE_COLOR, 9, TABLE_BORDERS_Y, 19.5);

const roomFloor = new Box(ROOM_WIDTH, 1, ROOM_LENGTH, "gray", 0, FLOOR_Y_POSITION, 0);
const roomCeiling = new Box(ROOM_WIDTH, 1, ROOM_LENGTH, "gray", 0, CEILING_Y_POSITION, 0);
const bulbWire = new Box(WIRE_GIRTH, WIRE_LENGTH, WIRE_GIRTH, "black", LIGHT_X_POSITION, BULBWIRE_Y_POSITION, LIGHT_Z_POSITION);


//  create balls at random locations
function generateXYCoordinates() {
    let randX = Math.floor(Math.random() * 29);
    let randZ = Math.floor(Math.random() * 17);

    const { plusOrMinusX, plusOrMinusZ } = plusOrMinus();

    if (randX >= 0 && randX <= 11) {
        randX *= plusOrMinusX;
    }

    if (randZ >= 0 && randZ <= 2.5) {
        randZ *= plusOrMinusZ;
    }
    return { randX, randZ };
}

let arrOfBalls = [];
const arrOfAxes = [];

function plusOrMinus() {
    const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
    const plusOrMinusZ = Math.random() < 0.5 ? -1 : 1;
    return { plusOrMinusX, plusOrMinusZ };
}

const arrOfVelocities = generateRandomVelocities();
function generateRandomVelocities() {
    // const SLOW_DOWN = 2;
    const arrOfVelocities = [];
    for (let i = 0; i < NUMBER_OF_BALLS; i++) {
        const { plusOrMinusX, plusOrMinusZ } = plusOrMinus();
        // arrOfVelocities.push(new THREE.Vector3(BALLS_SPEED * Math.random() * plusOrMinusX, 0, BALLS_SPEED * Math.random() * plusOrMinusZ).divideScalar(SLOW_DOWN));
        arrOfVelocities.push(new THREE.Vector3(BALLS_SPEED * Math.random() * plusOrMinusX, 0, BALLS_SPEED * Math.random() * plusOrMinusZ));
    }
    return arrOfVelocities;
}


function generateBalls() {
    for (let i = 0; i < NUMBER_OF_BALLS; i++) {
        let { randX, randZ } = generateXYCoordinates();
        const biliardBall = new Sphere(BALLS_RADIUS, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, LIGHTBULB_SEGMENT_WIDTH_HEIGHT, textures[i], randX, BALLS_Y_POSITION, randZ);
        if (arrOfBalls.length > 0) {
            for (let index = 0; index < arrOfBalls.length; index++) {

                let dist = arrOfBalls[index].mesh.position.clone().sub(biliardBall.mesh.position);
                //  if the coordinates of the new ball coincide with any of those that are on the table, generate new ones
                while (dist.length() < 2 * BALLS_RADIUS) {
                    let { randX, randZ } = generateXYCoordinates();
                    biliardBall.mesh.position.x = randX;
                    biliardBall.mesh.position.z = randZ;
                    dist = arrOfBalls[index].mesh.position.clone().sub(biliardBall.mesh.position);
                    index = 0;
                }
            }
        }
        arrOfBalls.push(biliardBall);
        arrOfAxes.push(new THREE.Vector3(0, 0, 1));
        arrOfAxes[i].cross(arrOfVelocities[i]).normalize();
    }
}
generateBalls();

function updateBoxHelpers() {
    [backBorder, frontBorder, leftBorder, rightBorder].forEach(object => {
        object.updateBox();
    });

    arrOfBalls.forEach(ball => {
        ball.updateBox();
    });
}

function ballRotation(index, dt) {
    const dR = new THREE.Matrix4(); // delta-rotational matrix
    arrOfAxes[index].set(0, 0, 1);
    arrOfAxes[index].cross(arrOfVelocities[index]).normalize();
    let ballOmega = arrOfVelocities[index].length() / BALLS_RADIUS;
    dR.makeRotationAxis(arrOfAxes[index], ballOmega * dt);
    arrOfBalls[index].mesh.matrix.premultiply(dR);

    //translation along a straight line
    arrOfBalls[index].mesh.position.add(arrOfVelocities[index].clone().multiplyScalar(dt));
    arrOfBalls[index].mesh.matrix.setPosition(arrOfBalls[index].mesh.position);
}

function rotationAfterCollision(index) {
    arrOfAxes[index] = new THREE.Vector3(0, 0, 1);
    arrOfAxes[index].cross(arrOfVelocities[index].clone().normalize());
}

function reflection(dt) {
    let index = 0;
    arrOfBalls.forEach(ball => {
        ballRotation(index, dt);

        if (ball.meshBBox.intersectsBox(backBorder.meshBBox)) {
            arrOfVelocities[index].x = -Math.abs(arrOfVelocities[index].x - arrOfVelocities[index].x * FRICTION_AND_REFLECTION);
            rotationAfterCollision(index);
        }

        if (ball.meshBBox.intersectsBox(frontBorder.meshBBox)) {
            arrOfVelocities[index].x = Math.abs(arrOfVelocities[index].x - arrOfVelocities[index].x * FRICTION_AND_REFLECTION);
            rotationAfterCollision(index);
        }

        if (ball.meshBBox.intersectsBox(rightBorder.meshBBox)) {
            arrOfVelocities[index].z = -Math.abs(arrOfVelocities[index].z - arrOfVelocities[index].z * FRICTION_AND_REFLECTION);
            rotationAfterCollision(index);
        }

        if (ball.meshBBox.intersectsBox(leftBorder.meshBBox)) {
            arrOfVelocities[index].z = Math.abs(arrOfVelocities[index].z - arrOfVelocities[index].z * FRICTION_AND_REFLECTION);
            rotationAfterCollision(index);
        }
        index++;
    });
}

function frictionWithDesk(dt) { //  updates balls speed according to friction
    let index = 0;
    arrOfBalls.forEach(ball => {
        ball.mesh.position.add(arrOfVelocities[index].multiplyScalar(1 - FRICTION_AND_REFLECTION * dt));
        index++;
    });
}

//  detect collision of the balls with other balls

//  remove axes helper


//  adding biliard table objects to biliardTable object
[backBorder, frontBorder, leftBorder, rightBorder, leftBackFoot, leftFrontFoot, rightBackFoot, rightFrontFoot, tableTop].forEach(object => {
    biliardTable.add(object.mesh);
});

//  adding balls to the scene
arrOfBalls.forEach((ball) => {
    ball.matrixAutoUpdate = false;
    biliardTable.add(ball.mesh);
});

//  adding objects to the scene
[biliardTable, lightBulb.mesh, roomFloor.mesh, roomCeiling.mesh, bulbWire.mesh].forEach(object => scene.add(object));


//* Render loop
const computerClock = new THREE.Clock();
const controls = new THREE.TrackballControls(camera, canvas);
function render() {
    requestAnimationFrame(render);

    const dt = computerClock.getDelta();

    // ballMovement(arrOfVelocities);
    frictionWithDesk(dt);
    updateBoxHelpers();
    reflection(dt);

    controls.update();
    renderer.render(scene, camera);
}
render();