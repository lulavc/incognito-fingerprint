// Injected WebGL Spoofing Script
console.log('[Incognito Fingerprint] WebGL spoofing active');

// --- Begin WebGL spoofing logic ---
// Using shared utility function from window.getRandomFloat

// --- Enhanced WebGL spoofing ---
const vendors = [
  {vendor: 'Intel Inc.', renderer: 'Intel(R) UHD Graphics 620'},
  {vendor: 'NVIDIA Corporation', renderer: 'NVIDIA GeForce GTX 1050 Ti/PCIe/SSE2'},
  {vendor: 'AMD', renderer: 'AMD Radeon Pro 560X OpenGL Engine'},
  {vendor: 'Mesa/X.org', renderer: 'Mesa Intel(R) UHD Graphics 620 (KBL GT2)'}
];
const selected = vendors[Math.floor(Math.random() * vendors.length)];

// Enhanced getParameter spoofing
const getParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function(pname) {
  // Comprehensive WebGL parameter spoofing
  const params = {
    // WebGL version constants
    37445: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)', // VERSION
    37446: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)', // SHADING_LANGUAGE_VERSION
    // Vendor/renderer
    7936: selected.vendor, // VENDOR
    7937: selected.renderer, // RENDERER
    37447: 'ANGLE', // EXTENSIONS
    7938: selected.vendor, // UNMASKED_VENDOR_WEBGL
    7939: selected.renderer, // UNMASKED_RENDERER_WEBGL
    // Hardware limits
    3379: 16384, // MAX_TEXTURE_SIZE
    34024: 16384, // MAX_RENDERBUFFER_SIZE
    34930: 4096, // MAX_VERTEX_TEXTURE_IMAGE_UNITS
    35660: 16, // MAX_VERTEX_ATTRIBS
    34921: 8, // MAX_VERTEX_UNIFORM_VECTORS
    35720: 8, // MAX_FRAGMENT_UNIFORM_VECTORS
    34922: 8, // MAX_VARYING_VECTORS
    35661: 16, // MAX_COMBINED_TEXTURE_IMAGE_UNITS
    34923: 32, // MAX_VERTEX_OUTPUT_COMPONENTS
    35662: 32, // MAX_FRAGMENT_INPUT_COMPONENTS
    34924: 8, // ALIASED_LINE_WIDTH_RANGE
    34925: 1, // ALIASED_POINT_SIZE_RANGE
    37444: 8, // MAX_VIEWPORT_DIMS
    34926: 8, // MAX_TEXTURE_LOD_BIAS
    34927: 8, // ALIASED_LINE_WIDTH_RANGE
    34928: 8, // ALIASED_POINT_SIZE_RANGE
    34929: 8, // MAX_VIEWPORT_DIMS
    34931: 8, // MAX_TEXTURE_LOD_BIAS
    34932: 8, // MAX_ANISOTROPY_EXT
    34933: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34934: 8, // MAX_TEXTURE_LOD_BIAS
    34935: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34936: 8, // MAX_TEXTURE_LOD_BIAS
    34937: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34938: 8, // MAX_TEXTURE_LOD_BIAS
    34939: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34940: 8, // MAX_TEXTURE_LOD_BIAS
    34941: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34942: 8, // MAX_TEXTURE_LOD_BIAS
    34943: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34944: 8, // MAX_TEXTURE_LOD_BIAS
    34945: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34946: 8, // MAX_TEXTURE_LOD_BIAS
    34947: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34948: 8, // MAX_TEXTURE_LOD_BIAS
    34949: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34950: 8, // MAX_TEXTURE_LOD_BIAS
    34951: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34952: 8, // MAX_TEXTURE_LOD_BIAS
    34953: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34954: 8, // MAX_TEXTURE_LOD_BIAS
    34955: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34956: 8, // MAX_TEXTURE_LOD_BIAS
    34957: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34958: 8, // MAX_TEXTURE_LOD_BIAS
    34959: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34960: 8, // MAX_TEXTURE_LOD_BIAS
    34961: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34962: 8, // MAX_TEXTURE_LOD_BIAS
    34963: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34964: 8, // MAX_TEXTURE_LOD_BIAS
    34965: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34966: 8, // MAX_TEXTURE_LOD_BIAS
    34967: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34968: 8, // MAX_TEXTURE_LOD_BIAS
    34969: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34970: 8, // MAX_TEXTURE_LOD_BIAS
    34971: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34972: 8, // MAX_TEXTURE_LOD_BIAS
    34973: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34974: 8, // MAX_TEXTURE_LOD_BIAS
    34975: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34976: 8, // MAX_TEXTURE_LOD_BIAS
    34977: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34978: 8, // MAX_TEXTURE_LOD_BIAS
    34979: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34980: 8, // MAX_TEXTURE_LOD_BIAS
    34981: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34982: 8, // MAX_TEXTURE_LOD_BIAS
    34983: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34984: 8, // MAX_TEXTURE_LOD_BIAS
    34985: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34986: 8, // MAX_TEXTURE_LOD_BIAS
    34987: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34988: 8, // MAX_TEXTURE_LOD_BIAS
    34989: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34990: 8, // MAX_TEXTURE_LOD_BIAS
    34991: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34992: 8, // MAX_TEXTURE_LOD_BIAS
    34993: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34994: 8, // MAX_TEXTURE_LOD_BIAS
    34995: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34996: 8, // MAX_TEXTURE_LOD_BIAS
    34997: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    34998: 8, // MAX_TEXTURE_LOD_BIAS
    34999: 8, // MAX_TEXTURE_MAX_ANISOTROPY_EXT
    35000: 8, // MAX_TEXTURE_LOD_BIAS
  };
  
  if (params[pname] !== undefined) return params[pname];
  return getParameter.call(this, pname);
};

// Enhanced canvas context protection
const getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type) {
  const context = getContext.apply(this, arguments);
  if (type === 'webgl' || type === 'experimental-webgl') {
    const gl = context;
    
    // Ensure WebGL context is properly initialized
    if (gl) {
    // Add subtle noise pattern
    const pixels = new Uint8Array(4);
    crypto.getRandomValues(pixels);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      
      // Override getSupportedExtensions
      gl.getSupportedExtensions = function() {
        return [
          'ANGLE_instanced_arrays',
          'EXT_blend_minmax',
          'EXT_color_buffer_half_float',
          'EXT_disjoint_timer_query',
          'EXT_float_blend',
          'EXT_frag_depth',
          'EXT_shader_texture_lod',
          'EXT_texture_compression_bptc',
          'EXT_texture_compression_rgtc',
          'EXT_texture_filter_anisotropic',
          'OES_element_index_uint',
          'OES_standard_derivatives',
          'OES_texture_float',
          'OES_texture_float_linear',
          'OES_texture_half_float',
          'OES_texture_half_float_linear',
          'OES_vertex_array_object',
          'WEBGL_color_buffer_float',
          'WEBGL_compressed_texture_s3tc',
          'WEBGL_compressed_texture_s3tc_srgb',
          'WEBGL_debug_renderer_info',
          'WEBGL_debug_shaders',
          'WEBGL_depth_texture',
          'WEBGL_draw_buffers',
          'WEBGL_lose_context',
          'WEBGL_multi_draw'
        ];
      };
    }
  }
  return context;
};

console.log('[Incognito Fingerprint] WebGL spoofing completed');
// --- End WebGL spoofing logic ---
