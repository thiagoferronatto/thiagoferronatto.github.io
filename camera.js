class Camera {
  constructor(fov, aspect, near, far) {
    this.perspective = new Matrix4(
      1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
      0, 1 / Math.tan(fov / 2), 0, 0,
      0, 0, -(far + near) / (far - near), -1,
      0, 0, -(2 * far * near) / (far - near), 0
    );

    this.transform = new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }
}
