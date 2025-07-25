# Computer Graphics - Exercise 6 - WebGL Basketball Court

## Getting Started
1. Clone this repository to your local machine
2. Make sure you have Node.js installed
3. Start the local web server: `node index.js`
4. Open your browser and go to http://localhost:8000

## Complete Instructions
**All detailed instructions, requirements, and specifications can be found in:**
`basketball_exercise_instructions.html`

## Group Members
**MANDATORY: Add the full names of all group members here:**
- Niv Kirshenbaum   ( ID: 315328336 )

## Technical Details
- Run the server with: `node index.js`
- Access at http://localhost:8000 in your web browser

## Controls
- `Arrow Keys` – Move the basketball left, right, up, and down
- `W` / `S` – Increase/decrease shot power (0–100%)
- `Spacebar` – Shoot the basketball
- `R` – Reset the basketball to the initial position
- `O` – Toggle camera orbit controls

## Physics System Description
- **Gravity simulation:** Constant downward acceleration is applied to simulate natural ball falling
- **Trajectory & arc:** Ball velocity is split into components based on angle toward nearest hoop
- **Energy loss:** On bounce, vertical velocity is reduced to simulate realistic damping
- **Backboard collision:** Ball bounces off when hitting the backboard
- **Successful shot detection:** Ball entering the rim area from above triggers a score event
- **Rotation animation:** Ball spins backward realistically during flight

## Additional Features
- Ball and hoop materials/textures for improved visuals
- Score tracking with UI update
- Shot feedback messages ("Shot Made+2 Points", "MISSED SHOT")
- Clean layout with a full court and two baskets


