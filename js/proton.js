var Proton = function() {
    this.velocity = new t.Vector3();
    this.cube = null;
    this.position = new t.Vector3();
    this.targetPosition = new t.Vector3();
    this.speed = 0.5;

    /**
     * Initalizes the proton elements
     */
    this.init = function() {
        // // Store the current position for reverting to this position upon colliding
        // var storedPositionX = controls.getObject().position.x + this.rotation.x;
        // var storedPositionY = 3;
        // var storedPositionZ = controls.getObject().position.z + this.rotation.z;

        // Add the bullets cube
        this.cube = new t.Mesh(new t.CubeGeometry(10, 10, 0), new t.MeshLambertMaterial({
            map: textureLoader.load('objects/images/0_aquaBlueT.jpg')
        }));

        // Set the bullets position
        this.cube.position.x = 0;
        this.cube.position.y = 0;
        this.cube.position.z = 0;

        this.chooseRandomTarget();
    };

    /**
     * Handles any updating the proton needs to do
     * @param  {Number} dt
     */
    this.update = function(dt) {
        if (this.position.x < this.targetPosition.x) {
            this.cube.translateX(this.speed);
        } else if (this.position.x > this.targetPosition.x) {
            this.cube.translateX(-this.speed);
        }

        if (this.position.y < this.targetPosition.y) {
            this.cube.translateY(this.speed);
        } else if (this.position.y > this.targetPosition.y) {
            this.cube.translateY(-this.speed);
        }

        // choose a new position once it meets target position
    };

    this.chooseRandomTarget = function() {
        this.targetPosition.set(Math.random() * 400 - 200, Math.random() * 400 - 200, 0);
    };
};
