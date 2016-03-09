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

var loader = new t.ObjectLoader();

// Periodic table elements and information
var elements = [];

function init()
{
    // Create the stats for tracking performance
    stats = new Stats();

    // Set the mode for the stats tracking to 0 for FPS mode
    stats.setMode(0);

    // Add the stats DOM element to the window
    document.body.appendChild(stats.domElement);

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

    // Call a function to setup the scene
    initTableScene();

    // Start the updating and rendering
    animate();
}

function initTableElements()
{
    // column (x) -> row (y) -> shortname -> name -> description -> atomic number -> mass number -> object file name
    // the Y positiosn are in reverse
    addElement(0, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(0, 1, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(0, 2, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(0, 3, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(0, 4, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(0, 5, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(0, 6, "H", "Hydrogen", "Some information about it.", 3, 7, "question");

    addElement(1, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(2, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(3, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(4, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(5, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(6, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(7, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(8, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(9, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(10, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(11, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(12, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(13, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(14, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(15, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(16, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(17, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(18, 0, "Li", "Lithium", "Some information about it.", 3, 7, "question");
}

function initTableScene()
{
    initTableElements();

    var scale = new t.Vector3(8, 8, 8);

    if (hasElements == false)
    {
        for (var i = 0; i < elements.length; i++)
        {
            if (elements[i] != undefined)
            {
                var x = elements[i][0];
                var y = elements[i][1];
                var element = new t.Mesh(new t.CubeGeometry(scale.x, scale.y, 0), new t.MeshBasicMaterial());
                element.position.set(-80 + x + (x * 8), y + (y * 8), 290);
                element.material.color.setHex(0x444444);
                scene.add(element);
            }
        }


        hasElements = true;
    }
}

function initInfoScene()
{

}

function addElement(column, row, shortName, name, description, atomicNum, massNum, object)
{
    elements[elements.length] = [column, row, shortName, name, description, atomicNum, massNum, object];
}

function loadObject(object)
{
    // ... load ... ("objects/" + object)
}

function animate()
{
    stats.begin();

    update();
    render();

    stats.end();

    requestAnimationFrame(animate);
}

function update()
{
    var dt = clock.getDelta();
}
var hasElements = false;

function render()
{
    renderer.render(scene, camera);
}
