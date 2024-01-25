export class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  sub(other) {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  mul(other) {
    return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  div(other) {
    return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  length() {
    return Math.sqrt(this.dot(this));
  }
}
