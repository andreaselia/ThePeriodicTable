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

var rotationMatrix;

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

var hasElements = false;

function init() {
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

    // Create all of the elements
    var xmlrequest = new XMLHttpRequest();
    var file = "js/elements.json";

    xmlrequest.onreadystatechange = function() {
        if (xmlrequest.readyState == 4 && xmlrequest.status == 200) {
            // Parse the json data
            var jsonData = JSON.parse(xmlrequest.responseText);

            // Loop through the json data and create the elements
            for (var i = 0; i < jsonData.length; i++) {
                addElement(jsonData[i].x, jsonData[i].y, jsonData[i].symbol, jsonData[i].name, null, jsonData[i].atomicNum, jsonData[i].massNum, jsonData[i].model, jsonData[i].texture);
            }

            // Call a function to setup the scene
            initTableScene();
        }
    };

    xmlrequest.open('get', file, true);
    xmlrequest.send();

    // Start the updating and rendering
    animate();
}

function initTableScene()
{
    if (hasElements == false)
    {
        for (var i = 0; i < elements.length; i++)
        {
            if (elements[i] != undefined)
            {
                var x = elements[i][0];
                console.log("woo: " + x);
                var y = elements[i][1];
                var element = new t.Mesh(new t.CubeGeometry(scale, scale, 0), new t.MeshBasicMaterial());
                element.position.set(-(scale * 10) + x + (x * scale), -y + -(y * scale), 290);
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

function initInfoScene(elementId) {
    // load the element info on elementId
    // console.log(elements[elementId.id]);

    var element = new t.Mesh(new t.CubeGeometry(scale, scale, 0), new t.MeshBasicMaterial());
    element.position.set(-(scale * 10) + 0 + (0 * scale), -1 + (-1 * scale), 290);
    element.material.color.setHex(0x444444);
    element.name = {
        id: elementId.id,
        b: false
    };

    // Add the "element" to the scene
    scene.add(element);

    // Add the element to the objects array so we can detect when it is clicked
    objects.push(element);

    currentElementCollada = new t.ColladaLoader();
    currentElementCollada.options.convertUpAxis = true;

    //Loads current element and adds it to the scene
    currentElementCollada.load('objects/' + elements[elementId.id][7] + '.DAE', function(collada) {
        currentElementDae = collada.scene;

        // Set the position of the model
        currentElementDae.position.set(0, 0, 0);

        // Scales model
        currentElementDae.scale.set(10, 10, 10);
        currentElementDae.updateMatrix();

        // This can also be used for applying the textures
        // to the models by using "map" not "color"
        setColladaColour(currentElementDae, new t.MeshBasicMaterial({
            color: 0xFFFFFF
        }));

        scene.add(currentElementDae);
    });
}

function addElement(column, row, shortName, name, description, atomicNum, massNum, object, spawnRotation) {
    elements[elements.length] = [column, row, shortName, name, description, atomicNum, massNum, object, spawnRotation];
}

function setColladaColour(dae, material) {
    dae.material = material;

    if (dae.children) {
        for (var i = 0; i < dae.children.length; i++) {
            setColladaColour(dae.children[i], material);
        }
    }
}

function loadObject(object) {
    // load objects here
}

function rotateAroundObjectAxis(object, axis, radians) {
    rotationMatrix = new t.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);

    object.matrix.multiply(rotationMatrix);

    object.rotation.setFromRotationMatrix(object.matrix);
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

    if (currentElementDae) {
        var xAxis = new t.Vector3(1, 0, 0);
        rotateAroundObjectAxis(currentElementDae, xAxis, Math.PI / 180);
    }
}


function render() {
    renderer.render(scene, camera);
}

function onMouseDown(event) {
    event.preventDefault();

    // Get a value between 1 and -1 for the mouse position on screen
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

        if (intersects[0].object.name.b == true) {
            clearScene();
            initInfoScene(intersects[0].object.name);
        } else {
            clearScene();
            initTableScene();
        }
    }
}

function clearScene() {
    hasElements = false;
    objects = [];
    scene = new t.Scene();
}

function onWindowResize() {
    // Set the WIDTH and HEIGHT variables to the new window width/height
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    // Set the camera aspect to the new aspect
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    // Set the renderer set
    renderer.setSize(WIDTH, HEIGHT);
}
