// Userscript communication handler for Incognito Fingerprint extension
(function() {
    'use strict';
    
    if (window.incognitoLogger) {
        window.incognitoLogger.setScriptName('UserscriptCommunication');
    }
    
    const log = (message, data) => {
        if (window.incognitoLogger) {
            window.incognitoLogger.info(message, data);
        } else {
            console.log('[Incognito Fingerprint][UserscriptCommunication]', message, data);
        }
    };
    
    log('Setting up userscript communication...');
    
    // Default configuration for userscript
    const defaultConfig = {
        platform: 'Win32',
        language: 'en-US',
        languages: ['en-US', 'en'],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        vendor: 'Google Inc.',
        product: 'Gecko',
        productSub: '20030107',
        vendorSub: '',
        buildID: '20231201000000',
        hardwareConcurrency: 8,
        deviceMemory: 8,
        maxTouchPoints: 0,
        screen: {
            width: 1920,
            height: 1080,
            availWidth: 1920,
            availHeight: 1040,
            colorDepth: 24,
            pixelDepth: 24,
            availLeft: 0,
            availTop: 0
        },
        window: {
            innerWidth: 1920,
            innerHeight: 937,
            outerWidth: 1920,
            outerHeight: 1040,
            devicePixelRatio: 1,
            screenX: 0,
            screenY: 0,
            screenLeft: 0,
            screenTop: 0
        },
        timezone: 'America/New_York',
        timezoneOffset: 300,
        webgl: {
            vendor: 'Intel Inc.',
            renderer: 'Intel(R) UHD Graphics 620',
            extensions: [
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
            ]
        },
        audio: {
            sampleRate: 48000,
            state: 'running',
            analyser: {
                fftSize: 2048,
                frequencyBinCount: 1024,
                minDecibels: -100,
                maxDecibels: -30,
                smoothingTimeConstant: 0.8
            }
        },
        fonts: [
            'Arial', 'Arial Black', 'Arial Unicode MS', 'Calibri', 'Cambria', 'Cambria Math',
            'Comic Sans MS', 'Courier', 'Courier New', 'Georgia', 'Helvetica', 'Impact',
            'Lucida Console', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino',
            'Palatino Linotype', 'Tahoma', 'Times', 'Times New Roman', 'Trebuchet MS',
            'Verdana', 'Wingdings', 'Wingdings 2', 'Wingdings 3'
        ],
        plugins: [
            {
                name: 'Chrome PDF Plugin',
                description: 'Portable Document Format',
                filename: 'internal-pdf-viewer'
            },
            {
                name: 'Chrome PDF Viewer',
                description: 'Portable Document Format',
                filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai'
            },
            {
                name: 'Native Client',
                description: '',
                filename: 'internal-nacl-plugin'
            }
        ]
    };
    
    // Listen for messages from userscript
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'USERSCRIPT_READY') {
            log('Userscript ready signal received', event.data.config);
            
            // Store userscript config for extension access
            window._userscriptConfig = event.data.config || defaultConfig;
            
            // Send extension config to userscript
            sendExtensionConfig();
        }
        
        if (event.data && event.data.type === 'USERSCRIPT_STATUS') {
            log('Userscript status update', event.data);
            
            // Update extension with userscript status
            if (window.incognitoLogger) {
                window.incognitoLogger.info('Userscript status', event.data);
            }
        }
    });
    
    // Send extension configuration to userscript
    function sendExtensionConfig() {
        // Get extension settings from storage
        chrome.storage.local.get(['protectionEnabled', 'spoofConfig'], function(result) {
            const config = {
                enabled: result.protectionEnabled !== false,
                spoofConfig: result.spoofConfig || defaultConfig
            };
            
            // Send to userscript
            window.postMessage({
                type: 'EXTENSION_CONFIG',
                config: config
            }, '*');
            
            log('Sent extension config to userscript', config);
        });
    }
    
    // Function to update userscript configuration
    function updateUserscriptConfig(newConfig) {
        window.postMessage({
            type: 'SPOOF_CONFIG',
            config: newConfig
        }, '*');
        
        log('Updated userscript config', newConfig);
    }
    
    // Function to get userscript status
    function getUserscriptStatus() {
        return new Promise((resolve) => {
            window.postMessage({
                type: 'GET_STATUS'
            }, '*');
            
            // Listen for response
            const listener = function(event) {
                if (event.data && event.data.type === 'STATUS_RESPONSE') {
                    window.removeEventListener('message', listener);
                    resolve(event.data.status);
                }
            };
            
            window.addEventListener('message', listener);
            
            // Timeout after 2 seconds
            setTimeout(() => {
                window.removeEventListener('message', listener);
                resolve(null);
            }, 2000);
        });
    }
    
    // Expose functions to extension
    window.incognitoUserscriptCommunication = {
        updateConfig: updateUserscriptConfig,
        getStatus: getUserscriptStatus,
        sendConfig: sendExtensionConfig,
        getConfig: () => window._userscriptConfig || defaultConfig
    };
    
    // Send initial config after a short delay
    setTimeout(sendExtensionConfig, 1000);
    
    log('Userscript communication setup complete');
})(); 