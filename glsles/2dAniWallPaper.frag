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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    st = tile(st, 3.0);
    
    //st.y += sin(u_time)/3.;
    st.y += u_time*0.372;
    
    st = tile(st, 2.0);
    
    st = rotate2d(st, PI * cos(u_time/2.0));
    st = tile(st, 2.0);
    
    vec2 st2 = st - abs(cos(u_time));
    st2 - rotate2d(st2, PI*0.074);
     //st = tile(st, 0.920); st = tile(st, 1.000); st = tile(st, 0.496);
    float circle = circleSDF(st);
    //st.x += st.y * 1.104;
    
    
    vec2 r=abs(st2);
    float s=step(-0.060,max(r.x,r.y));
    vec4 box = vec4(vec3(s), 1.000);
    
    float s2=max(r.x,r.y);
    vec3 boxOutline = vec3(step(0.056,s2) * step(s2,1.428));
    
	
    vec3 color = vec3(circle, .5,0.4); // Some colouring
    color *= box.xyz * boxOutline.xyz;
    color += stroke(circleSDF(st), 0.756, 0.426);
    
    
    gl_FragColor = vec4(color,1.0);
}