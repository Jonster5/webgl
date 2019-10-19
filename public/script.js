const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
if (!gl) throw new Error('webGL not good');

function readF(file, cb) {
    var f = new XMLHttpRequest();
    f.open("GET", file, false);
    f.onreadystatechange = function() {
        if (f.readyState === 4) {
            if (f.status === 200 || f.status == 0) {
                let res = f.responseText;
                cb(res);
            }
        }
    }
    f.send(null);
}

let VS;
let FS;
readF('shaders/vertexShader.txt', (res) => { VS = res; });
readF('shaders/fragmentShader.txt', (res) => { FS = res; });

function randColor() {
    return [Math.random(), Math.random(), Math.random()];
}

let vertexData = [
    0, 0.707, 0, //vert1
    1, -1, 0, //vert2
    -1, -1, 0 //vert3
];

let colorData = [
    ...randColor(),
    ...randColor(),
    ...randColor()
];

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

let colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

let vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, VS);
gl.compileShader(vertexShader);

let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, FS);
gl.compileShader(fragmentShader);

let program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

let positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

let colorLocation = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix'),
};

let matrix = mat4.create();


mat4.translate(matrix, matrix, [0, 0, 0]);
mat4.scale(matrix, matrix, [0.25, 0.25, 0.25]);

function animate() {
    requestAnimationFrame(animate);
    mat4.rotateY(matrix, matrix, 1 * Math.PI / 180);
    mat4.rotateX(matrix, matrix, 1 * Math.PI / 180);
    mat4.rotateZ(matrix, matrix, 1 * Math.PI / 180);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

animate();