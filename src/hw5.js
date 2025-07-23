import {OrbitControls} from './OrbitControls.js'

let basketball; 
let ballPosition = { x: 0, y: 0.6, z: 0 };
const keys = {};
const clock = new THREE.Clock();


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


// ===========================================================
// ===========================================================
function addThreePointLines(scene) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const yOffset = 0.11;

  // Three-point line constants
  const THREE_POINT_RADIUS = 6.75;  // Radius of the arc
  const BASELINE_OFFSET = 14.5;     // Distance from center to the baseline

  // Left side three-point line
  createThreePointArc(
    scene,
    -BASELINE_OFFSET,           // X position
    THREE_POINT_RADIUS,
    BASELINE_OFFSET,
    yOffset,
    lineMaterial,
    false                       // Left side
  );
  // Right side three-point line
  createThreePointArc(
    scene,
    BASELINE_OFFSET,
    THREE_POINT_RADIUS,
    BASELINE_OFFSET,
    yOffset,
    lineMaterial,
    true                        // Right side
  );
}

function createThreePointArc(scene, centerX, radius, baselineOffset, yOffset, material, isRightSide) {
  const points = [];
  const segments = 64;

  // Angle range:
  // Left side: from -90° (−π/2) to +90° (π/2).
  // Right side: from 90° (π/2) to 270° (3π/2).
  const startAngle = isRightSide ? Math.PI / 2 : -Math.PI / 2;
  const endAngle = isRightSide ? (3 * Math.PI) / 2 : Math.PI / 2;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = startAngle + t * (endAngle - startAngle);

    const x = centerX + Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Only accept points within the court half (end line range).
    if (Math.abs(z) <= 7.25) {
      points.push(new THREE.Vector3(x, yOffset, z));
    }
  }

  // Finalize geometry
  const threePointGeometry = new THREE.BufferGeometry();
  threePointGeometry.setFromPoints(points);
  const threePointLine = new THREE.Line(threePointGeometry, material);
  scene.add(threePointLine);
}

/// 


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
  


function addStaticBasketball(scene) {
  // Basketball sphere
  const ballGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  const ballMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff6600,
    shininess: 30,
    specular: 0x222222
  });
  // const basketball = new THREE.Mesh(ballGeometry, ballMaterial);
  basketball = new THREE.Mesh(ballGeometry, ballMaterial); // Remove 'const'


  basketball.position.set(0, 0.6, 0);
  basketball.castShadow = true;

  // Add the basketball to the scene
  scene.add(basketball);

  // Add the seams
  createBasketballSeams(basketball);
}

function createBasketballSeams(basketball) {
  const seamMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); 
  const radius = 0.6;

  // 1️⃣ Vertical seam (around X axis)
  const verticalSeamGeometry = new THREE.TorusGeometry(radius, 0.01, 16, 100);
  const verticalSeam = new THREE.Mesh(verticalSeamGeometry, seamMaterial);
  verticalSeam.rotation.y = Math.PI / 2;
  basketball.add(verticalSeam);

  // 2️⃣ Horizontal seam (around Z axis)
  const horizontalSeamGeometry = new THREE.TorusGeometry(radius, 0.01, 16, 100);
  const horizontalSeam = new THREE.Mesh(horizontalSeamGeometry, seamMaterial);
  horizontalSeam.rotation.x = Math.PI / 2;
  basketball.add(horizontalSeam);

  // 3️⃣ Angled seam #1 (~45°)
  const angledSeam1 = new THREE.TorusGeometry(radius, 0.01, 16, 100);
  const angledSeam1Mesh = new THREE.Mesh(angledSeam1, seamMaterial);
  angledSeam1Mesh.rotation.x = Math.PI / 4;
  basketball.add(angledSeam1Mesh);

  // 4️⃣ Angled seam #2 (~-45°)
  const angledSeam2 = new THREE.TorusGeometry(radius, 0.01, 16, 100);
  const angledSeam2Mesh = new THREE.Mesh(angledSeam2, seamMaterial);
  angledSeam2Mesh.rotation.x = -Math.PI / 4;
  basketball.add(angledSeam2Mesh);
}

/////////***************************** */

