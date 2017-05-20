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

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    
    st = tile(st, 3.0);
    st = rotate2d(st, PI*abs(fract(u_time*0.636)));
    
    vec2 st2 = st -0.5;
    st2 - rotate2d(st2, PI*0.394);
    
    vec2 r=abs(st2);
    float s=step(-0.060,max(r.x,r.y));
    vec4 box = vec4(vec3(s), 1.000);
    
    float s2=max(r.x,r.y);
    vec3 boxOutline = vec3(step(0.288,s2) * step(s2,0.388));
    
	
    vec3 color = vec3(st.x,st.y*cos(u_time),0.4); // Some colouring
    color *= box.xyz * boxOutline.xyz;
    
    
    gl_FragColor = vec4(color,1.0);
}