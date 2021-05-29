import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

var clock, mixer, renderer, scene, camera;

init();
animate();

function init() {
  // Canvas
  const canvas = document.querySelector("canvas.webgl");

  // Scene
  scene = new THREE.Scene();

  // Torus
  const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(0xff0000);
  const sphere = new THREE.Mesh(geometry, material);
  // scene.add(sphere);

  // Load Totoro uwu
  const loader = new GLTFLoader();
  loader.load(
    "/model.glb",
    function (gltf) {
      scene.add(gltf.scene);
      mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  // Lights
  const light = new THREE.PointLight(0xffffff, 2, 200);
  light.position.x = -20;
  light.position.y = 25;
  light.position.z = 15;
  light.castShadow = "true";
  scene.add(light);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Camera
   */
  // Base camera
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 10;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  clock = new THREE.Clock();
}

/**
 * Animate
 */

function animate() {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}

tick();