// Create UI Framework for future features
function createUIFramework() {
  // Score display container
  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'score-display';
  scoreDisplay.style.cssText = `
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    font-family: Arial, sans-serif;
    border: 2px solid #ff6600;
    z-index: 100;
    backdrop-filter: blur(5px);
  `;
  scoreDisplay.innerHTML = 'Basketball Court - HW05 Infrastructure';
  document.body.appendChild(scoreDisplay);
  
  // Controls display container
  const controlsDisplay = document.createElement('div');
  controlsDisplay.id = 'controls-display';
  controlsDisplay.style.cssText = `
    position: absolute;
    bottom: 80px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    border: 1px solid #333;
    max-width: 300px;
    z-index: 100;
    backdrop-filter: blur(5px);
  `;
  controlsDisplay.innerHTML = `
    <h3 style="margin: 0 0 10px 0; color: #ff6600; font-size: 16px;">Controls (HW05)</h3>
    <div style="margin: 5px 0; display: flex; justify-content: space-between; align-items: center;">
      <span><span style="background: #333; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #ff6600;">O</span></span>
      <span>Toggle Camera Controls</span>
    </div>
    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #444; font-size: 12px; color: #888;">
      <strong style="color: #ff6600;">Coming in HW06:</strong><br>
      • Arrow Keys - Move basketball<br>
      • W/S Keys - Shoot basketball<br>
      • Spacebar - Jump/bounce<br>
      • R Key - Reset position
    </div>
  `;
  document.body.appendChild(controlsDisplay);
  
  // Status display
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'status-display';
  statusDisplay.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    border: 1px solid #333;
    z-index: 100;
    backdrop-filter: blur(5px);
  `;
  statusDisplay.innerHTML = `
    <div style="margin: 3px 0; display: flex; justify-content: space-between; min-width: 150px;">
      <span>Camera:</span>
      <span id="camera-status" style="color: #00ff00; font-weight: bold;">ON</span>
    </div>
    <div style="margin: 3px 0; display: flex; justify-content: space-between;">
      <span>Basketball:</span>
      <span style="color: #ff6600; font-weight: bold;">STATIC</span>
    </div>
    <div style="margin: 3px 0; display: flex; justify-content: space-between;">
      <span>Physics:</span>
      <span style="color: #888; font-weight: bold;">DISABLED</span>
    </div>
  `;
  document.body.appendChild(statusDisplay);
  
  // Game info display (for future score and stats)
  const gameInfoDisplay = document.createElement('div');
  gameInfoDisplay.id = 'game-info';
  gameInfoDisplay.style.cssText = `
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    border: 1px solid #444;
    z-index: 100;
    backdrop-filter: blur(5px);
    display: none;
  `;
  gameInfoDisplay.innerHTML = `
    <div style="text-align: center;">
      <div style="color: #ff6600; font-weight: bold; margin-bottom: 5px;">GAME STATS</div>
      <div>Shots: <span id="shots-count">0</span></div>
      <div>Made: <span id="made-count">0</span></div>
      <div>Accuracy: <span id="accuracy">0%</span></div>
    </div>
  `;
  document.body.appendChild(gameInfoDisplay);
}

// Enhanced camera controls status update
function updateCameraStatus(isEnabled) {
  const statusElement = document.getElementById('camera-status');
  if (statusElement) {
    if (isEnabled) {
      statusElement.textContent = 'ON';
      statusElement.style.color = '#00ff00';
    } else {
      statusElement.textContent = 'OFF';
      statusElement.style.color = '#ff6600';
    }
  }
}
//////////////////////////////////////////
// Initialize all bonus features - SIMPLIFIED VERSION
// Bonus Feature 1: More detailed court markings (free throw lines, key areas)
function addDetailedCourtMarkings(scene) {
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const yOffset = 0.11;
  
  // Free throw lines and key areas for both sides
  addFreeThrowArea(scene, -12, lineMaterial, yOffset); // Left side
  addFreeThrowArea(scene, 12, lineMaterial, yOffset);   // Right side
}

function addFreeThrowArea(scene, centerX, material, yOffset) {
  // Determine which direction the hoop faces
  const isRightSide = centerX > 0;
  const freeThrowLineX = isRightSide ? centerX - 5.8 : centerX + 5.8; // Correct distance from hoop
  const baselineX = isRightSide ? 14.5 : -14.5; // Baseline position
  
  // Free throw circle - centered ON the free throw line
  const circlePoints = [];
  const freeThrowRadius = 1.8; // Smaller radius like center circle
  
  // Create arc from -60° to +60° (120° total)
  const startAngle = -Math.PI/3; // -60°
  const endAngle = Math.PI/3;    // +60°
  
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const angle = startAngle + t * (endAngle - startAngle);
    
    const x = freeThrowLineX + Math.cos(angle) * freeThrowRadius;
    const z = Math.sin(angle) * freeThrowRadius;
    circlePoints.push(new THREE.Vector3(x, yOffset, z));
  }
  
  const circleGeometry = new THREE.BufferGeometry().setFromPoints(circlePoints);
  const freeThrowArc = new THREE.Line(circleGeometry, material);
  scene.add(freeThrowArc);
  
  // Free throw line (vertical line)
  const freeThrowLineGeometry = new THREE.BufferGeometry();
  freeThrowLineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    freeThrowLineX, yOffset, -1.8,
    freeThrowLineX, yOffset, 1.8,
  ]), 3));
  scene.add(new THREE.Line(freeThrowLineGeometry, material));
  
  // Key area (the lane) - narrower rectangle
  const keyWidth = 1.8; // Narrower than before
  const keyPoints = [
    new THREE.Vector3(baselineX, yOffset, -keyWidth),      // Baseline bottom
    new THREE.Vector3(freeThrowLineX, yOffset, -keyWidth), // Free throw line bottom
    new THREE.Vector3(freeThrowLineX, yOffset, keyWidth),  // Free throw line top
    new THREE.Vector3(baselineX, yOffset, keyWidth),       // Baseline top
    new THREE.Vector3(baselineX, yOffset, -keyWidth)       // Close the rectangle
  ];
  const keyGeometry = new THREE.BufferGeometry().setFromPoints(keyPoints);
  const keyLine = new THREE.Line(keyGeometry, material);
  scene.add(keyLine);
}

// Bonus Feature 2: Multiple camera preset positions
function addCameraPresets() {
  let currentPreset = 0;
  const presets = [
    { position: [0, 15, 30], name: "Overview" },
    { position: [25, 8, 0], name: "Sideline" },
    { position: [0, 25, 0], name: "Top Down" },
    { position: [-15, 5, 15], name: "Corner" },
    { position: [0, 3, 20], name: "Court Level" }
  ];
  
  // Add camera preset controls to UI
  const presetControls = document.createElement('div');
  presetControls.id = 'camera-presets';
  presetControls.style.cssText = `
    position: absolute;
    top: 120px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 8px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    border: 1px solid #333;
    z-index: 100;
    backdrop-filter: blur(5px);
  `;
  presetControls.innerHTML = `
    <div style="color: #ff6600; font-weight: bold; margin-bottom: 8px;">Camera Presets</div>
    <div style="margin: 3px 0;">
      <span style="background: #333; padding: 1px 6px; border-radius: 3px; font-family: monospace; color: #ff6600;">1-5</span>
      <span style="margin-left: 8px;">Change View</span>
    </div>
    <div id="current-preset" style="margin-top: 5px; color: #00ff00; font-size: 11px;">
      Current: Overview
    </div>
  `;
  document.body.appendChild(presetControls);
  
  // Add keyboard listener for camera presets
  document.addEventListener('keydown', (e) => {
    const presetIndex = parseInt(e.key) - 1;
    if (presetIndex >= 0 && presetIndex < presets.length) {
      currentPreset = presetIndex;
      const preset = presets[presetIndex];
      
      // Animate camera to new position
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(...preset.position);
      
      let progress = 0;
      const animateCamera = () => {
        progress += 0.05;
        if (progress <= 1) {
          camera.position.lerpVectors(startPos, endPos, progress);
          camera.lookAt(0, 0, 0);
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
      
      // Update UI
      document.getElementById('current-preset').textContent = `Current: ${preset.name}`;
    }
  });
}

// Initialize bonus features

////////////////////////

// Create all elements
createBasketballCourt();
addCourtMarkings(scene);

addThreePointLines(scene);  

addBasketballHoops(scene);  

addStaticBasketball(scene);  

createUIFramework();  

// initializeBonusFeatures(scene)

////////////////////////////

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
// const instructionsElement = document.createElement('div');
// instructionsElement.style.position = 'absolute';
// instructionsElement.style.bottom = '20px';
// instructionsElement.style.left = '20px';
// instructionsElement.style.color = 'white';
// instructionsElement.style.fontSize = '16px';
// instructionsElement.style.fontFamily = 'Arial, sans-serif';
// instructionsElement.style.textAlign = 'left';
// instructionsElement.innerHTML = `
//   <h3>Controls:</h3>
//   <p>O - Toggle orbit camera</p>
// `;


function handleKeyDown(e) {
  if (e.key.toLowerCase() === "o") {
    isOrbitEnabled = !isOrbitEnabled;
    updateCameraStatus(isOrbitEnabled);  // Update status display
  }
}

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
    
    // Handle camera toggle (O key)
    if (event.key.toLowerCase() === "o") {
        isOrbitEnabled = !isOrbitEnabled;
        updateCameraStatus(isOrbitEnabled);
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});


