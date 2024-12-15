/**
 * A class for storing the shader program and buffers for rendering
 * circle-related animations
 */
class CircleShader extends ShaderProgram {

    constructor(gl) {
        super(gl); // Pass the gl context to the ShaderProgram constructor

        this.gl = gl;
        this.loadShader(); // Start loading the shader once gl is ready
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        let gl = this.gl;
        let circleShader = getShaderProgramAsync(gl, "circle");  // Assume getShaderProgramAsync fetches shader code
        let shaderObj = this;

        circleShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uTimeUniform = gl.getUniformLocation(shader, "uTime");
            shader.uRadiusUniform = gl.getUniformLocation(shader, "uRadius");
            // Extract the position buffer and store it in the shader object
            shader.positionLocation = gl.getAttribLocation(shader, "a_position");
            gl.enableVertexAttribArray(shader.positionLocation);

            shaderObj.shader = shader;  // Store the shader in the object
            shaderObj.setupBuffers();  // Setup buffers after shader is loaded
        }).catch(error => {
            console.error("Error loading shader: ", error);
        });
    }

    setupBuffers() {
        let gl = this.gl;
        let buffers = {};

        // Setup position buffers to hold a square
        buffers.positions = new Float32Array([
            -1.0,  1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0, -1.0
        ]);

        // Setup 2 triangles connecting the vertices to form a square
        buffers.indices = new Uint16Array([0, 1, 2, 1, 2, 3]);

        super.setupBuffers(buffers);  // Call parent method to store buffers

        // Setup animation variables
        this.time = 0.0;
        this.radius = 0.1;
        this.thisTime = (new Date()).getTime();
        this.lastTime = this.thisTime;
        this.render();  // Start the rendering loop
    }

    /**
     * Draw using WebGL
     */
    render() {
        let gl = this.gl;
        let shader = this.shader;
        gl.useProgram(shader);

        // Step 1: Setup uniform variables that are sent to the shaders
        this.thisTime = (new Date()).getTime();
        this.time += (this.thisTime - this.lastTime) / 1000.0;  // Update time
        this.lastTime = this.thisTime;
        gl.uniform1f(shader.uTimeUniform, this.time);
        gl.uniform1f(shader.uRadiusUniform, this.radius);

        // Step 2: Bind vertex and index buffers to draw two triangles
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        // Step 3: Keep the animation loop going
        requestAnimationFrame(this.render.bind(this));
    }
}

// Initialize the shader
new CircleShader(gl);