"use strict";

const MatType = Float32Array;
const m4 = {
    /**
     * Computes a 4-by-4 orthographic projection matrix given the coordinates of the
     * planes defining the axis-aligned, box-shaped viewing volume.  The matrix
     * generated sends that box to the unit box.  Note that although left and right
     * are x coordinates and bottom and top are y coordinates, near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  We assume a unit box extending from -1 to 1 in the x and y
     * dimensions and from -1 to 1 in the z dimension.
     * @param {number} left The x coordinate of the left plane of the box.
     * @param {number} right The x coordinate of the right plane of the box.
     * @param {number} bottom The y coordinate of the bottom plane of the box.
     * @param {number} top The y coordinate of the right plane of the box.
     * @param {number} near The negative z coordinate of the near plane of the box.
     * @param {number} far The negative z coordinate of the far plane of the box.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    orthographic(left, right, bottom, top, near, far, dst) {
        dst = dst || new MatType(16);

        dst[0] = 2 / (right - left);
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = 2 / (top - bottom);
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = 0;
        dst[10] = 2 / (near - far);
        dst[11] = 0;
        dst[12] = (left + right) / (left - right);
        dst[13] = (bottom + top) / (bottom - top);
        dst[14] = (near + far) / (near - far);
        dst[15] = 1;

        return dst;
    },
    /**
     * Multiply by translation matrix.
     * @param {Matrix4} m matrix to multiply
     * @param {number} tx x translation.
     * @param {number} ty y translation.
     * @param {number} tz z translation.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    translate(m, tx, ty, tz, dst) {
        // This is the optimized version of
        // return multiply(m, translation(tx, ty, tz), dst);
        dst = dst || new MatType(16);

        var m00 = m[0];
        var m01 = m[1];
        var m02 = m[2];
        var m03 = m[3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];

        if (m !== dst) {
            dst[0] = m00;
            dst[1] = m01;
            dst[2] = m02;
            dst[3] = m03;
            dst[4] = m10;
            dst[5] = m11;
            dst[6] = m12;
            dst[7] = m13;
            dst[8] = m20;
            dst[9] = m21;
            dst[10] = m22;
            dst[11] = m23;
        }

        dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
        dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
        dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
        dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

        return dst;
    },
    /**
     * Multiply by a scaling matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} sx x scale.
     * @param {number} sy y scale.
     * @param {number} sz z scale.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    scale(m, sx, sy, sz, dst) {
        // This is the optimized version of
        // return multiply(m, scaling(sx, sy, sz), dst);
        dst = dst || new MatType(16);

        dst[0] = sx * m[0 * 4 + 0];
        dst[1] = sx * m[0 * 4 + 1];
        dst[2] = sx * m[0 * 4 + 2];
        dst[3] = sx * m[0 * 4 + 3];
        dst[4] = sy * m[1 * 4 + 0];
        dst[5] = sy * m[1 * 4 + 1];
        dst[6] = sy * m[1 * 4 + 2];
        dst[7] = sy * m[1 * 4 + 3];
        dst[8] = sz * m[2 * 4 + 0];
        dst[9] = sz * m[2 * 4 + 1];
        dst[10] = sz * m[2 * 4 + 2];
        dst[11] = sz * m[2 * 4 + 3];

        if (m !== dst) {
            dst[12] = m[12];
            dst[13] = m[13];
            dst[14] = m[14];
            dst[15] = m[15];
        }

        return dst;
    }
}

function stateReset(gl) {
    var numAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
    var tmp = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, tmp)
    for (var ii = 0; ii < numAttribs; ++ii) {
        gl.disableVertexAttribArray(ii)
        gl.vertexAttribPointer(ii, 4, gl.FLOAT, false, 0, 0)
        gl.vertexAttrib1f(ii, 0)
    }
    gl.deleteBuffer(tmp)

    var numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
    for (var ii = 0; ii < numTextureUnits; ++ii) {
        gl.activeTexture(gl.TEXTURE0 + ii)
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
        gl.bindTexture(gl.TEXTURE_2D, null)
    }

    gl.activeTexture(gl.TEXTURE0)
    gl.useProgram(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.disable(gl.BLEND)
    gl.disable(gl.CULL_FACE)
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.DITHER)
    gl.disable(gl.SCISSOR_TEST)
    gl.blendColor(0, 0, 0, 0)
    gl.blendEquation(gl.FUNC_ADD)
    gl.blendFunc(gl.ONE, gl.ZERO)
    gl.clearColor(0, 0, 0, 0)
    gl.clearDepth(1)
    gl.clearStencil(-1)
    gl.colorMask(true, true, true, true)
    gl.cullFace(gl.BACK)
    gl.depthFunc(gl.LESS)
    gl.depthMask(true)
    gl.depthRange(0, 1)
    gl.frontFace(gl.CCW)
    gl.hint(gl.GENERATE_MIPMAP_HINT, gl.DONT_CARE)
    gl.lineWidth(1)
    gl.pixelStorei(gl.PACK_ALIGNMENT, 4)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.polygonOffset(0, 0)
    gl.sampleCoverage(1, false)
    gl.scissor(0, 0, gl.canvas.width, gl.canvas.height)
    gl.stencilFunc(gl.ALWAYS, 0, 0xFFFFFFFF)
    gl.stencilMask(0xFFFFFFFF)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)

    return gl
}

function Reset(gl) {
    var cleanup = [
        'Buffer', 'Framebuffer', 'Renderbuffer', 'Program', 'Shader', 'Texture'
    ].map(function (suffix) {
        var remove = 'delete' + suffix
        var create = 'create' + suffix
        var original = gl[create]
        var handles = []

        gl[create] = function () {
            var handle = original.apply(this, arguments)
            handles.push(handle)
            return handle
        }

        return {
            remove: remove,
            handles: handles
        }
    })

    return function reset() {
        cleanup.forEach(function (kind) {
            for (var i = 0; i < kind.handles.length; i++) {
                gl[kind.remove].call(gl, kind.handles[i])
            }
        })

        stateReset(gl)

        return gl
    }
}

const first_scene = {
    /**
     * Create a program object and make current
     * @param gl GL context
     * @param vshader a vertex shader program (string)
     * @param fshader a fragment shader program (string)
     * @return true, if the program object was created and successfully made current 
     */
    initShaders(gl, vshader, fshader) {
        var program = this.createProgram(gl, vshader, fshader);
        if (!program) {
            console.log('Failed to create program');
            return false;
        }

        gl.useProgram(program);
        gl.program = program;

        return true;
    },

    /**
     * Create the linked program object
     * @param gl GL context
     * @param vshader a vertex shader program (string)
     * @param fshader a fragment shader program (string)
     * @return created program object, or null if the creation has failed
     */
    createProgram(gl, vshader, fshader) {
        // Create shader object
        var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vshader);
        var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        // Create a program object
        var program = gl.createProgram();
        if (!program) {
            return null;
        }

        // Attach the shader objects
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // Link the program object
        gl.linkProgram(program);

        // Check the result of linking
        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            var error = gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            gl.deleteProgram(program);
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            return null;
        }
        return program;
    },

    /**
     * Create a shader object
     * @param gl GL context
     * @param type the type of the shader object to be created
     * @param source shader program (string)
     * @return created shader object, or null if the creation has failed.
     */
    loadShader(gl, type, source) {
        // Create shader object
        var shader = gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }

        // Set the shader program
        gl.shaderSource(shader, source);

        // Compile the shader
        gl.compileShader(shader);

        // Check the result of compilation
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            var error = gl.getShaderInfoLog(shader);
            console.log('Failed to compile shader: ' + error);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    },

    initVertexBuffers(gl) {
        // Vertex coordinates, texture coordinate
        var verticesTexCoords = new Float32Array([
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ]);
        // Create the buffer object
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

        // Put texcoords in the buffer
        var texcoords = new Float32Array([
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ]);
        // Create a buffer for texture coords
        let texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);

        // Setup the attributes to pull data from our buffers
        var positionLocation = gl.getAttribLocation(gl.program, "a_position");
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        var texcoordLocation = gl.getAttribLocation(gl.program, "a_texcoord");
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        return 6;
    },

    init() {
        // Vertex shader program
        const VSHADER_SOURCE = `
            attribute vec4 a_position;
            attribute vec2 a_texcoord;
            uniform mat4 u_matrix;
            varying vec2 v_texcoord;
            void main() {
                gl_Position = u_matrix * a_position;
                v_texcoord = a_texcoord;
            }`;
        // Fragment shader program
        const FSHADER_SOURCE = `
            precision mediump float;
            varying vec2 v_texcoord;
            uniform sampler2D u_texture;
            void main() {
                gl_FragColor = texture2D(u_texture, v_texcoord);
            }`;
        // Get the rendering context for WebGL
        // var gl = getWebGLContext(canvas);
        const canvas = wx.__first__canvas = wx.createCanvas();
        const gl = this.gl = canvas.getContext('webgl', {
            stencil: true,
            antialias: false,
            alpha: false,
            preserveDrawingBuffer: false,
            depth: true
        });
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        this.reset = Reset(gl);

        // Initialize shaders
        if (!this.initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Failed to intialize shaders.');
            return;
        }

        // Set the vertex information
        var n = this.initVertexBuffers(gl);
        if (n < 0) {
            console.log('Failed to set the vertex information');
            return;
        }
    },

    loadImage(imgPath, callback) {
        // Create the image object
        var image = this.image = wx.createImage();
        if (!image) {
            console.log('Failed to create the image object');
            return false;
        }
        // Register the event handler to be called on loading an image
        var thiz = this;
        image.onload = function () {
            const gl = thiz.gl;
            const texture = thiz.texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

            callback && callback();
        };
        // Tell the browser to load an image
        image.src = imgPath;
    },

    render() {
        if (!this.gl) return false;
        if (!this.texture) return true;
        const gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var canvasW = gl.canvas.width;
        var canvasH = gl.canvas.height;
        var imageW = this.image.width * 0.8;
        var imageH = this.image.height * 0.8;
        var textureLocation = gl.getUniformLocation(gl.program, 'u_texture');
        var matrixLocation = gl.getUniformLocation(gl.program, "u_matrix");
        var matrix = m4.orthographic(0, canvasW, canvasH, 0, -1, 1);
        matrix = m4.translate(matrix, (canvasW - imageW) * 0.5, (canvasH - imageH) * 0.25, 0);
        matrix = m4.scale(matrix, imageW, imageH, 1);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
        gl.uniform1i(textureLocation, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

        return true;
    },

    destroy() {
        if (!this.gl) {
            return;
        }
        this.image && (this.image.src = '');
        this.image = null;
        this.texture = null;
        this.reset && this.reset();
        this.reset = null;
        this.gl = null;
    },
}

module.exports = first_scene;