/**
 * webgl 3D engine
 */
pe.logger.onOff = true;

let gl, _gl, _dgl;

/** 
 * renderSpec
 * { 
 */
let renderSpec = {
    'width': 0,
    'height': 0,
    'aspect': 1,
    'array': new Float32Array(3),
    'halfWidth': 0,
    'halfHeight': 0,
    'halfArray': new Float32Array(30)
};

renderSpec.setSize = function (w, h) {
    renderSpec.width = w;
    renderSpec.height = h;
    renderSpec.aspect = renderSpec.width / renderSpec.height;
    renderSpec.array[0] = renderSpec.width;
    renderSpec.array[1] = renderSpec.height;
    renderSpec.array[2] = renderSpec.aspect;
    renderSpec.halfWidth = Math.floor(w / 2);
    renderSpec.halfHeight = Math.floor(h / 2);
    renderSpec.halfArray[0] = renderSpec.halfWidth;
    renderSpec.halfArray[1] = renderSpec.halfHeight;
    renderSpec.halfArray[2] = renderSpec.halfWidth / renderSpec.height;
}
/**
 * }
 * renderSpec
 */


/**
 * WebglDebugUtils
 * {
 */
function logGLCall (functionName, args) {
    let url = window.location.href;
    let result = url.match(/(\?debug=)(true|false)/);
    let isDebug = result && result[2] || false;
    if (isDebug) {
        console.log('gl.' + functionName + '(' + WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')')
    }
}

function throwOnGLError (err, funcName, args) {
    throw new Error(WebGLDebugUtils.glEnumToString(err) + ' was caused by call to ' + funcName + ' ' + Object.keys(args).map((i) => `"${args[i]}"`))
}
/**
 * }
 * WebglDebugUtils
 */

/**
 * canvas setting
 * {
 */
let setViewports = function () {
    renderSpec.setSize(gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);
}

let onResize = function () {
    /// TODO: ljm >>> impl
}

let makeCanvasFullScreen = function (canvas) {
    let b = document.body;
    let d = document.documentElement;
    let fullw = Math.max(b.clientWidth, b.scrollWidth, d.scrollWidth, d.clientWidth);
    let fullh = Math.max(b.clientHeight, b.scrollHeight, d.scrollHeight, d.clientHeight);
    canvas.width = fullw;
    canvas.height = fullh;
    pe.log('Canvas resolution = ' + fullw + ', ' + fullh);
}
/**
 * }
 * canvas setting
 */

/**
 * render
 * {
 */
let render = function () {
    renderScene();
}

let renderScene = function () {
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.2, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

}

/**
 * animate
 * {
 */
let timeInfo = {
    'start': 0,
    'prev': 0,
    'delta': 0,
    'elapsed': 0
};

let animating = true;

let animate = function () {
    let curDate = new Date();
    timeInfo.elapsed = (curDate - timeInfo.start) / 1000.0; // ms
    timeInfo.delta = (curDate - timeInfo.prev)  / 1000.0;   // ms
    timeInfo.prev = curDate;
    if (animating) requestAnimationFrame(animate);
    render();
}
/**
 * }
 * animate
 */

/**
 * entrance
 * {
 */
window.addEventListener('load', function (e) {
    let canvas = document.getElementById('engine-canvas');
    try {
        makeCanvasFullScreen(canvas);
        _gl = canvas.getContext('experimental-webgl');
        _dgl = WebGLDebugUtils.makeDebugContext(_gl, throwOnGLError, logGLCall);
        gl = _dgl;
    }
    catch (e) {
        pe.loge('WebGl not supported. ' + e);
        return;
    }
    window.addEventListener('resize', onResize);
    setViewports();
    animate();
});
/**
 * }
 */

(function (w, r) {
    w['r' + r] = w['r' + r] || w['webkitR' + r] || w['mozR' + r] || w['msR' + r] || w['oR' + r] || function (c) {
        w.setTimeout(c, 1000 / 60)
    }
})(window, 'equestAnimationFrame');
