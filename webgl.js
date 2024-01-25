main();

function main() {
  const canvas = document.querySelector('#glcanvas');
  const txt = document.querySelector('#txt');

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

    uniform float done;
    uniform float t;

    out vec3 vertexPosition;
    out vec3 vertexNormal;

    void main(void) {
      const float s = 0.5;
      mat3 yRotationMatrix = mat3( cos(s * t), 0, sin(s * t),
                                        0,     1,     0,
                                  -sin(s * t), 0, cos(s * t));
      vertexPosition = yRotationMatrix * position;
      vertexNormal = yRotationMatrix * normalize(normal);
      if (done == 0.0)
        gl_Position = vec4(vertexPosition, 1);
      else
        gl_Position = vec4(vertexPosition + 0.1 * vertexNormal, 1);
    }
  `;
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSrc);
  gl.compileShader(vs);

  const fsSrc = `#version 300 es

    precision highp float;

    uniform float done;

    in vec3 vertexPosition;
    in vec3 vertexNormal;
    flat in float shadeVertex;

    out vec4 fragColor;

    void main(void) {
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
      if (done == 1.0)
        color *= vec3(1, 0, 0);
      fragColor = vec4(color, 1);
    }
  `;
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSrc);
  gl.compileShader(fs);

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  let mesh = new TriangleMesh();

  mesh.addVertex(0, 0, 0.5);
  mesh.addVertex(0.5, 0, 0);
  mesh.addVertex(0, 0.5, 0);
  mesh.addVertex(0.5, 0, 0);
  mesh.addVertex(0, 0, -0.5);
  mesh.addVertex(0, 0.5, 0);
  mesh.addVertex(0, 0, -0.5);
  mesh.addVertex(-0.5, 0, 0);
  mesh.addVertex(0, 0.5, 0);
  mesh.addVertex(-0.5, 0, 0);
  mesh.addVertex(0, 0, 0.5);
  mesh.addVertex(0, 0.5, 0);
  mesh.addVertex(0, -0.5, 0);
  mesh.addVertex(0.5, 0, 0);
  mesh.addVertex(0, 0, 0.5);
  mesh.addVertex(0, -0.5, 0);
  mesh.addVertex(0, 0, -0.5);
  mesh.addVertex(0.5, 0, 0);
  mesh.addVertex(0, -0.5, 0);
  mesh.addVertex(-0.5, 0, 0);
  mesh.addVertex(0, 0, -0.5);
  mesh.addVertex(0, -0.5, 0);
  mesh.addVertex(0, 0, 0.5);
  mesh.addVertex(-0.5, 0, 0);

  mesh.addNormal(1, 1, 1);
  mesh.addNormal(1, 1, 1);
  mesh.addNormal(1, 1, 1);
  mesh.addNormal(1, 1, -1);
  mesh.addNormal(1, 1, -1);
  mesh.addNormal(1, 1, -1);
  mesh.addNormal(-1, 1, -1);
  mesh.addNormal(-1, 1, -1);
  mesh.addNormal(-1, 1, -1);
  mesh.addNormal(-1, 1, 1);
  mesh.addNormal(-1, 1, 1);
  mesh.addNormal(-1, 1, 1);
  mesh.addNormal(1, -1, 1);
  mesh.addNormal(1, -1, 1);
  mesh.addNormal(1, -1, 1);
  mesh.addNormal(1, -1, -1);
  mesh.addNormal(1, -1, -1);
  mesh.addNormal(1, -1, -1);
  mesh.addNormal(-1, -1, -1);
  mesh.addNormal(-1, -1, -1);
  mesh.addNormal(-1, -1, -1);
  mesh.addNormal(-1, -1, 1);
  mesh.addNormal(-1, -1, 1);
  mesh.addNormal(-1, -1, 1);

  mesh.addTriangle(0, 1, 2);
  mesh.addTriangle(3, 4, 5);
  mesh.addTriangle(6, 7, 8);
  mesh.addTriangle(9, 10, 11);
  mesh.addTriangle(12, 13, 14);
  mesh.addTriangle(15, 16, 17);
  mesh.addTriangle(18, 19, 20);
  mesh.addTriangle(21, 22, 23);

  const posVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posVbo);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices(), gl.STATIC_DRAW, 0);

  const normalVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalVbo);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.normals(), gl.STATIC_DRAW, 0);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, posVbo);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalVbo);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
  const eab = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eab);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.triangles(), gl.STATIC_DRAW);

  let bah = new Camera(1, 1, 0.01, 100);

  console.log(bah.perspective);

  gl.linkProgram(program);
  gl.useProgram(program);

  gl.clearColor(0, 0, 0, 1);

  const tLoc = gl.getUniformLocation(program, 't');
  const doneLoc = gl.getUniformLocation(program, 'done');

  gl.enable(gl.DEPTH_TEST);

  let t = 0;
  let done = 0;
  let speed = 0;
  let acceleration = 0.0;

  canvas.addEventListener('pointerdown', _ => {
    acceleration = 0.0005;
    if (done === 0)
      txt.textContent = 'good. keep going.';
  });
  canvas.addEventListener('pointerup', _ => { acceleration = 0; });

  function loop() {
    gl.uniform1f(tLoc, t);
    gl.uniform1f(doneLoc, done);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, mesh.triangles().length, gl.UNSIGNED_INT, 0);

    t = t > 2 * Math.PI ? t - 2 * Math.PI : t + speed;
    speed += acceleration;

    speed *= 0.998;
    speed = Math.max(speed, 0.01);

    if (done === 0) {
      gl.clearColor(Math.pow(speed / 0.25, 4), 0, 0, 1);
      if (speed > 0.245) {
        done = 1;
        gl.clearColor(1, 1, 1, 1);
        txt.textContent = 'interesting.';
      }
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    window.requestAnimationFrame(loop);
  };

  loop();
}
