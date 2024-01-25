class Matrix4 {
  constructor(...elements) {
    let tmpBufHandle = new ArrayBuffer(16 * Float32Array.BYTES_PER_ELEMENT);
    this.data = new Float32Array(tmpBufHandle);
    this.data.set(elements);
  }

  at(i, j) {
    return this.data[i * 4 + j];
  }

  set(i, j, value) {
    this.data[i * 4 + j] = value;
  }

  translate(x, y, z) {
    this.data[12] += x;
    this.data[13] += y;
    this.data[14] += z;
  }

  scale(x, y, z) {
    this.data[0] *= x;
    this.data[5] *= y;
    this.data[10] *= z;
  }
}
