/**
 * Some utility functions for loading shaders asynchronously, as well
 * as a skeleton parent class for simple shader program and buffer
 * management in Javascript
 */

function splitVecStr(s) {
    ret = [];
    s.split(",").forEach(function(x) {
        ret.push(parseFloat(x));
    });
    return ret;
}

function vecToStr(v, k) {
    if (k === undefined) {
        k = 2;
    }
    s = "";
    for (let i = 0; i < v.length; i++) {
        s += v[i].toFixed(k);
        if (i < v.length-1) {
            s += ",";
        }
    }
    return s;
}

    
getMousePos = function(evt) {
    if ('touches' in evt) {
        return {
            X: evt.touches[0].clientX,
            Y: evt.touches[1].clientY
        }
    }
    return {
        X: evt.clientX,
        Y: evt.clientY
    };
}

/**
 * A function that compiles a particular shader
 * @param {object} gl WebGL handle
 * @param {string} shadersrc A string holding the GLSL source code for the shader
 * @param {string} type The type of shader ("fragment" or "vertex") 
 * 
 * @returns{shader} Shader object
 */
function getShader(gl, shadersrc, type) {
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } 
    else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } 
    else {
        return null;
    }
    
    gl.shaderSource(shader, shadersrc);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Unable to compile " + type + " shader...")
        console.log(shadersrc);
        console.log(gl.getShaderInfoLog(shader));
        alert("Could not compile shader");
        return null;
    }
    return shader;
}


/**
 * Compile a vertex shader and a fragment shader and link them together
 * 
 * @param {object} gl WebGL Handle
 * @param {string} prefix Prefix for naming the shader
 * @param {string} vertexSrc A string holding the GLSL source code for the vertex shader
 * @param {string} fragmentSrc A string holding the GLSL source code for the fragment shader
 */
function getShaderProgram(gl, prefix, vertexSrc, fragmentSrc) {
    let vertexShader = getShader(gl, vertexSrc, "vertex");
    let fragmentShader = getShader(gl, fragmentSrc, "fragment");
    let shader = gl.createProgram();
    gl.attachShader(shader, vertexShader);
    gl.attachShader(shader, fragmentShader);
    gl.linkProgram(shader);
    if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
        reject(Error("Could not initialize shader" + prefix));
    }
    shader.name = prefix;
    return shader;
}

/**
 * Load in and compile a vertex/fragment shader pair asynchronously
 * 
 * @param {object} gl WebGL Handle
 * @param {string} prefix File prefix for shader.  It is expected that there
 * will be both a vertex shader named prefix.vert and a fragment
 * shader named prefix.frag
 * 
 * @returns{Promise} A promise that resolves to a shader program, where the 
 * vertex/fragment shaders are compiled/linked together
 */
function getShaderProgramAsync(gl, prefix) {
    return new Promise((resolve, reject) => {
        $.get(prefix + ".vert", function(vertexSrc) {
            $.get(prefix + ".frag", function(fragmentSrc) {
                resolve(getShaderProgram(gl, prefix, vertexSrc, fragmentSrc));
            });
        });
    });
}


class ShaderProgram {
    constructor() {
        let glcanvas = document.getElementById("circleCanvas");
        glcanvas.addEventListener("contextmenu", function(e){ e.stopPropagation(); e.preventDefault(); return false; }); //Need this to disable the menu that pops up on right clicking
        
        try {
            glcanvas.gl = glcanvas.getContext("webgl");
            glcanvas.gl.viewportWidth = glcanvas.width;
            glcanvas.gl.viewportHeight = glcanvas.height;
            this.glcanvas = glcanvas;
            this.loadShader();
        } catch (e) {
            alert("WebGL Error");
            console.log(e);
        }
    }

    /** Skeleton method which should be overridden */
    loadShader() {

    }

    setupBuffers(buffers) {
        let gl = this.glcanvas.gl;
        // Setup position and color buffers
        if ('positions' in buffers) {
            this.positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, buffers.positions, gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        }
        if ('colors' in buffers) {
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, buffers.colors, gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.shader.colorLocation, 3, gl.FLOAT, false, 0, 0);
        }
        if ('textureCoords' in buffers) {
            this.textureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, buffers.textureCoords, gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.shader.textureLocation, 2, gl.FLOAT, false, 0, 0);
        }
        if ('indices' in buffers) {
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buffers.indices, gl.STATIC_DRAW);
            this.indexBuffer.itemSize = 1;
            this.indexBuffer.numItems = buffers.indices.length;
        }
    }

    /**
     * Setup functions to handle mouse events.  These may or may not
     * be used in individual shaders, but their behavior is shared across
     * many different types of shaders, so they should be available
     */
    setupMouseHandlers() {
        this.dragging = false;
        this.justClicked = false;
        this.clickType = "LEFT";
        this.lastX = 0;
        this.lastY = 0;
        let glcanvas = this.glcanvas;
    
        glcanvas.addEventListener('mousedown', this.makeClick.bind(this));
        glcanvas.addEventListener('mouseup', this.releaseClick.bind(this));
        glcanvas.addEventListener('mousemove', this.clickerDragged.bind(this));
        glcanvas.addEventListener('mouseout', this.mouseOut.bind(this));
    
        //Support for mobile devices
        glcanvas.addEventListener('touchstart', this.makeClick.bind(this));
        glcanvas.addEventListener('touchend', this.releaseClick.bind(this));
        glcanvas.addEventListener('touchmove', this.clickerDragged.bind(this));
    }
    releaseClick(evt) {
        evt.preventDefault();
        this.dragging = false;
        this.render();
        return false;
    } 
    mouseOut() {
        this.dragging = false;
        this.render();
        return false;
    }
    makeClick(e) {
        let evt = (e == null ? event:e);
        this.clickType = "LEFT";
        evt.preventDefault();
        if (evt.which) {
            if (evt.which == 3) this.clickType = "RIGHT";
            if (evt.which == 2) this.clickType = "MIDDLE";
        }
        else if (evt.button) {
            if (evt.button == 2) this.clickType = "RIGHT";
            if (evt.button == 4) this.clickType = "MIDDLE";
        }
        this.dragging = true;
        this.justClicked = true;
        let mousePos = getMousePos(evt);
        this.lastX = mousePos.X;
        this.lastY = mousePos.Y;
        this.render();
        return false;
    } 
    clickerDragged(evt) {
        evt.preventDefault();
        return false;
    }

    /**
     * Update the center/scale based on a drag event
     * This assumes that scale, center, and centervec have all
     * been defined
     * @param {MouseEvent} evt 
     */
    clickerDraggedCenterScale(evt) {
        let glcanvas = this.glcanvas;
        let mousePos = getMousePos(evt);
        let X = mousePos.X;
        let Y = mousePos.Y;
        let dX = X - this.lastX;
        let dY = Y - this.lastY;
        this.lastX = X;
        this.lastY = Y;
        if (this.dragging) {
            if (this.clickType == "RIGHT") { //Right click
                this.scale *= Math.pow(1.01, dY); //Want to zoom in as the mouse goes up
            }
            else if (this.clickType == "LEFT") {
                this.centervec[0] += 2.0*dX/glcanvas.width*this.scale;
                this.centervec[1] -= 2.0*dY/glcanvas.height*this.scale;
            }
            this.center = vecToStr(this.centervec);
            this.render();
        }
    }


}