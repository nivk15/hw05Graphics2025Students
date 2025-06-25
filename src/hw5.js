import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}


// Create basketball court
function createBasketballCourt() {
  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);
  const courtMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xc68642,  // Brown wood color
    shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);
  
  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features
}



// ****************************************************************************************
function addCourtMarkings(scene) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White lines
  const lineThickness = 0.03;

  // 1️⃣ Center Line
  const centerLineGeometry = new THREE.BufferGeometry();
  const centerLineVertices = new Float32Array([
    -15, 0.1, 0,
     15, 0.1, 0
  ]);
  centerLineGeometry.setAttribute('position', new THREE.BufferAttribute(centerLineVertices, 3));
  const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
  scene.add(centerLine);

  // 2️⃣ Center Circle
  const centerCircleGeometry = new THREE.CircleGeometry(1.8, 64);
  const centerCircleEdges = new THREE.EdgesGeometry(centerCircleGeometry);
  const centerCircleLine = new THREE.LineSegments(centerCircleEdges, lineMaterial);
  centerCircleLine.rotation.x = -Math.PI / 2;
  centerCircleLine.position.y = 0.1;
  scene.add(centerCircleLine);

  // 3️⃣ Three-Point Arcs
  const threePointRadius = 6.75;

  function createThreePointArc(xPosition) {
    const arcCurve = new THREE.EllipseCurve(
      0, 0,
      threePointRadius,
      threePointRadius,
      Math.PI / 2,
      -Math.PI / 2,
      xPosition > 0
    );
    const points = arcCurve.getPoints(64);
    const arcGeometry = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, 0.1, p.y))
    );
    const arc = new THREE.Line(arcGeometry, lineMaterial);
    arc.position.x = xPosition;
    scene.add(arc);
  }

  createThreePointArc(-14);
  createThreePointArc(14);
}
// ********************************************************************************

// Create all elements
createBasketballCourt();
addCourtMarkings(scene);


// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <p>O - Toggle orbit camera</p>
`;
document.body.appendChild(instructionsElement);

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();