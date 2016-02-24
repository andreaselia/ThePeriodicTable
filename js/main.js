/*
 *  Code developed by the Moose Lightning group
 *  Andreas Elia, Jack Hilton, Connell Henry, Alex Woodward
 */

// Once the page had loaded, call the init function
window.onload = init;

// Shortcut for using THREE based functions
var t = THREE;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_PLANE = 0.1;
var FAR_PLANE = 10000;

var scene;
var renderer;
var camera;
var clock;
var stats;
var key;

function init() {
    // Create a WebGL renderer
    renderer = new t.WebGLRenderer();

    // Set the renderer size
    renderer.setSize(WIDTH, HEIGHT);

    // Change the colour of the background
    renderer.setClearColor(0xFFFFFF);

    // Add the renderers DOM element to the window
    document.body.appendChild(renderer.domElement);

    // Create a new scene
    scene = new t.Scene();

    // Create a camera
    camera = new t.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE);

    // If the position wasn't set, the camera would start at 0, 0, 0
    camera.position.set(0, 0, 470);

    // Create a new instance of the clock
    clock = new t.Clock();

    // Create a new instance of the key input handler
    key = new Keyboard();

    // Create the stats for tracking performance
    stats = new Stats();

    // Set the mode for the stats tracking to 0 for FPS mode
    stats.setMode(0);

    // Add the stats DOM element to the window
    document.body.appendChild(stats.domElement);

    // Call a function to setup the scene
    initScene();

    // Start the updating and rendering
    animate();
}

function initScene() {

}

function animate() {
    stats.begin();

    update();
    render();

    stats.end();

    requestAnimationFrame(animate);
}

function update() {
    var dt = clock.getDelta();

    sphere.position.x = sphere.position.x - 0.2;

    stats.update();
}

function render() {
    renderer.render(scene, camera);
}
