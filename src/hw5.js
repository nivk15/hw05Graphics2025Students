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



// // ****************************************************************************************

// ********************************************************************************

//////////////////////////////////////////////////////////////
function addCourtMarkings(scene) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); 

  const sidelineOffset = 14.5;   // Court half-length
  const baselineOffset = 7.25;   // Court half-width
  const yOffset = 0.11;

  // Left Sideline
  const leftSidelineGeometry = new THREE.BufferGeometry();
  leftSidelineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    -sidelineOffset, yOffset, -baselineOffset,
    -sidelineOffset, yOffset,  baselineOffset,
  ]), 3));
  scene.add(new THREE.Line(leftSidelineGeometry, lineMaterial));

  // Right Sideline
  const rightSidelineGeometry = new THREE.BufferGeometry();
  rightSidelineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    sidelineOffset, yOffset, -baselineOffset,
    sidelineOffset, yOffset,  baselineOffset,
  ]), 3));
  scene.add(new THREE.Line(rightSidelineGeometry, lineMaterial));

  // Near Baseline
  const nearBaselineGeometry = new THREE.BufferGeometry();
  nearBaselineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    -sidelineOffset, yOffset, -baselineOffset,
    sidelineOffset, yOffset, -baselineOffset,
  ]), 3));
  scene.add(new THREE.Line(nearBaselineGeometry, lineMaterial));

  // Far Baseline
  const farBaselineGeometry = new THREE.BufferGeometry();
  farBaselineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    -sidelineOffset, yOffset, baselineOffset,
    sidelineOffset, yOffset, baselineOffset,
  ]), 3));
  scene.add(new THREE.Line(farBaselineGeometry, lineMaterial));

  // Center Line
  const centerLineGeometry = new THREE.BufferGeometry();
  centerLineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    0, yOffset, -baselineOffset,
    0, yOffset, baselineOffset
  ]), 3));
  scene.add(new THREE.Line(centerLineGeometry, lineMaterial));

  // Center Circle
  const centerCircleGeometry = new THREE.CircleGeometry(1.8, 64);
  const centerCircleEdges = new THREE.EdgesGeometry(centerCircleGeometry);
  const centerCircleLine = new THREE.LineSegments(centerCircleEdges, lineMaterial);
  centerCircleLine.rotation.x = -Math.PI / 2;
  centerCircleLine.position.y = yOffset;
  scene.add(centerCircleLine);
}


//////////////////////////////

// Add three-point lines to the court
function addThreePointLines(scene) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const yOffset = 0.11;
  
  // Three-point line parameters
  const centerDistance = 12; // Distance from center to basket
  const radius = 6.75; // Three-point arc radius
  const baselineOffset = 7.25; // Court half-width (baseline position)
  
  // Create left three-point line (basket at x = -12)
  createThreePointArc(scene, -centerDistance, radius, baselineOffset, yOffset, lineMaterial, false);
  
  // Create right three-point line (basket at x = 12)  
  createThreePointArc(scene, centerDistance, radius, baselineOffset, yOffset, lineMaterial, true);
}

function createThreePointArc(scene, centerX, radius, baselineOffset, yOffset, material, isRightSide) {
  const points = [];
  const segments = 64; // Higher resolution for smoother arc
  
  // Create the curved arc from -90° to +90°, but limit to baseline
  for (let i = 0; i <= segments; i++) {
    let angle = (i / segments) * Math.PI - Math.PI/2; // -90° to +90°
    
    // For right side, flip the arc direction
    if (isRightSide) {
      angle = Math.PI - angle;
    }
    
    const x = centerX + Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    // Only add points that are within the court baseline bounds
    if (Math.abs(z) <= baselineOffset) {
      points.push(new THREE.Vector3(x, yOffset, z));
    }
  }
  
  // Create the line geometry
  const threePointGeometry = new THREE.BufferGeometry();
  const positions = [];
  
  for (let point of points) {
    positions.push(point.x, point.y, point.z);
  }
  
  threePointGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  
  // Add the line to the scene
  const threePointLine = new THREE.Line(threePointGeometry, material);
  scene.add(threePointLine);
}


///***********ldsfjsljf */
// Add basketball hoops to the court
// Add basketball hoops to the court
// Add basketball hoops to the court
// Add basketball hoops to the court
function addBasketballHoops(scene) {
  // Create hoops at both ends of the court
  createSingleHoop(scene, 13, 0, Math.PI); // Right hoop (facing left)
  createSingleHoop(scene, -13, 0, 0);      // Left hoop (facing right)
}

