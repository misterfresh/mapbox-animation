precision highp float;

attribute vec2 a_pos;
attribute vec2 a_offset;
attribute vec4 a_data1;
attribute vec4 a_data2;
attribute vec2 a_next_pos;
attribute vec2 a_prev_pos;

// matrix is for the vertex position, exmatrix is for rotating and projecting
// the extrusion vector.
uniform mat4 u_matrix;
uniform mat4 u_exmatrix;
uniform mediump float u_zoom;
uniform bool u_skewed;
uniform float u_extra;
uniform mediump float u_completion;
uniform int u_transition_style;

uniform vec2 u_texsize;

varying vec2 v_tex;
varying vec2 v_fade_tex;

vec2 linearTransition(mediump float completion, vec2 pos, vec2 next_pos);
vec2 bezierTransition(mediump float completion, vec2 pos, vec2 next_pos, vec2 prev_pos);
vec2 midpointsTransition(mediump float completion, vec2 pos, vec2 next_pos, vec2 prev_pos);
vec2 circleTransition(mediump float completion, vec2 pos, vec2 next_pos, vec2 prev_pos);

void main() {
    vec2 a_tex = a_data1.xy;
    mediump float a_labelminzoom = a_data1[2];
    mediump vec2 a_zoom = a_data2.st;
    mediump float a_minzoom = a_zoom[0];
    mediump float a_maxzoom = a_zoom[1];

    float a_fadedist = 10.0;

    // u_zoom is the current zoom level adjusted for the change in font size
    mediump float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));

    vec2 current_pos = a_pos;
    bool next_defined = (a_next_pos.x != 0.0 || a_next_pos.y != 0.0 );
    bool previous_defined = (next_defined && (a_prev_pos.x != 0.0 || a_prev_pos.y != 0.0 ));

    if (u_transition_style == 1) current_pos = next_defined ? linearTransition(u_completion, a_pos, a_next_pos) : a_pos;
    if (u_transition_style == 2) current_pos = previous_defined ? bezierTransition(u_completion, a_pos, a_next_pos, a_prev_pos) : a_pos;
    if (u_transition_style == 3) current_pos = previous_defined ? midpointsTransition(u_completion, a_pos, a_next_pos, a_prev_pos) : a_pos;
    if (u_transition_style == 4) current_pos = previous_defined ? circleTransition(u_completion, a_pos, a_next_pos, a_prev_pos) : a_pos;

    if (u_skewed) {
        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, 0, 0);
        gl_Position = u_matrix * vec4(current_pos + extrude.xy, 0, 1);
        gl_Position.z += z * gl_Position.w;
    } else {
        vec4 extrude = u_exmatrix * vec4(a_offset / 64.0, z, 0);
        gl_Position = u_matrix * vec4(current_pos, 0, 1) + extrude;
    }

    v_tex = a_tex / u_texsize;
    v_fade_tex = vec2(a_labelminzoom / 255.0, 0.0);
}

vec2 linearTransition(mediump float completion, vec2 pos, vec2 next_pos){
    return (completion >= 1.0) ? next_pos : mix(pos, next_pos, completion);
}

vec2 bezierTransition(mediump float completion, vec2 pos, vec2 next_pos, vec2 prev_pos){
    if(completion >= 1.0) return next_pos;
    mediump float ratio = (completion + 1.0) /2.0;
    vec2 control = pos * 2.0 - next_pos / 2.0 - prev_pos / 2.0;
    return next_pos * pow(ratio, 2.0) + control * 2.0 * (1.0 - ratio) * ratio + prev_pos * pow(1.0 - ratio, 2.0);
}

vec2 midpointsTransition(mediump float completion, vec2 pos, vec2 next_pos, vec2 prev_pos){
    vec2 next = (pos + next_pos) / 2.0;
    vec2 prev = (pos + prev_pos) / 2.0;
    if(completion >= 1.0) return next;
    return next * pow(u_completion, 2.0) + pos * 2.0 * (1.0 - completion)* completion + prev * pow(1.0 - completion, 2.0);
}

vec2 circleTransition(mediump float completion, vec2 pos, vec2 next_pos, vec2 prev_pos){
    vec2 next = (pos + next_pos) / 2.0;
    vec2 prev = (pos + prev_pos) / 2.0;
    if(completion >= 1.0) return next;

    // get center and radius of circle passing through three points
    float prev_x = prev.x;  float pos_x = pos.x;  float next_x = next.x;
    float prev_y = prev.y;  float pos_y = pos.y;  float next_y = next.y;

    float prev_slope = (pos_y - prev_y) / (pos_x - prev_x);
    float next_slope = (next_y - pos_y) / (next_x - pos_x);

    if (prev_slope == next_slope) return mix(prev, next, completion);

    float center_x = (prev_slope * next_slope * (next_y - prev_y) + prev_slope * (pos_x + next_x) - next_slope * ( prev_x + pos_x )) / (2.0 * ( prev_slope - next_slope));
    float center_y = (prev_y + pos_y)/2.0 - (center_x - (prev_x + pos_x)/2.0) / prev_slope;
    vec2 center = vec2(center_x, center_y);
    float radius = distance(center, pos);

    // get angle of current pos
    float prev_angle = atan(prev_y - center_y, prev_x - center_x);
    float pi = 3.14159265358;
    float next_pos_angle = atan(next_y - center_y, next_x - center_x);

    if(next_pos_angle - prev_angle > pi){
        next_pos_angle = next_pos_angle - 2.0 * pi;
    }else if(next_pos_angle - prev_angle < - pi){
        next_pos_angle = next_pos_angle + 2.0 * pi;
    }
    float current_angle = mix(prev_angle, next_pos_angle,completion);

    return vec2(cos(current_angle) * radius + center_x, sin(current_angle) * radius + center_y);
}