function updateBasketballMovement(deltaTime) {
    const moveSpeed = 8;
    const movement = { x: 0, z: 0 };
    
    if (keys['ArrowLeft']) movement.z += moveSpeed * deltaTime;   // Move left
    if (keys['ArrowRight']) movement.z -= moveSpeed * deltaTime;  // Move right
    if (keys['ArrowUp']) movement.x -= moveSpeed * deltaTime;     // Move forward
    if (keys['ArrowDown']) movement.x += moveSpeed * deltaTime;   // Move backward
    
    ballPosition.x += movement.x;
    ballPosition.z += movement.z;
    
    basketball.position.set(ballPosition.x, ballPosition.y, ballPosition.z);
    
    ballPosition.x = Math.max(-14, Math.min(14, ballPosition.x));
    ballPosition.z = Math.max(-7, Math.min(7, ballPosition.z));
}


function animate() {
    requestAnimationFrame(animate);
    
    const deltaTime = clock.getDelta();
    
    // Update basketball movement
    updateBasketballMovement(deltaTime);
    
    // Update controls
    controls.enabled = isOrbitEnabled;
    controls.update();
    
    renderer.render(scene, camera);
}

// // Animation function
// function animate() {
//   requestAnimationFrame(animate);
  
//   // Update controls
//   controls.enabled = isOrbitEnabled;
//   controls.update();
  
//   renderer.render(scene, camera);
// }


animate();




