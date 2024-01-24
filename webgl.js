const sleep = ms => new Promise(r => setTimeout(r, ms));

main();

async function main() {
  const canvas = document.querySelector('#glcanvas');

  const gl = canvas.getContext('webgl2');

  if (gl === null) {
    alert('Unable to use WebGL.');
    return;
  }

  function setCanvasSize() {
    var minDimension = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = 0.8 * minDimension;
    canvas.height = 0.8 * minDimension;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);

  const vsSrc = `#version 300 es

    layout (location = 0) in vec3 position;
    layout (location = 1) in vec3 normal;
    layout (location = 2) in float shade;

    uniform float t;

    out vec3 vertexPosition;
    out vec3 vertexNormal;
    flat out float shadeVertex;

    void main(void) {
      if (shade == 1.0) {
        const float s = 0.5;
        mat3 yRotationMatrix = mat3( cos(s * t), 0, sin(s * t),
                                          0,     1,     0,
                                    -sin(s * t), 0, cos(s * t));
        vertexPosition = yRotationMatrix * position;
        vertexNormal = yRotationMatrix * normalize(normal);
      } else {
        vertexPosition = position;
        vertexNormal = normalize(normal);
      }
      shadeVertex = shade;
      gl_Position = vec4(vertexPosition, 1);
    }
  `;
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSrc);
  gl.compileShader(vs);

  const fsSrc = `#version 300 es

    precision mediump float;

    in vec3 vertexPosition;
    in vec3 vertexNormal;
    flat in float shadeVertex;

    out vec4 fragColor;

    void main(void) {
      if (shadeVertex == 1.0) {
        const vec3 lightPos = vec3(1, 3, -1);
        vec3 l = lightPos - vertexPosition;
        float invd = 1.0 / length(l);
        l *= invd;
        vec3 n = normalize(vertexNormal);
        float d = 0.5 + 0.5 * dot(l, n);
        vec3 diffuse = vec3(d * d);
        vec3 v = normalize(vec3(0, 0, -1) - vertexPosition);
        vec3 r = normalize(2.0 * dot(n, l) * n - l);
        vec3 specular = vec3(pow(max(dot(v, r), 0.0), 100.0));
        const float intensity = 7.0;
        vec3 color = intensity * invd * invd * (diffuse + specular);
        fragColor = vec4(color, 1);
      } else {
        vec3 color = vec3(0.075 / distance(vertexPosition, vec3(0, 0, 1)));
        fragColor = vec4(color, 1);
      }
    }
  `;
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSrc);
  gl.compileShader(fs);

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  const posVbo = gl.createBuffer();
  const vertPosBuf = new ArrayBuffer(10 * 9 * Float32Array.BYTES_PER_ELEMENT);
  const vertPosArray = new Float32Array(vertPosBuf);
  vertPosArray.set([
    0, 0, 0.5,
    0.5, 0, 0,
    0, 0.5, 0,

    0.5, 0, 0,
    0, 0, -0.5,
    0, 0.5, 0,

    0, 0, -0.5,
    -0.5, 0, 0,
    0, 0.5, 0,

    -0.5, 0, 0,
    0, 0, 0.5,
    0, 0.5, 0,

    0, -0.5, 0,
    0.5, 0, 0,
    0, 0, 0.5,

    0, -0.5, 0,
    0, 0, -0.5,
    0.5, 0, 0,

    0, -0.5, 0,
    -0.5, 0, 0,
    0, 0, -0.5,

    0, -0.5, 0,
    0, 0, 0.5,
    -0.5, 0, 0,

    // background quad
    -1, -1, 0.9,
    1, -1, 0.9,
    1, 1, 0.9,

    -1, -1, 0.9,
    1, 1, 0.9,
    -1, 1, 0.9
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, posVbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertPosArray, gl.STATIC_DRAW, 0);

  const normalVbo = gl.createBuffer();
  const vertNormalBuf = new ArrayBuffer(10 * 9 * Float32Array.BYTES_PER_ELEMENT);
  const vertNormalArray = new Float32Array(vertNormalBuf);
  vertNormalArray.set([
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,

    1, 1, -1,
    1, 1, -1,
    1, 1, -1,

    -1, 1, -1,
    -1, 1, -1,
    -1, 1, -1,

    -1, 1, 1,
    -1, 1, 1,
    -1, 1, 1,

    1, -1, 1,
    1, -1, 1,
    1, -1, 1,

    1, -1, -1,
    1, -1, -1,
    1, -1, -1,

    -1, -1, -1,
    -1, -1, -1,
    -1, -1, -1,

    -1, -1, 1,
    -1, -1, 1,
    -1, -1, 1,

    // background quad
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalVbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertNormalArray, gl.STATIC_DRAW, 0);

  const shadeVbo = gl.createBuffer();
  const shadeBuf = new ArrayBuffer(10 * 3 * Float32Array.BYTES_PER_ELEMENT);
  const shadeArray = new Float32Array(shadeBuf);
  shadeArray.set([
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,
    1, 1, 1,

    // background quad
    0, 0, 0,
    0, 0, 0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, shadeVbo);
  gl.bufferData(gl.ARRAY_BUFFER, shadeArray, gl.STATIC_DRAW, 0);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, posVbo);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalVbo);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, shadeVbo);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);

  // const varyings = ['vertexPosition'];
  // gl.transformFeedbackVaryings(program, varyings, gl.INTERLEAVED_ATTRIBS);

  // let tbo = gl.createBuffer();
  // gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, tbo);
  // gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, vertPosArray.length * Float32Array.BYTES_PER_ELEMENT, gl.DYNAMIC_READ);
  // gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, tbo);

  gl.linkProgram(program);
  gl.useProgram(program);

  gl.clearColor(1, 0, 0, 1);

  const tLoc = gl.getUniformLocation(program, 't');

  // const txt = document.querySelector('#txt');

  gl.enable(gl.DEPTH_TEST);

  let t = 0;
  function loop() {
    gl.uniform1f(tLoc, t);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // gl.beginTransformFeedback(gl.TRIANGLES);

    gl.drawArrays(gl.TRIANGLES, 0, 30);

    // gl.endTransformFeedback();

    // gl.flush();

    // let asdf = new ArrayBuffer(10 * 9 * Float32Array.BYTES_PER_ELEMENT);
    // let tfBuf = new Float32Array(asdf);
    // gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, tfBuf);

    // txt.innerHTML = '';
    // for (let i = 0; i < 8 * 3; ++i) {
    //   txt.innerHTML += '(&nbsp&nbsp&nbsp&nbsp';
    //   for (let j = 0; j < 3; ++j)
    //     txt.innerHTML += `${tfBuf[3 * i + j]}&nbsp&nbsp&nbsp&nbsp`;
    //   txt.innerHTML += ')<br/>';
    // }

    t = t > 2 * Math.PI ? t - 2 * Math.PI : t + 0.025;

    window.requestAnimationFrame(loop);
  };

  loop();
}
