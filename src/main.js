import './style.css';
import {
	Cartesian3,
	Color,
	Ion,
	Math as CesiumMath,
	Primitive,
	Viewer,
	BoxGeometry,
	GeometryInstance,
	Matrix4,
	VertexFormat,
	PerInstanceColorAppearance,
	ColorGeometryInstanceAttribute,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Disable default Cesium features (globe, terrain, atmosphere)
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

// Remove all imagery and default globe
viewer.imageryLayers.removeAll();
viewer.scene.globe.show = false;
viewer.scene.fog.enabled = false;
viewer._cesiumWidget._creditContainer.style.display = 'none'; // Remove Cesium logo

// ✅ Ensure the scene background is black (prevents transparency issues)
viewer.scene.backgroundColor = Color.BLACK;

// ✅ Enable lighting effects (ensures objects are visible even without a globe)
viewer.scene.globe.dynamicAtmosphereLighting = true;

// ✅ Set an initial camera position
viewer.camera.setView({
	destination: Cartesian3.fromDegrees(0, 0, 500),
	orientation: {
		heading: CesiumMath.toRadians(0),
		pitch: CesiumMath.toRadians(-90),
		roll: 0,
	},
});

// Function to generate cubes
function generateCubes(count) {
	// Remove old cubes before adding new ones
	viewer.scene.primitives.removeAll();

	const instances = [];
	const boundary = 100; // Defines the confined space (-50 to 50 in each axis)

	for (let i = 0; i < count; i++) {
		const x = Math.random() * boundary - boundary / 2;
		const y = Math.random() * boundary - boundary / 2;
		const z = Math.random() * boundary - boundary / 2;

		instances.push(
			new GeometryInstance({
				geometry: new BoxGeometry({
					vertexFormat: VertexFormat.ALL, // ✅ Ensure geometry has correct attributes
					minimum: new Cartesian3(-1, -1, -1),
					maximum: new Cartesian3(1, 1, 1),
				}),
				modelMatrix: Matrix4.multiplyByTranslation(
					Matrix4.IDENTITY,
					new Cartesian3(x, y, z),
					new Matrix4()
				),
				attributes: {
					color: ColorGeometryInstanceAttribute.fromColor(
						Color.fromRandom({ alpha: 1.0 })
					),
				},
			})
		);
	}

	// ✅ Ensure objects are visible by using `unlit: false`
	const cubes = new Primitive({
		geometryInstances: instances,
		appearance: new PerInstanceColorAppearance({
			translucent: false,
			closed: true,
			flat: false, // ✅ Allow shading
			faceForward: true, // ✅ Ensures correct lighting
			unlit: false, // ✅ Enable lighting
		}),
	});

	viewer.scene.primitives.add(cubes);
}

// Initial render of 10,000 cubes
generateCubes(10000);

// Button event listeners
document
	.getElementById('btn-10k')
	.addEventListener('click', () => generateCubes(10000));
document
	.getElementById('btn-100k')
	.addEventListener('click', () => generateCubes(100000));
document
	.getElementById('btn-1m')
	.addEventListener('click', () => generateCubes(1000000));
