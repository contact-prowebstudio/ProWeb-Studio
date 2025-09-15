export const portalVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const portalFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec2 uv = vUv;
    float dist = length(uv - 0.5);

    vec3 color1 = vec3(0.0, 1.0, 1.0);
    vec3 color2 = vec3(1.0, 0.0, 1.0);

    vec3 color = mix(color1, color2, sin(uTime + dist * 10.0) * 0.5 + 0.5);

    float alpha = 1.0 - dist * 2.0;
    alpha *= 0.8 + sin(uTime * 3.0 + dist * 20.0) * 0.2;

    gl_FragColor = vec4(color, alpha * 0.8);
  }
`;
