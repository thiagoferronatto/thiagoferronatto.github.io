class TriangleMesh {
  constructor() {
    this._vertices = [];
    this._normals = [];
    this._triangles = [];
  }

  addVertex(x, y, z) {
    this._vertices.push(x);
    this._vertices.push(y);
    this._vertices.push(z);
  }

  addNormal(x, y, z) {
    this._normals.push(x);
    this._normals.push(y);
    this._normals.push(z);
  }

  addTriangle(v0, v1, v2) {
    this._triangles.push(v0);
    this._triangles.push(v1);
    this._triangles.push(v2);
  }

  vertices() {
    const verticesBuffer = new ArrayBuffer(
      3 * this._vertices.length * Float32Array.BYTES_PER_ELEMENT);
    const verticesArray = new Float32Array(verticesBuffer);
    verticesArray.set(this._vertices);
    return verticesArray;
  }

  normals() {
    const normalsBuffer = new ArrayBuffer(
      3 * this._normals.length * Float32Array.BYTES_PER_ELEMENT);
    const normalsArray = new Float32Array(normalsBuffer);
    normalsArray.set(this._normals);
    return normalsArray;
  }

  triangles() {
    const trianglesBuffer = new ArrayBuffer(
      3 * this._triangles.length * Uint32Array.BYTES_PER_ELEMENT);
    const trianglesArray = new Uint32Array(trianglesBuffer);
    trianglesArray.set(this._triangles);
    return trianglesArray;
  }
}
