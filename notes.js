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
  const freeThrowLineX = isRightSide ? centerX - 3 : centerX + 3; // Free throw line position
  const baselineX = isRightSide ? 14.5 : -14.5; // Baseline position
  
  // Free throw circle - BUT ONLY THE PART THAT DOESN'T OVERLAP THREE-POINT LINE
  const circlePoints = [];
  const threePointRadius = 6.75;
  const hoopX = centerX; // Where the hoop is
  
  for (let i = 0; i <= 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    const x = freeThrowLineX + Math.cos(angle) * 3;
    const z = Math.sin(angle) * 3;
    
    // Calculate distance from this point to the hoop center
    const distanceToHoop = Math.sqrt((x - hoopX) * (x - hoopX) + z * z);
    
    // Only add points that are INSIDE the three-point arc (closer to hoop)
    if (distanceToHoop < threePointRadius - 0.1) { // Small buffer to avoid overlap
      circlePoints.push(new THREE.Vector3(x, yOffset, z));
    }
  }
  
  const circleGeometry = new THREE.BufferGeometry().setFromPoints(circlePoints);
  const freeThrowCircle = new THREE.Line(circleGeometry, material);
  scene.add(freeThrowCircle);
  
  // Free throw line (vertical line)
  const freeThrowLineGeometry = new THREE.BufferGeometry();
  freeThrowLineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    freeThrowLineX, yOffset, -3,
    freeThrowLineX, yOffset, 3,
  ]), 3));
  scene.add(new THREE.Line(freeThrowLineGeometry, material));
  
  // Key area (the lane) - from baseline to free throw line
  const keyPoints = [
    new THREE.Vector3(baselineX, yOffset, -3),      // Baseline bottom
    new THREE.Vector3(freeThrowLineX, yOffset, -3), // Free throw line bottom
    new THREE.Vector3(freeThrowLineX, yOffset, 3),  // Free throw line top
    new THREE.Vector3(baselineX, yOffset, 3),       // Baseline top
    new THREE.Vector3(baselineX, yOffset, -3)       // Close the rectangle
  ];
  const keyGeometry = new THREE.BufferGeometry().setFromPoints(keyPoints);
  const keyLine = new THREE.Line(keyGeometry, material);
  scene.add(keyLine);
}











////////////

initializeBonusFeatures(scene)
