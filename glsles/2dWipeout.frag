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
    return cos(floor(0.5*cos(u_time)+a/r)*r-a)*length(st);
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
    float d = smoothstep(a+0.364,a+0.369,x+v*0.5) - smoothstep(a+0.208,a+0.217,x-v*0.5);
    
    return clamp (d, 0.0, 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    //st.x *= u_resolution.x/u_resolution.y;
    st = tile(st, 1.0);
    vec3 color = vec3(0.305,0.294,0.300);
    vec3 color2 = vec3(0.870,0.034,0.026);

    //st = vec2(0.5) - st;
    st = st * 2.-1.;
    
  	//st = tile(st, 1.000);
    
    float r = TWO_PI/float(3);
    float a = atan(st.x, st.y)+PI;
	
    //float d = cos(floor(.5+a/r)*r-a)*length(st);
    float d = sidedShape(st, 4);
    //st = tile(st, 2.040);
    float z = sidedShape(st,5);
    //st = tile(st, 0.224);
    float e = sidedShape(st, 2);
    //st = tile(st, 6.240);
    float circ = circleSDF(st);
    d = min(d,z);
    z = max(d,e);
    d += z;
    d = distance(d, circ);
    //d = min(d, circ);
    float circ2 = circleSDF(st);
    
    //color = vec3(1.0-smoothstep(.4,0.410,d));
    color += stroke3(d, -0.136, 0.452);
    color2 *= stroke3(circ2, 0.560, 1.506);
    
    
    //color *= circ2;
    color -= color2;
    color = max(color, color2);
    
    gl_FragColor = vec4(color,1.0);
}