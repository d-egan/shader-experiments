// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 tile(vec2 st, float num)
{
    st *= num;
    st = fract(st);
    return st;
}

vec2 rotate2d(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

float circleSDF(vec2 st) {
    return length(st-.5)*2.;
}

float stroke(float x, float a, float v){
    float d = step(a, x+v*0.5) - step(a,x-v*0.5);
    return clamp (d, 0.0, 1.0);
}

float stroke2(float x, float  a, float v) {
    float d = smoothstep(1.300,1.305,x) * smoothstep(1.680,1.673,x);
    
    return clamp (d, 0.0, 1.0);
}
float stroke3(float x, float  a, float v) {
    float d = smoothstep(0.956,0.945,x) - smoothstep(1.448,1.497,x);
    
    return clamp (d, 0.0, 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    st = tile(st, 1.376);
    //vec2 pos = st - vec2(0.5);
    vec2 pos = vec2(0.5) - st;
    
    st = tile(pos, 3.0);
    float r = length(st)*1.912;
    //pos.x += pos.y;
    
    st = tile(st, 1.400);
    pos = tile(st, 0.560);
    
    
    float a = atan(pos.y,pos.x);
    float circle = stroke3(r, 0.904, 0.672);
    vec3 color = vec3(0.875,0.523,0.448);
    color *= stroke(a, 1.740 * sin(u_time) * pos.x, 1.000 * st.y * r);
    
    //vec3 color2 = vec3(1.-smoothstep((fract(abs(cos(u_time)))*cos(r)), r+-0.448, r));
    //color *= color2;
    color += circle;
    
    gl_FragColor = vec4(color,1.0);
}