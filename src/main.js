import './style.css';
import {
    Cartesian3,
    Color,
    Ion,
    Math as CesiumMath,
    Viewer,
    Transforms,
    DirectionalLight,
    Matrix4
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set base path and Ion token
window.CESIUM_BASE_URL = '/Cesium';
Ion.defaultAccessToken = import.meta.env.VITE_TOKEN;

const viewer = new Viewer('cesiumContainer', {
    terrain: null,
    skyBox: false,
    skyAtmosphere: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    geocoder: false,
    infoBox: false,
    selectionIndicator: false,
});

// Scene configuration
viewer.scene.globe.show = false;
viewer.scene.fog.enabled = false;
viewer._cesiumWidget._creditContainer.style.display = 'none';
viewer.scene.backgroundColor = Color.BLACK;

// Camera configuration (looking straight down)
const center = Cartesian3.fromDegrees(0, 0, 0);
viewer.camera.setView({
    destination: Cartesian3.fromDegrees(0, 0, 500), // 500 meters altitude
    orientation: {
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-90), // Directly downward
        roll: 0
    }
});

// Lighting configuration
viewer.scene.light = new DirectionalLight({
    direction: Cartesian3.normalize(new Cartesian3(1, 1, -1), new Cartesian3()),
    intensity: 2.0
});

// Function to generate cubes
function generateCubes(count) {
    viewer.entities.removeAll(); // Clear previous entities
    
    const boundary = 500; // 500 meters in each direction
    const cubeSize = 8; // Reduced size for better visibility

    for (let i = 0; i < count; i++) {
        // Generate local coordinates (meters from center)
        const east = (Math.random() - 0.5) * boundary;
        const north = (Math.random() - 0.5) * boundary;
        const height = (Math.random() - 0.5) * boundary;

        // Convert to ECEF position
        const position = Matrix4.multiplyByPoint(
            Transforms.eastNorthUpToFixedFrame(center),
            new Cartesian3(east, north, height),
            new Cartesian3()
        );

        viewer.entities.add({
            position: position,
            box: {
                dimensions: new Cartesian3(cubeSize, cubeSize, cubeSize),
                material: Color.RED.withAlpha(0.8),
                outline: true,
                outlineColor: Color.BLACK
            }
        });
    }
}

// Initial render
generateCubes(10000);

// Button event listeners
document.getElementById('btn-10k').addEventListener('click', () => generateCubes(10000));
document.getElementById('btn-100k').addEventListener('click', () => generateCubes(100000));
document.getElementById('btn-1m').addEventListener('click', () => generateCubes(1000000));