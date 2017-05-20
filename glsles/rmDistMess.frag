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

float sphere(vec3 pos, float radius)
{
    return length(pos) - radius;
}

float box(vec3 pos, vec3 size)
{
    return length(max(abs(pos) - size, 0.0));
}

// exponential smooth min (k = 32);
float sminE( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}
// polynomial smooth min (k = 0.1);
float sminP( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

// power smooth min (k = 8);
float sminPow( float a, float b, float k )
{
    a = pow( a, k ); b = pow( b, k );
    return pow( (a*b)/(a+b), 1.0/k );
}

float displacement(vec3 p) 
{
	float x = sin(20.0*p.x);
    float y = sin(20.0*p.y);
    float z = sin(20.000*p.z);
    return x*y*z;
}

float opDisplace( vec3 p )
{
    float d1 = box(p, vec3(2.000,1.356,1.934));
    float d2 = displacement(p);
    return d1+d2;
}
float opTwist( vec3 p )
{
    float c = cos(20.0*p.y);
    float s = sin(20.0*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return box(q, vec3(1.0,1.,2.000));
}

float opRep (vec3 p, vec3 c)
{
    vec3 q = mod(p, c) - 0.50*c;
    return box(q, vec3(0.1));
}


float distfunc(vec3 pos)
{
    float dFunc = sminP(sphere(pos, 1.336), box(pos, vec3(0.595,1.000,1.014)), 0.820);
    float dTwist = opRep(pos, vec3(0.0, 1.0, 1.0));
    float dDisp = opDisplace(pos);
    
	return min(dDisp, sminP(dTwist, dFunc, -1.664)); 
}


void main() {
    //vec2 st = gl_FragCoord.xy/u_resolution;
    //st.x *= u_resolution.x/u_resolution.y;
    vec3 color1 = vec3(0.925,0.407,0.398);
    vec3 color2 = vec3(0.551,0.624,0.800);
    //st = st * 2.-1.;
    //float r = TWO_PI/float(3);
    //float a = atan(st.x, st.y)+PI;
    
    vec3 cameraOrigin = vec3(2.327,1.523,2.772);
    vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
    vec3 upDirection = vec3(0.0, 1.0, 0.0);
    vec3 cameraDir = normalize(cameraTarget - cameraOrigin);
    
    vec3 cameraRight = normalize(cross(upDirection, cameraOrigin));
    vec3 cameraUp = cross(cameraDir, cameraRight);
    
    vec2 screenPos = -1.0 + 2.0 * gl_FragCoord.xy / u_resolution;
    screenPos.x *= u_resolution.x / u_resolution.y; // Correct aspect ratio
    
    vec3 rayDir = normalize(cameraRight * screenPos.x + cameraUp * screenPos.y + cameraDir);
    
    const int MAX_ITER = 100;
    const float MAX_DIST = 20.0; // Change if object is further than 20 from camera
    const float EPSILON = 0.01;
    
    float totalDist = 0.0;
    vec3 pos = cameraOrigin;
    float dist = EPSILON;
    
    for (int i = 0; i < MAX_ITER; i++)
    {
        if (dist < EPSILON || totalDist > MAX_DIST)
            break;
        
        dist = distfunc(pos); // Evaluate the distance at the current point
        totalDist += dist;
        pos += dist * rayDir; 
    }
    
    if (dist < EPSILON) 
    {
        vec2 eps = vec2(0.0, EPSILON);
        vec3 normal = normalize(vec3(
        	distfunc(pos + eps.yxx) - distfunc(pos - eps.yxx),
        	distfunc(pos + eps.xyx) - distfunc(pos - eps.xyx),
        	distfunc(pos + eps.xxy) - distfunc(pos - eps.xxy)));
        float diffuse = max(0.0, dot(-rayDir, normal));
        float specular = pow(diffuse, 32.0);
        
        //vec3 color = vec3(diffuse + specular);
        vec3 color = vec3(0.100,0.840,0.727) *diffuse + specular;
        gl_FragColor = vec4(color, 1.);
    }
    else
    {
        gl_FragColor = vec4(color1,1.0);   
    }
}