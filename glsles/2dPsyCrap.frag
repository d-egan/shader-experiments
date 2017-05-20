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
    float d = smoothstep(a+0.364,a+0.369,x+v*0.5) - smoothstep(a+0.208,a+0.217,x-v*0.5);
    
    return clamp (d, 0.0, 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    st=tile(st, 1.0);
   
    
    vec3 color = vec3(0.370,0.362,0.370);

    vec2 pos = vec2(0.5) - st;
    st=tile(st, 1.0);
    //pos= tile(pos, 1.0);
    float r = length(pos)*4.184;
    float a = atan(pos.y, pos.x);

    float f = abs(sin(a*2.) * cos(r * PI));
    float f2 = abs(sin(u_time *st.x * PI) * cos(0.768 * PI));
    //float f2 = abs(sin(cos(u_time) *st.x * PI) * cos(1. * PI));
    color += vec3( 1.000-smoothstep(f,f+0.012,r*1.024) );
    color += stroke3(f, 0.216 + sin(u_time) *0.416, 0.520*st.y);
    
    color += stroke3(f2, 0.608, 0.488*(1.-st.y));
    
    gl_FragColor = vec4(color,1.0);
}