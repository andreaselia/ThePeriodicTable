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

//Stores current element Collada and Dae file
var currentElementCollada;
var currentElementDae;

var loader = new t.ObjectLoader();

// Periodic table elements and information
var elements = [];

// Elements added to here for their collisions
var objects = [];

var raycaster;

var mouse = {
    x: 0,
    y: 0
};

var scale = 8;

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
    renderer.setClearColor(0xB0D2D3);

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

    raycaster = new t.Raycaster();

    // Handled mouse clicking on elements
    document.addEventListener('mousedown', onMouseDown, false);

    // Handles the browser being resized
    window.addEventListener('resize', onWindowResize, false);

    // Call a function to setup the scene
    initTableScene();

    // Start the updating and rendering
    animate();
}

function initTableElements()
{
    // column (x) -> row (y) -> shortname -> name -> description -> atomic number -> mass number -> object file name
    // the Y positiosn are in reverse

    // All has to be in reverse... for now?
    // First Column
    addElement(0, 0, "Fr", "Francium", "Some information about it.", 1, 1, "question");
    addElement(0, 1, "Cs", "Caesium", "Some information about it.", 3, 7, "question");
    addElement(0, 2, "Rb", "Rubidium", "Some information about it.", 3, 7, "question");
    addElement(0, 3, "K", "Potassium", "Some information about it.", 3, 7, "question");
    addElement(0, 4, "Na", "Sodium", "Some information about it.", 3, 7, "question");
    addElement(0, 5, "Li", "Lithium", "Some information about it.", 3, 7, "question");
    addElement(0, 6, "H", "Hydrogen", "Some information about it.", 3, 7, "question");
}

function initTableScene()
{
    initTableElements();

    if (hasElements == false)
    {
        for (var i = 0; i < elements.length; i++)
        {
            if (elements[i] != undefined)
            {
                var x = elements[i][0];
                var y = elements[i][1];
                var element = new t.Mesh(new t.CubeGeometry(scale, scale, 0), new t.MeshBasicMaterial());
                element.position.set(-(scale * 10) + x + (x * scale), y + (y * scale), 290);
                element.material.color.setHex(0xFFFFFF);
                element.name = {
                    id: i,
                    b: true
                };

                // Add the "element" to the scene
                scene.add(element);

                // Add the element to the objects array so we can detect when it is clicked
                objects.push(element);
            }
        }


        hasElements = true;
    }
}

function initInfoScene(elementId)
{
    // load the element info on elementId
    console.log(elements[elementId.id]);

    var element = new t.Mesh(new t.CubeGeometry(scale, scale, 0), new t.MeshBasicMaterial());
    element.position.set(-(scale * 10) + 0 + (0 * scale), 0 + (0 * scale), 290);
    element.material.color.setHex(0x444444);
    element.name = {
        id: elementId.id,
        b: false
    };

    // Add the "element" to the scene
    scene.add(element);

    // Add the element to the objects array so we can detect when it is clicked
    objects.push(element);
	
	currentElementCollada = new THREE.ColladaLoader();
	currentElementCollada.options.convertUpAxis = true;
	
	//Loads current element and adds it to the scene
	//Error: XMLHttpRequest cannot load
	currentElementCollada.load('current.dae', function(collada)
	{
		currentElementDae = collada.scene;
		
		currentElementDae.position.x = 0;
		currentElementDae.position.y = 0;
		currentElementDae.position.z = 0;
		
		//Scales model
		currentElementDae.scale.x = currentElementDae.scale.y = currentElementDae.scale.z = 1;
		currentElementDae.updateMatrix();
		
		scene.add(currentElementDae);
	} );
}

function addElement(column, row, shortName, name, description, atomicNum, massNum, object)
{
    elements[elements.length] = [column, row, shortName, name, description, atomicNum, massNum, object];
}

function loadObject(object)
{
    // load objects here
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

function onMouseDown(event)
{
    event.preventDefault();

    // Get a value between 1 and -1 for the mouse position on screen
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0)
    {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

        if (intersects[0].object.name.b == true)
        {
            clearScene();
            initInfoScene(intersects[0].object.name);
        }
        else
        {
            clearScene();
            initTableScene();
        }
    }
}

function clearScene()
{
    objects = [];
    scene = new t.Scene();
}

function onWindowResize()
{
    // Set the WIDTH and HEIGHT variables to the new window width/height
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    // Set the camera aspect to the new aspect
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    // Set the renderer set
    renderer.setSize(WIDTH, HEIGHT);
}
