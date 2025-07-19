// WebGL protection for anti-fingerprinting
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('WebGLProtection');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][WebGLProtection]', message, data);
    }
  };
  
  log('Starting WebGL protection...');

  // Override getContext to ensure WebGL always works
  if (typeof HTMLCanvasElement !== 'undefined') {
    try {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, attributes) {
        if (type === 'webgl' || type === 'experimental-webgl') {
          const context = originalGetContext.call(this, type, attributes);
          
          if (context) {
            // Force WebGL to be supported
            const getParameter = context.getParameter;
            context.getParameter = function(pname) {
              const params = {
                // WebGL version constants
                37445: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
                37446: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
                // Vendor/renderer
                7936: 'Intel Inc.',
                7937: 'Intel(R) UHD Graphics 620',
                37447: 'ANGLE',
                7938: 'Intel Inc.',
                7939: 'Intel(R) UHD Graphics 620',
                // Hardware limits
                3379: 16384,
                34024: 16384,
                34930: 4096,
                35660: 16
              };
              
              if (params[pname] !== undefined) return params[pname];
              return getParameter.call(this, pname);
            };

            // Force extensions to be available
            context.getSupportedExtensions = function() {
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

            // Initialize context
            context.clearColor(0, 0, 0, 1);
            context.clear(context.COLOR_BUFFER_BIT);
          }
          
          return context;
        }
        
        return originalGetContext.call(this, type, attributes);
      };
    } catch (e) {
      log('WebGL getContext override failed', e.message);
    }
  }

  // Override WebGL2 if available
  if (typeof WebGL2RenderingContext !== 'undefined') {
    try {
      const originalGetContext2 = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, attributes) {
        if (type === 'webgl2') {
          const context = originalGetContext2.call(this, type, attributes);
          
          if (context) {
            // Force WebGL2 to be supported
            const getParameter = context.getParameter;
            context.getParameter = function(pname) {
              const params = {
                // WebGL2 version constants
                37445: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
                37446: 'WebGL GLSL ES 3.0 (OpenGL ES GLSL ES 3.0 Chromium)',
                // Vendor/renderer
                7936: 'Intel Inc.',
                7937: 'Intel(R) UHD Graphics 620',
                37447: 'ANGLE',
                7938: 'Intel Inc.',
                7939: 'Intel(R) UHD Graphics 620',
                // Hardware limits
                3379: 16384,
                34024: 16384,
                34930: 4096,
                35660: 16
              };
              
              if (params[pname] !== undefined) return params[pname];
              return getParameter.call(this, pname);
            };

            // Force WebGL2 extensions
            context.getSupportedExtensions = function() {
              return [
                'ANGLE_instanced_arrays',
                'EXT_blend_minmax',
                'EXT_color_buffer_float',
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
                'WEBGL_multi_draw',
                'WEBGL_multi_draw_instanced_base_vertex_base_instance'
              ];
            };

            // Initialize context
            context.clearColor(0, 0, 0, 1);
            context.clear(context.COLOR_BUFFER_BIT);
          }
          
          return context;
        }
        
        return originalGetContext2.call(this, type, attributes);
      };
    } catch (e) {
      log('WebGL2 getContext override failed', e.message);
    }
  }

  log('WebGL protection completed');
})();