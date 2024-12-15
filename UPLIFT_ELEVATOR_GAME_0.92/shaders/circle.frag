precision mediump float;

uniform float uTime;
uniform float uRadius;

void main() {
    // Simple circular gradient effect to visualize the transparency
    vec2 position = gl_FragCoord.xy / vec2(600.0, 800.0);
    float dist = length(position - vec2(0.5, 0.5));

    // Color is white with decreasing opacity towards the edge
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0 - dist); // The alpha (transparency) decreases with distance

    // Set the fragment color (this includes transparency)
    gl_FragColor = color;
}
