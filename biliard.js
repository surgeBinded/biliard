// Create a house

//* Initialize webGL with camera and lights
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setClearColor('rgb(255,255,255)');
// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 30;

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);
const light = new THREE.DirectionalLight(0x444444);
light.position.set( 1.5,1,1 );
scene.add(light);

class Box{ //   this class will be used for creating the feet and the borders of the table AWA the table plane. 
    constructor(width, height, depth, color){
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshBasicMaterial({color: color})
        );
        return this.mesh;
    }
}

class Sphere{ //    this class will be used for the creation of the biliard balls  
    constructor(radius, widthSegment, heightSegment, color){
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, widthSegment, heightSegment),
            new THREE.MeshBasicMaterial({color: color})
        );
        return this.mesh;
    }
}

tableFeet = new Box(10, 20, 5, "brown");

scene.add(tableFeet);


//* Render loop
const controls = new THREE.TrackballControls( camera, canvas );

function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, camera);
}

render();
