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

    precision mediump float;

    layout (location = 0) in vec3 position;
    layout (location = 1) in vec3 normal;

    uniform float done;
    uniform mat3 rotationMatrix;

    out vec3 vertexPosition;
    out vec3 vertexNormal;

    void main(void) {
      vertexPosition = rotationMatrix * position;
      vertexNormal = rotationMatrix * normalize(normal);
      if (done == 1.0)
        vertexPosition += 0.1 * vertexNormal;
      gl_Position = vec4(vertexPosition, 1);
    }
  `;
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSrc);
  gl.compileShader(vs);

  const fsSrc = `#version 300 es

    precision mediump float;

    uniform float done;
    uniform vec3 ambient;

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
      vec3 h = normalize(v + l);
      vec3 specular = vec3(pow(max(dot(n, h), 0.0), 100.0));
      const float intensity = 7.0;
      if (done == 1.0)
        diffuse *= vec3(1, 0, 0);
      vec3 color = 0.25 * ambient + intensity * invd * invd * (diffuse + specular);
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

  const rotationLoc = gl.getUniformLocation(program, 'rotationMatrix');
  const doneLoc = gl.getUniformLocation(program, 'done');
  const ambientLoc = gl.getUniformLocation(program, 'ambient');

  gl.enable(gl.DEPTH_TEST);

  let t = 0;
  let done = 0;
  let speed = 0;
  let acceleration = 0.0;
  let ambient = [];

  canvas.addEventListener('pointerdown', _ => {
    acceleration = 0.0005;
    if (done === 0)
      txt.textContent = 'good. keep going.';
  });
  canvas.addEventListener('pointerup', _ => { acceleration = 0; });

  let redirected = false;

  function loop() {
    const s = 0.5, st = s * t, cosst = Math.cos(st), sinst = Math.sin(st);
    const rotation = new Matrix3(
      cosst, 0, sinst,
      0, 1, 0,
      -sinst, 0, cosst
    );
    gl.uniformMatrix3fv(rotationLoc, false, rotation.data);
    gl.uniform1f(doneLoc, done);
    gl.uniform3f(ambientLoc, ambient[0], ambient[1], ambient[2]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, mesh.triangles().length, gl.UNSIGNED_INT, 0);

    t = t > 2 * Math.PI ? t - 2 * Math.PI : t + speed;
    speed = 0.998 * (speed + acceleration);

    if (done === 0) {
      ambient = [Math.pow(speed / 0.23, 4), 0, 0];
      if (speed > 0.2) {
        done = 1;
        ambient = [1, 1, 1];
        txt.innerHTML = 'well done. <span style="color: red">entering.</span>';
      }
    } else {
      ambient = [0, 0, 0];
      if (!redirected) {
        document.title = 'F̸̨̝̱̋̄͌é̷̳͇̈́r̸͓͉̰͗r̷̢̮̒͐̏ớ̷̲͚n̵͚̗̬̐̔̾ă̵̛̱̱̮͝t̵̙̐̓t̴̮̻̙̅o̶̱͋͑͠s̴̛̺̕͜C̵̲̦͒̚ó̸̫̖͂̕ŗ̶̖͊́n̵̙̈̏́ê̴͔̤̳̑̐r̸̡̭͙̃̍̂';
        let link = document.querySelector("link[rel~='icon']");
        link.href = 'assets/images/cube_after.png';
        setTimeout(() => { window.location.href = './main.html'; }, 2000);
        redirected = true;
      }
    }
    gl.clearColor(ambient[0], ambient[1], ambient[2], 1);

    window.requestAnimationFrame(loop);
  };

  loop();
}
