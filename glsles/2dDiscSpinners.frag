// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966
#define TWO_PI 6.28318530718

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
    return length(st-0.)*1.536;
}

float sidedShape(vec2 st, float angle, float radius, int sides) {
    return cos(floor(.5+angle/radius)*radius-angle)*length(st);
}
float sidedShape(vec2 st, int sides) {
    float r = TWO_PI/float(sides);
    float a = atan(st.x, st.y)+PI;
    //return cos(floor(0.5+a/r)*r-a)*length(st);
    return cos(floor(.5+a/r)*r-a)*length(st);
}


float stroke(float x, float a, float v){
    float d = step(a, x+v*0.5) - step(a,x-v*0.5);
    return clamp (d, 0.0, 1.0);
}

float stroke2(float x, float  a, float v) {
    float d = smoothstep(1.092,1.305,x) * smoothstep(1.680,1.673,x);
    
    return clamp (d, 0.0, 1.0);
}
float stroke3(float x, float  a, float v) {
    float d = smoothstep(a+0.364,a+0.369,x+v*0.5) - smoothstep(a+0.208,a+0.217,x-v*0.5);
    
    return clamp (d, 0.0, 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    //st.x *= u_resolution.x/u_resolution.y;
    st = tile(st, 2.968);
    vec3 color1 = vec3(0.838,0.925,0.878);
    vec3 color2 = vec3(0.551,0.624,0.800);

    st = st * 2.-1.;
    
    float r = TWO_PI/float(3);
    float a = atan(st.x, st.y)+PI;
    
    float circ = circleSDF(st);
    float circS = stroke3(circ, 0.720, 1.140);
	st = tile(st, 1.896);

    st = rotate2d(st - vec2(-0.350,0.100), sin(u_time));
    float tri = sidedShape(st,3);
    tri *= circS;
    color1.x *= tri;
    color2.y *= tri;
    color1 *= tri;
    float triS = stroke3(tri, 0.696 * cos(u_time), 0.412);
    color2 *= triS;
    //color1 *= circ;
    color1 += color2;

    gl_FragColor = vec4(color1,1.0);
}