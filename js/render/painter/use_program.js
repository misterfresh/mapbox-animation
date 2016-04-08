'use strict';

var assert = require('assert');
var util = require('../../util/util');

// readFileSync calls must be written out long-form for brfs.
var definitions = {
    debug: {
        fragmentSource: require('raw!shaders/debug.fragment.glsl'),
        vertexSource: require('raw!shaders/debug.vertex.glsl')
    },
    fill: {
        fragmentSource: require('raw!shaders/fill.fragment.glsl'),
        vertexSource: require('raw!shaders/fill.vertex.glsl')
    },
    circle: {
        fragmentSource: require('raw!shaders/circle.fragment.glsl'),
        vertexSource: require('raw!shaders/circle.vertex.glsl')
    },
    line: {
        fragmentSource: require('raw!shaders/line.fragment.glsl'),
        vertexSource: require('raw!shaders/line.vertex.glsl')
    },
    linepattern: {
        fragmentSource: require('raw!shaders/linepattern.fragment.glsl'),
        vertexSource: require('raw!shaders/linepattern.vertex.glsl')
    },
    linesdfpattern: {
        fragmentSource: require('raw!shaders/linesdfpattern.fragment.glsl'),
        vertexSource: require('raw!shaders/linesdfpattern.vertex.glsl')
    },
    outline: {
        fragmentSource: require('raw!shaders/outline.fragment.glsl'),
        vertexSource: require('raw!shaders/outline.vertex.glsl')
    },
    outlinepattern: {
        fragmentSource: require('raw!shaders/outlinepattern.fragment.glsl'),
        vertexSource: require('raw!shaders/outlinepattern.vertex.glsl')
    },
    pattern: {
        fragmentSource: require('raw!shaders/pattern.fragment.glsl'),
        vertexSource: require('raw!shaders/pattern.vertex.glsl')
    },
    raster: {
        fragmentSource: require('raw!shaders/raster.fragment.glsl'),
        vertexSource: require('raw!shaders/raster.vertex.glsl')
    },
    icon: {
        fragmentSource: require('raw!shaders/icon.fragment.glsl'),
        vertexSource: require('raw!shaders/icon.vertex.glsl')
    },
    sdf: {
        fragmentSource: require('raw!shaders/sdf.fragment.glsl'),
        vertexSource: require('raw!shaders/sdf.vertex.glsl')
    },
    collisionbox: {
        fragmentSource: require('raw!shaders/collisionbox.fragment.glsl'),
        vertexSource: require('raw!shaders/collisionbox.vertex.glsl')
    }
};

module.exports._createProgram = function(name) {
    var gl = this.gl;
    var program = gl.createProgram();
    var definition = definitions[name];

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, definition.fragmentSource);
    gl.compileShader(fragmentShader);
    assert(gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS), gl.getShaderInfoLog(fragmentShader));
    gl.attachShader(program, fragmentShader);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, definition.vertexSource);
    gl.compileShader(vertexShader);
    assert(gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS), gl.getShaderInfoLog(vertexShader));
    gl.attachShader(program, vertexShader);

    gl.linkProgram(program);
    assert(gl.getProgramParameter(program, gl.LINK_STATUS), gl.getProgramInfoLog(program));

    var attributes = {};
    var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < numAttributes; i++) {
        var attribute = gl.getActiveAttrib(program, i);
        attributes[attribute.name] = i;
    }

    var uniforms = {};
    var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var ui = 0; ui < numUniforms; ui++) {
        var uniform = gl.getActiveUniform(program, ui);
        uniforms[uniform.name] = gl.getUniformLocation(program, uniform.name);
    }

    return util.extend({
        program: program,
        definition: definition,
        attributes: attributes,
        numAttributes: numAttributes
    }, attributes, uniforms);
};

module.exports._createProgramCached = function(name) {
    this.cache = this.cache || {};
    if (!this.cache[name]) {
        this.cache[name] = this._createProgram(name);
    }
    return this.cache[name];
};

module.exports.useProgram = function (nextProgramName, posMatrix, exMatrix) {
    var gl = this.gl;

    var nextProgram = this._createProgramCached(nextProgramName);
    var previousProgram = this.currentProgram;

    if (previousProgram !== nextProgram) {
        gl.useProgram(nextProgram.program);

        var numNextAttributes = nextProgram.numAttributes;
        var numPrevAttributes = previousProgram ? previousProgram.numAttributes : 0;
        var i;

        // Disable all attributes from the previous program that aren't used in
        // the new program. Note: attribute indices are *not* program specific!
        // WebGL breaks if you disable attribute 0. http://stackoverflow.com/questions/20305231
        for (i = Math.max(1, numNextAttributes); i < numPrevAttributes; i++) {
            gl.disableVertexAttribArray(i);
        }
        // Enable all attributes for the new program.
        for (i = numPrevAttributes; i < numNextAttributes; i++) {
            gl.enableVertexAttribArray(i);
        }

        this.currentProgram = nextProgram;
    }

    if (posMatrix !== undefined) this.setPosMatrix(posMatrix);
    if (exMatrix !== undefined) this.setExMatrix(exMatrix);

    return nextProgram;
};