// Create a single basketball hoop with all components
function createSingleHoop(scene, x, z, rotationY) {
  const hoopGroup = new THREE.Group();
  
  // Support pole (positioned behind backboard)
  const poleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 10);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  
  // Position pole BEHIND backboard (further away from court center)
  const poleOffsetX = rotationY === 0 ? -2.0 : 2.0; // Further behind backboard
  pole.position.set(x + poleOffsetX, 5, z);
  pole.castShadow = true;
  hoopGroup.add(pole);
  
  // Support arm connecting pole to backboard
  const armGeometry = new THREE.BoxGeometry(2.0, 0.2, 0.3); // Longer arm to reach backboard
  const arm = new THREE.Mesh(armGeometry, poleMaterial);
  // Position arm to connect pole to backboard
  const armOffsetX = rotationY === 0 ? -1.0 : 1.0; // Centered between pole and backboard
  arm.position.set(x + armOffsetX, 9.5, z);
  arm.castShadow = true;
  hoopGroup.add(arm);
  
  // Backboard - whiter and more visible
  const backboardGeometry = new THREE.BoxGeometry(0.15, 3.5, 6);
  const backboardMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,      // Pure white
    transparent: true, 
    opacity: 0.85,         // Less transparent (more visible white)
    shininess: 120,       // Higher shininess for brighter appearance
    side: THREE.DoubleSide,
    emissive: 0x111111    // Slight emission for brighter white
  });
  const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  backboard.position.set(x, 9.5, z);
  backboard.rotation.y = rotationY;
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  hoopGroup.add(backboard);
  
  // Rim
  const rimGeometry = new THREE.TorusGeometry(0.75, 0.05, 8, 32);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff6600 }); // Orange
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  
  // Position rim in front of backboard at regulation height
  const rimOffsetX = rotationY === 0 ? 0.6 : -0.6;
  rim.position.set(x + rimOffsetX, 7.5, z); // 7.5 units = ~10 feet
  rim.rotation.x = degrees_to_radians(90);
  rim.castShadow = true;
  hoopGroup.add(rim);
  
  // Create net using line segments
  createNet(x + rimOffsetX, 7.5, z, hoopGroup);
  
  scene.add(hoopGroup);
}

// Create basketball net using line segments
function createNet(x, y, z, parent) {
  const netMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const netSegments = 12;
  const rimRadius = 0.75;
  const netLength = 1.5;
  const netLevels = 6; // Number of horizontal levels in the net
  
  // Create vertical segments from rim
  const verticalPoints = [];
  for (let i = 0; i < netSegments; i++) {
    const angle = (i / netSegments) * Math.PI * 2;
    const startX = Math.cos(angle) * rimRadius;
    const startZ = Math.sin(angle) * rimRadius;
    
    const points = [];
    for (let j = 0; j <= netLevels; j++) {
      const t = j / netLevels;
      const curveFactor = Math.sin(t * Math.PI) * 0.4; // Creates a curved droop
      const segX = startX * (1 - t * 0.3); // Inward curve
      const segY = -t * netLength - curveFactor;
      const segZ = startZ * (1 - t * 0.3);
      const point = new THREE.Vector3(x + segX, y + segY, z + segZ);
      points.push(point);
      
      // Store points for horizontal connections
      if (!verticalPoints[j]) verticalPoints[j] = [];
      verticalPoints[j].push(point);
    }
    
    // Create vertical line segment
    const segmentGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const netSegment = new THREE.Line(segmentGeometry, netMaterial);
    parent.add(netSegment);
  }
  
  // Create horizontal connecting segments (every other level for realistic look)
  for (let level = 1; level < netLevels; level += 1) {
    if (verticalPoints[level]) {
      for (let i = 0; i < verticalPoints[level].length; i++) {
        const currentPoint = verticalPoints[level][i];
        const nextPoint = verticalPoints[level][(i + 1) % verticalPoints[level].length];
        
        // Create horizontal connecting line
        const horizontalGeometry = new THREE.BufferGeometry().setFromPoints([currentPoint, nextPoint]);
        const horizontalSegment = new THREE.Line(horizontalGeometry, netMaterial);
        parent.add(horizontalSegment);
        
        // Add diagonal connections for more realistic net pattern (every other segment)
        if (level < netLevels - 1 && i % 2 === 0) {
          const diagonalPoint = verticalPoints[level + 1][(i + 1) % verticalPoints[level + 1].length];
          const diagonalGeometry = new THREE.BufferGeometry().setFromPoints([currentPoint, diagonalPoint]);
          const diagonalSegment = new THREE.Line(diagonalGeometry, netMaterial);
          parent.add(diagonalSegment);
        }
      }
    }
  }
}

///////////////******************************* */

// Create all elements
createBasketballCourt();
addCourtMarkings(scene);

addThreePointLines(scene);  // Add this line

addBasketballHoops(scene);  // Add this line





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



//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////


