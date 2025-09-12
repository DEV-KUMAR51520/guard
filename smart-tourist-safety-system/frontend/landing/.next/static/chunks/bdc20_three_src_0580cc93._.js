(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/landing/node_modules/three/src/loaders/Cache.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @class
 * @classdesc A simple caching system, used internally by {@link FileLoader}.
 * To enable caching across all loaders that use {@link FileLoader}, add `THREE.Cache.enabled = true.` once in your app.
 * @hideconstructor
 */ __turbopack_context__.s([
    "Cache",
    ()=>Cache
]);
const Cache = {
    /**
	 * Whether caching is enabled or not.
	 *
	 * @static
	 * @type {boolean}
	 * @default false
	 */ enabled: false,
    /**
	 * A dictionary that holds cached files.
	 *
	 * @static
	 * @type {Object<string,Object>}
	 */ files: {},
    /**
	 * Adds a cache entry with a key to reference the file. If this key already
	 * holds a file, it is overwritten.
	 *
	 * @static
	 * @param {string} key - The key to reference the cached file.
	 * @param {Object} file -  The file to be cached.
	 */ add: function(key, file) {
        if (this.enabled === false) return;
        // console.log( 'THREE.Cache', 'Adding key:', key );
        this.files[key] = file;
    },
    /**
	 * Gets the cached value for the given key.
	 *
	 * @static
	 * @param {string} key - The key to reference the cached file.
	 * @return {Object|undefined} The cached file. If the key does not exist `undefined` is returned.
	 */ get: function(key) {
        if (this.enabled === false) return;
        // console.log( 'THREE.Cache', 'Checking key:', key );
        return this.files[key];
    },
    /**
	 * Removes the cached file associated with the given key.
	 *
	 * @static
	 * @param {string} key - The key to reference the cached file.
	 */ remove: function(key) {
        delete this.files[key];
    },
    /**
	 * Remove all values from the cache.
	 *
	 * @static
	 */ clear: function() {
        this.files = {};
    }
};
;
}),
"[project]/frontend/landing/node_modules/three/src/loaders/LoadingManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Handles and keeps track of loaded and pending data. A default global
 * instance of this class is created and used by loaders if not supplied
 * manually.
 *
 * In general that should be sufficient, however there are times when it can
 * be useful to have separate loaders - for example if you want to show
 * separate loading bars for objects and textures.
 *
 * ```js
 * const manager = new THREE.LoadingManager();
 * manager.onLoad = () => console.log( 'Loading complete!' );
 *
 * const loader1 = new OBJLoader( manager );
 * const loader2 = new ColladaLoader( manager );
 * ```
 */ __turbopack_context__.s([
    "DefaultLoadingManager",
    ()=>DefaultLoadingManager,
    "LoadingManager",
    ()=>LoadingManager
]);
class LoadingManager {
    /**
	 * Constructs a new loading manager.
	 *
	 * @param {Function} [onLoad] - Executes when all items have been loaded.
	 * @param {Function} [onProgress] - Executes when single items have been loaded.
	 * @param {Function} [onError] - Executes when an error occurs.
	 */ constructor(onLoad, onProgress, onError){
        const scope = this;
        let isLoading = false;
        let itemsLoaded = 0;
        let itemsTotal = 0;
        let urlModifier = undefined;
        const handlers = [];
        // Refer to #5689 for the reason why we don't set .onStart
        // in the constructor
        /**
		 * Executes when an item starts loading.
		 *
		 * @type {Function|undefined}
		 * @default undefined
		 */ this.onStart = undefined;
        /**
		 * Executes when all items have been loaded.
		 *
		 * @type {Function|undefined}
		 * @default undefined
		 */ this.onLoad = onLoad;
        /**
		 * Executes when single items have been loaded.
		 *
		 * @type {Function|undefined}
		 * @default undefined
		 */ this.onProgress = onProgress;
        /**
		 * Executes when an error occurs.
		 *
		 * @type {Function|undefined}
		 * @default undefined
		 */ this.onError = onError;
        /**
		 * Used for aborting ongoing requests in loaders using this manager.
		 *
		 * @type {AbortController}
		 */ this.abortController = new AbortController();
        /**
		 * This should be called by any loader using the manager when the loader
		 * starts loading an item.
		 *
		 * @param {string} url - The URL to load.
		 */ this.itemStart = function(url) {
            itemsTotal++;
            if (isLoading === false) {
                if (scope.onStart !== undefined) {
                    scope.onStart(url, itemsLoaded, itemsTotal);
                }
            }
            isLoading = true;
        };
        /**
		 * This should be called by any loader using the manager when the loader
		 * ended loading an item.
		 *
		 * @param {string} url - The URL of the loaded item.
		 */ this.itemEnd = function(url) {
            itemsLoaded++;
            if (scope.onProgress !== undefined) {
                scope.onProgress(url, itemsLoaded, itemsTotal);
            }
            if (itemsLoaded === itemsTotal) {
                isLoading = false;
                if (scope.onLoad !== undefined) {
                    scope.onLoad();
                }
            }
        };
        /**
		 * This should be called by any loader using the manager when the loader
		 * encounters an error when loading an item.
		 *
		 * @param {string} url - The URL of the item that produces an error.
		 */ this.itemError = function(url) {
            if (scope.onError !== undefined) {
                scope.onError(url);
            }
        };
        /**
		 * Given a URL, uses the URL modifier callback (if any) and returns a
		 * resolved URL. If no URL modifier is set, returns the original URL.
		 *
		 * @param {string} url - The URL to load.
		 * @return {string} The resolved URL.
		 */ this.resolveURL = function(url) {
            if (urlModifier) {
                return urlModifier(url);
            }
            return url;
        };
        /**
		 * If provided, the callback will be passed each resource URL before a
		 * request is sent. The callback may return the original URL, or a new URL to
		 * override loading behavior. This behavior can be used to load assets from
		 * .ZIP files, drag-and-drop APIs, and Data URIs.
		 *
		 * ```js
		 * const blobs = {'fish.gltf': blob1, 'diffuse.png': blob2, 'normal.png': blob3};
		 *
		 * const manager = new THREE.LoadingManager();
		 *
		 * // Initialize loading manager with URL callback.
		 * const objectURLs = [];
		 * manager.setURLModifier( ( url ) => {
		 *
		 * 	url = URL.createObjectURL( blobs[ url ] );
		 * 	objectURLs.push( url );
		 * 	return url;
		 *
		 * } );
		 *
		 * // Load as usual, then revoke the blob URLs.
		 * const loader = new GLTFLoader( manager );
		 * loader.load( 'fish.gltf', (gltf) => {
		 *
		 * 	scene.add( gltf.scene );
		 * 	objectURLs.forEach( ( url ) => URL.revokeObjectURL( url ) );
		 *
		 * } );
		 * ```
		 *
		 * @param {function(string):string} transform - URL modifier callback. Called with an URL and must return a resolved URL.
		 * @return {LoadingManager} A reference to this loading manager.
		 */ this.setURLModifier = function(transform) {
            urlModifier = transform;
            return this;
        };
        /**
		 * Registers a loader with the given regular expression. Can be used to
		 * define what loader should be used in order to load specific files. A
		 * typical use case is to overwrite the default loader for textures.
		 *
		 * ```js
		 * // add handler for TGA textures
		 * manager.addHandler( /\.tga$/i, new TGALoader() );
		 * ```
		 *
		 * @param {string} regex - A regular expression.
		 * @param {Loader} loader - A loader that should handle matched cases.
		 * @return {LoadingManager} A reference to this loading manager.
		 */ this.addHandler = function(regex, loader) {
            handlers.push(regex, loader);
            return this;
        };
        /**
		 * Removes the loader for the given regular expression.
		 *
		 * @param {string} regex - A regular expression.
		 * @return {LoadingManager} A reference to this loading manager.
		 */ this.removeHandler = function(regex) {
            const index = handlers.indexOf(regex);
            if (index !== -1) {
                handlers.splice(index, 2);
            }
            return this;
        };
        /**
		 * Can be used to retrieve the registered loader for the given file path.
		 *
		 * @param {string} file - The file path.
		 * @return {?Loader} The registered loader. Returns `null` if no loader was found.
		 */ this.getHandler = function(file) {
            for(let i = 0, l = handlers.length; i < l; i += 2){
                const regex = handlers[i];
                const loader = handlers[i + 1];
                if (regex.global) regex.lastIndex = 0; // see #17920
                if (regex.test(file)) {
                    return loader;
                }
            }
            return null;
        };
        /**
		 * Can be used to abort ongoing loading requests in loaders using this manager.
		 * The abort only works if the loaders implement {@link Loader#abort} and `AbortSignal.any()`
		 * is supported in the browser.
		 *
		 * @return {LoadingManager} A reference to this loading manager.
		 */ this.abort = function() {
            this.abortController.abort();
            this.abortController = new AbortController();
            return this;
        };
    }
}
/**
 * The global default loading manager.
 *
 * @constant
 * @type {LoadingManager}
 */ const DefaultLoadingManager = /*@__PURE__*/ new LoadingManager();
;
}),
"[project]/frontend/landing/node_modules/three/src/loaders/Loader.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader",
    ()=>Loader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$LoadingManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/loaders/LoadingManager.js [app-client] (ecmascript)");
;
/**
 * Abstract base class for loaders.
 *
 * @abstract
 */ class Loader {
    /**
	 * This method needs to be implemented by all concrete loaders. It holds the
	 * logic for loading assets from the backend.
	 *
	 * @abstract
	 * @param {string} url - The path/URL of the file to be loaded.
	 * @param {Function} onLoad - Executed when the loading process has been finished.
	 * @param {onProgressCallback} [onProgress] - Executed while the loading is in progress.
	 * @param {onErrorCallback} [onError] - Executed when errors occur.
	 */ load() {}
    /**
	 * A async version of {@link Loader#load}.
	 *
	 * @param {string} url - The path/URL of the file to be loaded.
	 * @param {onProgressCallback} [onProgress] - Executed while the loading is in progress.
	 * @return {Promise} A Promise that resolves when the asset has been loaded.
	 */ loadAsync(url, onProgress) {
        const scope = this;
        return new Promise(function(resolve, reject) {
            scope.load(url, resolve, onProgress, reject);
        });
    }
    /**
	 * This method needs to be implemented by all concrete loaders. It holds the
	 * logic for parsing the asset into three.js entities.
	 *
	 * @abstract
	 * @param {any} data - The data to parse.
	 */ parse() {}
    /**
	 * Sets the `crossOrigin` String to implement CORS for loading the URL
	 * from a different domain that allows CORS.
	 *
	 * @param {string} crossOrigin - The `crossOrigin` value.
	 * @return {Loader} A reference to this instance.
	 */ setCrossOrigin(crossOrigin) {
        this.crossOrigin = crossOrigin;
        return this;
    }
    /**
	 * Whether the XMLHttpRequest uses credentials such as cookies, authorization
	 * headers or TLS client certificates, see [XMLHttpRequest.withCredentials]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials}.
	 *
	 * Note: This setting has no effect if you are loading files locally or from the same domain.
	 *
	 * @param {boolean} value - The `withCredentials` value.
	 * @return {Loader} A reference to this instance.
	 */ setWithCredentials(value) {
        this.withCredentials = value;
        return this;
    }
    /**
	 * Sets the base path for the asset.
	 *
	 * @param {string} path - The base path.
	 * @return {Loader} A reference to this instance.
	 */ setPath(path) {
        this.path = path;
        return this;
    }
    /**
	 * Sets the base path for dependent resources like textures.
	 *
	 * @param {string} resourcePath - The resource path.
	 * @return {Loader} A reference to this instance.
	 */ setResourcePath(resourcePath) {
        this.resourcePath = resourcePath;
        return this;
    }
    /**
	 * Sets the given request header.
	 *
	 * @param {Object} requestHeader - A [request header]{@link https://developer.mozilla.org/en-US/docs/Glossary/Request_header}
	 * for configuring the HTTP request.
	 * @return {Loader} A reference to this instance.
	 */ setRequestHeader(requestHeader) {
        this.requestHeader = requestHeader;
        return this;
    }
    /**
	 * This method can be implemented in loaders for aborting ongoing requests.
	 *
	 * @abstract
	 * @return {Loader} A reference to this instance.
	 */ abort() {
        return this;
    }
    /**
	 * Constructs a new loader.
	 *
	 * @param {LoadingManager} [manager] - The loading manager.
	 */ constructor(manager){
        /**
		 * The loading manager.
		 *
		 * @type {LoadingManager}
		 * @default DefaultLoadingManager
		 */ this.manager = manager !== undefined ? manager : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$LoadingManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultLoadingManager"];
        /**
		 * The crossOrigin string to implement CORS for loading the url from a
		 * different domain that allows CORS.
		 *
		 * @type {string}
		 * @default 'anonymous'
		 */ this.crossOrigin = 'anonymous';
        /**
		 * Whether the XMLHttpRequest uses credentials.
		 *
		 * @type {boolean}
		 * @default false
		 */ this.withCredentials = false;
        /**
		 * The base path from which the asset will be loaded.
		 *
		 * @type {string}
		 */ this.path = '';
        /**
		 * The base path from which additional resources like textures will be loaded.
		 *
		 * @type {string}
		 */ this.resourcePath = '';
        /**
		 * The [request header]{@link https://developer.mozilla.org/en-US/docs/Glossary/Request_header}
		 * used in HTTP request.
		 *
		 * @type {Object<string, any>}
		 */ this.requestHeader = {};
    }
}
/**
 * Callback for onProgress in loaders.
 *
 * @callback onProgressCallback
 * @param {ProgressEvent} event - An instance of `ProgressEvent` that represents the current loading status.
 */ /**
 * Callback for onError in loaders.
 *
 * @callback onErrorCallback
 * @param {Error} error - The error which occurred during the loading process.
 */ /**
 * The default material name that is used by loaders
 * when creating materials for loaded 3D objects.
 *
 * Note: Not all loaders might honor this setting.
 *
 * @static
 * @type {string}
 * @default '__DEFAULT'
 */ Loader.DEFAULT_MATERIAL_NAME = '__DEFAULT';
;
}),
"[project]/frontend/landing/node_modules/three/src/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "arrayMax",
    ()=>arrayMax,
    "arrayMin",
    ()=>arrayMin,
    "arrayNeedsUint32",
    ()=>arrayNeedsUint32,
    "createCanvasElement",
    ()=>createCanvasElement,
    "createElementNS",
    ()=>createElementNS,
    "getTypedArray",
    ()=>getTypedArray,
    "probeAsync",
    ()=>probeAsync,
    "toNormalizedProjectionMatrix",
    ()=>toNormalizedProjectionMatrix,
    "toReversedProjectionMatrix",
    ()=>toReversedProjectionMatrix,
    "warnOnce",
    ()=>warnOnce
]);
function arrayMin(array) {
    if (array.length === 0) return Infinity;
    let min = array[0];
    for(let i = 1, l = array.length; i < l; ++i){
        if (array[i] < min) min = array[i];
    }
    return min;
}
function arrayMax(array) {
    if (array.length === 0) return -Infinity;
    let max = array[0];
    for(let i = 1, l = array.length; i < l; ++i){
        if (array[i] > max) max = array[i];
    }
    return max;
}
function arrayNeedsUint32(array) {
    // assumes larger values usually on last
    for(let i = array.length - 1; i >= 0; --i){
        if (array[i] >= 65535) return true; // account for PRIMITIVE_RESTART_FIXED_INDEX, #24565
    }
    return false;
}
const TYPED_ARRAYS = {
    Int8Array: Int8Array,
    Uint8Array: Uint8Array,
    Uint8ClampedArray: Uint8ClampedArray,
    Int16Array: Int16Array,
    Uint16Array: Uint16Array,
    Int32Array: Int32Array,
    Uint32Array: Uint32Array,
    Float32Array: Float32Array,
    Float64Array: Float64Array
};
function getTypedArray(type, buffer) {
    return new TYPED_ARRAYS[type](buffer);
}
function createElementNS(name) {
    return document.createElementNS('http://www.w3.org/1999/xhtml', name);
}
function createCanvasElement() {
    const canvas = createElementNS('canvas');
    canvas.style.display = 'block';
    return canvas;
}
const _cache = {};
function warnOnce(message) {
    if (message in _cache) return;
    _cache[message] = true;
    console.warn(message);
}
function probeAsync(gl, sync, interval) {
    return new Promise(function(resolve, reject) {
        function probe() {
            switch(gl.clientWaitSync(sync, gl.SYNC_FLUSH_COMMANDS_BIT, 0)){
                case gl.WAIT_FAILED:
                    reject();
                    break;
                case gl.TIMEOUT_EXPIRED:
                    setTimeout(probe, interval);
                    break;
                default:
                    resolve();
            }
        }
        setTimeout(probe, interval);
    });
}
function toNormalizedProjectionMatrix(projectionMatrix) {
    const m = projectionMatrix.elements;
    // Convert [-1, 1] to [0, 1] projection matrix
    m[2] = 0.5 * m[2] + 0.5 * m[3];
    m[6] = 0.5 * m[6] + 0.5 * m[7];
    m[10] = 0.5 * m[10] + 0.5 * m[11];
    m[14] = 0.5 * m[14] + 0.5 * m[15];
}
function toReversedProjectionMatrix(projectionMatrix) {
    const m = projectionMatrix.elements;
    const isPerspectiveMatrix = m[11] === -1;
    // Reverse [0, 1] projection matrix
    if (isPerspectiveMatrix) {
        m[10] = -m[10] - 1;
        m[14] = -m[14];
    } else {
        m[10] = -m[10];
        m[14] = -m[14] + 1;
    }
}
;
}),
"[project]/frontend/landing/node_modules/three/src/loaders/ImageLoader.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImageLoader",
    ()=>ImageLoader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Cache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/loaders/Cache.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/loaders/Loader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/utils.js [app-client] (ecmascript)");
;
;
;
const _loading = new WeakMap();
/**
 * A loader for loading images. The class loads images with the HTML `Image` API.
 *
 * ```js
 * const loader = new THREE.ImageLoader();
 * const image = await loader.loadAsync( 'image.png' );
 * ```
 * Please note that `ImageLoader` has dropped support for progress
 * events in `r84`. For an `ImageLoader` that supports progress events, see
 * [this thread]{@link https://github.com/mrdoob/three.js/issues/10439#issuecomment-275785639}.
 *
 * @augments Loader
 */ class ImageLoader extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Loader"] {
    /**
	 * Starts loading from the given URL and passes the loaded image
	 * to the `onLoad()` callback. The method also returns a new `Image` object which can
	 * directly be used for texture creation. If you do it this way, the texture
	 * may pop up in your scene once the respective loading process is finished.
	 *
	 * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	 * @param {function(Image)} onLoad - Executed when the loading process has been finished.
	 * @param {onProgressCallback} onProgress - Unsupported in this loader.
	 * @param {onErrorCallback} onError - Executed when errors occur.
	 * @return {Image} The image.
	 */ load(url, onLoad, onProgress, onError) {
        if (this.path !== undefined) url = this.path + url;
        url = this.manager.resolveURL(url);
        const scope = this;
        const cached = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Cache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cache"].get("image:".concat(url));
        if (cached !== undefined) {
            if (cached.complete === true) {
                scope.manager.itemStart(url);
                setTimeout(function() {
                    if (onLoad) onLoad(cached);
                    scope.manager.itemEnd(url);
                }, 0);
            } else {
                let arr = _loading.get(cached);
                if (arr === undefined) {
                    arr = [];
                    _loading.set(cached, arr);
                }
                arr.push({
                    onLoad,
                    onError
                });
            }
            return cached;
        }
        const image = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElementNS"])('img');
        function onImageLoad() {
            removeEventListeners();
            if (onLoad) onLoad(this);
            //
            const callbacks = _loading.get(this) || [];
            for(let i = 0; i < callbacks.length; i++){
                const callback = callbacks[i];
                if (callback.onLoad) callback.onLoad(this);
            }
            _loading.delete(this);
            scope.manager.itemEnd(url);
        }
        function onImageError(event) {
            removeEventListeners();
            if (onError) onError(event);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Cache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cache"].remove("image:".concat(url));
            //
            const callbacks = _loading.get(this) || [];
            for(let i = 0; i < callbacks.length; i++){
                const callback = callbacks[i];
                if (callback.onError) callback.onError(event);
            }
            _loading.delete(this);
            scope.manager.itemError(url);
            scope.manager.itemEnd(url);
        }
        function removeEventListeners() {
            image.removeEventListener('load', onImageLoad, false);
            image.removeEventListener('error', onImageError, false);
        }
        image.addEventListener('load', onImageLoad, false);
        image.addEventListener('error', onImageError, false);
        if (url.slice(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) image.crossOrigin = this.crossOrigin;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Cache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cache"].add("image:".concat(url), image);
        scope.manager.itemStart(url);
        image.src = url;
        return image;
    }
    /**
	 * Constructs a new image loader.
	 *
	 * @param {LoadingManager} [manager] - The loading manager.
	 */ constructor(manager){
        super(manager);
    }
}
;
}),
"[project]/frontend/landing/node_modules/three/src/core/EventDispatcher.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * This modules allows to dispatch event objects on custom JavaScript objects.
 *
 * Main repository: [eventdispatcher.js]{@link https://github.com/mrdoob/eventdispatcher.js/}
 *
 * Code Example:
 * ```js
 * class Car extends EventDispatcher {
 * 	start() {
 *		this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
 *	}
 *};
 *
 * // Using events with the custom object
 * const car = new Car();
 * car.addEventListener( 'start', function ( event ) {
 * 	alert( event.message );
 * } );
 *
 * car.start();
 * ```
 */ __turbopack_context__.s([
    "EventDispatcher",
    ()=>EventDispatcher
]);
class EventDispatcher {
    /**
	 * Adds the given event listener to the given event type.
	 *
	 * @param {string} type - The type of event to listen to.
	 * @param {Function} listener - The function that gets called when the event is fired.
	 */ addEventListener(type, listener) {
        if (this._listeners === undefined) this._listeners = {};
        const listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    }
    /**
	 * Returns `true` if the given event listener has been added to the given event type.
	 *
	 * @param {string} type - The type of event.
	 * @param {Function} listener - The listener to check.
	 * @return {boolean} Whether the given event listener has been added to the given event type.
	 */ hasEventListener(type, listener) {
        const listeners = this._listeners;
        if (listeners === undefined) return false;
        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
    }
    /**
	 * Removes the given event listener from the given event type.
	 *
	 * @param {string} type - The type of event.
	 * @param {Function} listener - The listener to remove.
	 */ removeEventListener(type, listener) {
        const listeners = this._listeners;
        if (listeners === undefined) return;
        const listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            const index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    }
    /**
	 * Dispatches an event object.
	 *
	 * @param {Object} event - The event that gets fired.
	 */ dispatchEvent(event) {
        const listeners = this._listeners;
        if (listeners === undefined) return;
        const listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            // Make a copy, in case listeners are removed while iterating.
            const array = listenerArray.slice(0);
            for(let i = 0, l = array.length; i < l; i++){
                array[i].call(this, event);
            }
            event.target = null;
        }
    }
}
;
}),
"[project]/frontend/landing/node_modules/three/src/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACESFilmicToneMapping",
    ()=>ACESFilmicToneMapping,
    "AddEquation",
    ()=>AddEquation,
    "AddOperation",
    ()=>AddOperation,
    "AdditiveAnimationBlendMode",
    ()=>AdditiveAnimationBlendMode,
    "AdditiveBlending",
    ()=>AdditiveBlending,
    "AgXToneMapping",
    ()=>AgXToneMapping,
    "AlphaFormat",
    ()=>AlphaFormat,
    "AlwaysCompare",
    ()=>AlwaysCompare,
    "AlwaysDepth",
    ()=>AlwaysDepth,
    "AlwaysStencilFunc",
    ()=>AlwaysStencilFunc,
    "AttachedBindMode",
    ()=>AttachedBindMode,
    "BackSide",
    ()=>BackSide,
    "BasicDepthPacking",
    ()=>BasicDepthPacking,
    "BasicShadowMap",
    ()=>BasicShadowMap,
    "ByteType",
    ()=>ByteType,
    "CineonToneMapping",
    ()=>CineonToneMapping,
    "ClampToEdgeWrapping",
    ()=>ClampToEdgeWrapping,
    "ConstantAlphaFactor",
    ()=>ConstantAlphaFactor,
    "ConstantColorFactor",
    ()=>ConstantColorFactor,
    "CubeReflectionMapping",
    ()=>CubeReflectionMapping,
    "CubeRefractionMapping",
    ()=>CubeRefractionMapping,
    "CubeUVReflectionMapping",
    ()=>CubeUVReflectionMapping,
    "CullFaceBack",
    ()=>CullFaceBack,
    "CullFaceFront",
    ()=>CullFaceFront,
    "CullFaceFrontBack",
    ()=>CullFaceFrontBack,
    "CullFaceNone",
    ()=>CullFaceNone,
    "CustomBlending",
    ()=>CustomBlending,
    "CustomToneMapping",
    ()=>CustomToneMapping,
    "DecrementStencilOp",
    ()=>DecrementStencilOp,
    "DecrementWrapStencilOp",
    ()=>DecrementWrapStencilOp,
    "DepthFormat",
    ()=>DepthFormat,
    "DepthStencilFormat",
    ()=>DepthStencilFormat,
    "DetachedBindMode",
    ()=>DetachedBindMode,
    "DoubleSide",
    ()=>DoubleSide,
    "DstAlphaFactor",
    ()=>DstAlphaFactor,
    "DstColorFactor",
    ()=>DstColorFactor,
    "DynamicCopyUsage",
    ()=>DynamicCopyUsage,
    "DynamicDrawUsage",
    ()=>DynamicDrawUsage,
    "DynamicReadUsage",
    ()=>DynamicReadUsage,
    "EqualCompare",
    ()=>EqualCompare,
    "EqualDepth",
    ()=>EqualDepth,
    "EqualStencilFunc",
    ()=>EqualStencilFunc,
    "EquirectangularReflectionMapping",
    ()=>EquirectangularReflectionMapping,
    "EquirectangularRefractionMapping",
    ()=>EquirectangularRefractionMapping,
    "FloatType",
    ()=>FloatType,
    "FrontSide",
    ()=>FrontSide,
    "GLSL1",
    ()=>GLSL1,
    "GLSL3",
    ()=>GLSL3,
    "GreaterCompare",
    ()=>GreaterCompare,
    "GreaterDepth",
    ()=>GreaterDepth,
    "GreaterEqualCompare",
    ()=>GreaterEqualCompare,
    "GreaterEqualDepth",
    ()=>GreaterEqualDepth,
    "GreaterEqualStencilFunc",
    ()=>GreaterEqualStencilFunc,
    "GreaterStencilFunc",
    ()=>GreaterStencilFunc,
    "HalfFloatType",
    ()=>HalfFloatType,
    "IncrementStencilOp",
    ()=>IncrementStencilOp,
    "IncrementWrapStencilOp",
    ()=>IncrementWrapStencilOp,
    "IntType",
    ()=>IntType,
    "InterpolateDiscrete",
    ()=>InterpolateDiscrete,
    "InterpolateLinear",
    ()=>InterpolateLinear,
    "InterpolateSmooth",
    ()=>InterpolateSmooth,
    "InterpolationSamplingMode",
    ()=>InterpolationSamplingMode,
    "InterpolationSamplingType",
    ()=>InterpolationSamplingType,
    "InvertStencilOp",
    ()=>InvertStencilOp,
    "KeepStencilOp",
    ()=>KeepStencilOp,
    "LessCompare",
    ()=>LessCompare,
    "LessDepth",
    ()=>LessDepth,
    "LessEqualCompare",
    ()=>LessEqualCompare,
    "LessEqualDepth",
    ()=>LessEqualDepth,
    "LessEqualStencilFunc",
    ()=>LessEqualStencilFunc,
    "LessStencilFunc",
    ()=>LessStencilFunc,
    "LinearFilter",
    ()=>LinearFilter,
    "LinearMipMapLinearFilter",
    ()=>LinearMipMapLinearFilter,
    "LinearMipMapNearestFilter",
    ()=>LinearMipMapNearestFilter,
    "LinearMipmapLinearFilter",
    ()=>LinearMipmapLinearFilter,
    "LinearMipmapNearestFilter",
    ()=>LinearMipmapNearestFilter,
    "LinearSRGBColorSpace",
    ()=>LinearSRGBColorSpace,
    "LinearToneMapping",
    ()=>LinearToneMapping,
    "LinearTransfer",
    ()=>LinearTransfer,
    "LoopOnce",
    ()=>LoopOnce,
    "LoopPingPong",
    ()=>LoopPingPong,
    "LoopRepeat",
    ()=>LoopRepeat,
    "MOUSE",
    ()=>MOUSE,
    "MaxEquation",
    ()=>MaxEquation,
    "MinEquation",
    ()=>MinEquation,
    "MirroredRepeatWrapping",
    ()=>MirroredRepeatWrapping,
    "MixOperation",
    ()=>MixOperation,
    "MultiplyBlending",
    ()=>MultiplyBlending,
    "MultiplyOperation",
    ()=>MultiplyOperation,
    "NearestFilter",
    ()=>NearestFilter,
    "NearestMipMapLinearFilter",
    ()=>NearestMipMapLinearFilter,
    "NearestMipMapNearestFilter",
    ()=>NearestMipMapNearestFilter,
    "NearestMipmapLinearFilter",
    ()=>NearestMipmapLinearFilter,
    "NearestMipmapNearestFilter",
    ()=>NearestMipmapNearestFilter,
    "NeutralToneMapping",
    ()=>NeutralToneMapping,
    "NeverCompare",
    ()=>NeverCompare,
    "NeverDepth",
    ()=>NeverDepth,
    "NeverStencilFunc",
    ()=>NeverStencilFunc,
    "NoBlending",
    ()=>NoBlending,
    "NoColorSpace",
    ()=>NoColorSpace,
    "NoToneMapping",
    ()=>NoToneMapping,
    "NormalAnimationBlendMode",
    ()=>NormalAnimationBlendMode,
    "NormalBlending",
    ()=>NormalBlending,
    "NotEqualCompare",
    ()=>NotEqualCompare,
    "NotEqualDepth",
    ()=>NotEqualDepth,
    "NotEqualStencilFunc",
    ()=>NotEqualStencilFunc,
    "ObjectSpaceNormalMap",
    ()=>ObjectSpaceNormalMap,
    "OneFactor",
    ()=>OneFactor,
    "OneMinusConstantAlphaFactor",
    ()=>OneMinusConstantAlphaFactor,
    "OneMinusConstantColorFactor",
    ()=>OneMinusConstantColorFactor,
    "OneMinusDstAlphaFactor",
    ()=>OneMinusDstAlphaFactor,
    "OneMinusDstColorFactor",
    ()=>OneMinusDstColorFactor,
    "OneMinusSrcAlphaFactor",
    ()=>OneMinusSrcAlphaFactor,
    "OneMinusSrcColorFactor",
    ()=>OneMinusSrcColorFactor,
    "PCFShadowMap",
    ()=>PCFShadowMap,
    "PCFSoftShadowMap",
    ()=>PCFSoftShadowMap,
    "RED_GREEN_RGTC2_Format",
    ()=>RED_GREEN_RGTC2_Format,
    "RED_RGTC1_Format",
    ()=>RED_RGTC1_Format,
    "REVISION",
    ()=>REVISION,
    "RGBADepthPacking",
    ()=>RGBADepthPacking,
    "RGBAFormat",
    ()=>RGBAFormat,
    "RGBAIntegerFormat",
    ()=>RGBAIntegerFormat,
    "RGBA_ASTC_10x10_Format",
    ()=>RGBA_ASTC_10x10_Format,
    "RGBA_ASTC_10x5_Format",
    ()=>RGBA_ASTC_10x5_Format,
    "RGBA_ASTC_10x6_Format",
    ()=>RGBA_ASTC_10x6_Format,
    "RGBA_ASTC_10x8_Format",
    ()=>RGBA_ASTC_10x8_Format,
    "RGBA_ASTC_12x10_Format",
    ()=>RGBA_ASTC_12x10_Format,
    "RGBA_ASTC_12x12_Format",
    ()=>RGBA_ASTC_12x12_Format,
    "RGBA_ASTC_4x4_Format",
    ()=>RGBA_ASTC_4x4_Format,
    "RGBA_ASTC_5x4_Format",
    ()=>RGBA_ASTC_5x4_Format,
    "RGBA_ASTC_5x5_Format",
    ()=>RGBA_ASTC_5x5_Format,
    "RGBA_ASTC_6x5_Format",
    ()=>RGBA_ASTC_6x5_Format,
    "RGBA_ASTC_6x6_Format",
    ()=>RGBA_ASTC_6x6_Format,
    "RGBA_ASTC_8x5_Format",
    ()=>RGBA_ASTC_8x5_Format,
    "RGBA_ASTC_8x6_Format",
    ()=>RGBA_ASTC_8x6_Format,
    "RGBA_ASTC_8x8_Format",
    ()=>RGBA_ASTC_8x8_Format,
    "RGBA_BPTC_Format",
    ()=>RGBA_BPTC_Format,
    "RGBA_ETC2_EAC_Format",
    ()=>RGBA_ETC2_EAC_Format,
    "RGBA_PVRTC_2BPPV1_Format",
    ()=>RGBA_PVRTC_2BPPV1_Format,
    "RGBA_PVRTC_4BPPV1_Format",
    ()=>RGBA_PVRTC_4BPPV1_Format,
    "RGBA_S3TC_DXT1_Format",
    ()=>RGBA_S3TC_DXT1_Format,
    "RGBA_S3TC_DXT3_Format",
    ()=>RGBA_S3TC_DXT3_Format,
    "RGBA_S3TC_DXT5_Format",
    ()=>RGBA_S3TC_DXT5_Format,
    "RGBDepthPacking",
    ()=>RGBDepthPacking,
    "RGBFormat",
    ()=>RGBFormat,
    "RGBIntegerFormat",
    ()=>RGBIntegerFormat,
    "RGB_BPTC_SIGNED_Format",
    ()=>RGB_BPTC_SIGNED_Format,
    "RGB_BPTC_UNSIGNED_Format",
    ()=>RGB_BPTC_UNSIGNED_Format,
    "RGB_ETC1_Format",
    ()=>RGB_ETC1_Format,
    "RGB_ETC2_Format",
    ()=>RGB_ETC2_Format,
    "RGB_PVRTC_2BPPV1_Format",
    ()=>RGB_PVRTC_2BPPV1_Format,
    "RGB_PVRTC_4BPPV1_Format",
    ()=>RGB_PVRTC_4BPPV1_Format,
    "RGB_S3TC_DXT1_Format",
    ()=>RGB_S3TC_DXT1_Format,
    "RGDepthPacking",
    ()=>RGDepthPacking,
    "RGFormat",
    ()=>RGFormat,
    "RGIntegerFormat",
    ()=>RGIntegerFormat,
    "RedFormat",
    ()=>RedFormat,
    "RedIntegerFormat",
    ()=>RedIntegerFormat,
    "ReinhardToneMapping",
    ()=>ReinhardToneMapping,
    "RepeatWrapping",
    ()=>RepeatWrapping,
    "ReplaceStencilOp",
    ()=>ReplaceStencilOp,
    "ReverseSubtractEquation",
    ()=>ReverseSubtractEquation,
    "SIGNED_RED_GREEN_RGTC2_Format",
    ()=>SIGNED_RED_GREEN_RGTC2_Format,
    "SIGNED_RED_RGTC1_Format",
    ()=>SIGNED_RED_RGTC1_Format,
    "SRGBColorSpace",
    ()=>SRGBColorSpace,
    "SRGBTransfer",
    ()=>SRGBTransfer,
    "ShortType",
    ()=>ShortType,
    "SrcAlphaFactor",
    ()=>SrcAlphaFactor,
    "SrcAlphaSaturateFactor",
    ()=>SrcAlphaSaturateFactor,
    "SrcColorFactor",
    ()=>SrcColorFactor,
    "StaticCopyUsage",
    ()=>StaticCopyUsage,
    "StaticDrawUsage",
    ()=>StaticDrawUsage,
    "StaticReadUsage",
    ()=>StaticReadUsage,
    "StreamCopyUsage",
    ()=>StreamCopyUsage,
    "StreamDrawUsage",
    ()=>StreamDrawUsage,
    "StreamReadUsage",
    ()=>StreamReadUsage,
    "SubtractEquation",
    ()=>SubtractEquation,
    "SubtractiveBlending",
    ()=>SubtractiveBlending,
    "TOUCH",
    ()=>TOUCH,
    "TangentSpaceNormalMap",
    ()=>TangentSpaceNormalMap,
    "TimestampQuery",
    ()=>TimestampQuery,
    "TriangleFanDrawMode",
    ()=>TriangleFanDrawMode,
    "TriangleStripDrawMode",
    ()=>TriangleStripDrawMode,
    "TrianglesDrawMode",
    ()=>TrianglesDrawMode,
    "UVMapping",
    ()=>UVMapping,
    "UnsignedByteType",
    ()=>UnsignedByteType,
    "UnsignedInt101111Type",
    ()=>UnsignedInt101111Type,
    "UnsignedInt248Type",
    ()=>UnsignedInt248Type,
    "UnsignedInt5999Type",
    ()=>UnsignedInt5999Type,
    "UnsignedIntType",
    ()=>UnsignedIntType,
    "UnsignedShort4444Type",
    ()=>UnsignedShort4444Type,
    "UnsignedShort5551Type",
    ()=>UnsignedShort5551Type,
    "UnsignedShortType",
    ()=>UnsignedShortType,
    "VSMShadowMap",
    ()=>VSMShadowMap,
    "WebGLCoordinateSystem",
    ()=>WebGLCoordinateSystem,
    "WebGPUCoordinateSystem",
    ()=>WebGPUCoordinateSystem,
    "WrapAroundEnding",
    ()=>WrapAroundEnding,
    "ZeroCurvatureEnding",
    ()=>ZeroCurvatureEnding,
    "ZeroFactor",
    ()=>ZeroFactor,
    "ZeroSlopeEnding",
    ()=>ZeroSlopeEnding,
    "ZeroStencilOp",
    ()=>ZeroStencilOp
]);
const REVISION = '180';
const MOUSE = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2
};
const TOUCH = {
    ROTATE: 0,
    PAN: 1,
    DOLLY_PAN: 2,
    DOLLY_ROTATE: 3
};
const CullFaceNone = 0;
const CullFaceBack = 1;
const CullFaceFront = 2;
const CullFaceFrontBack = 3;
const BasicShadowMap = 0;
const PCFShadowMap = 1;
const PCFSoftShadowMap = 2;
const VSMShadowMap = 3;
const FrontSide = 0;
const BackSide = 1;
const DoubleSide = 2;
const NoBlending = 0;
const NormalBlending = 1;
const AdditiveBlending = 2;
const SubtractiveBlending = 3;
const MultiplyBlending = 4;
const CustomBlending = 5;
const AddEquation = 100;
const SubtractEquation = 101;
const ReverseSubtractEquation = 102;
const MinEquation = 103;
const MaxEquation = 104;
const ZeroFactor = 200;
const OneFactor = 201;
const SrcColorFactor = 202;
const OneMinusSrcColorFactor = 203;
const SrcAlphaFactor = 204;
const OneMinusSrcAlphaFactor = 205;
const DstAlphaFactor = 206;
const OneMinusDstAlphaFactor = 207;
const DstColorFactor = 208;
const OneMinusDstColorFactor = 209;
const SrcAlphaSaturateFactor = 210;
const ConstantColorFactor = 211;
const OneMinusConstantColorFactor = 212;
const ConstantAlphaFactor = 213;
const OneMinusConstantAlphaFactor = 214;
const NeverDepth = 0;
const AlwaysDepth = 1;
const LessDepth = 2;
const LessEqualDepth = 3;
const EqualDepth = 4;
const GreaterEqualDepth = 5;
const GreaterDepth = 6;
const NotEqualDepth = 7;
const MultiplyOperation = 0;
const MixOperation = 1;
const AddOperation = 2;
const NoToneMapping = 0;
const LinearToneMapping = 1;
const ReinhardToneMapping = 2;
const CineonToneMapping = 3;
const ACESFilmicToneMapping = 4;
const CustomToneMapping = 5;
const AgXToneMapping = 6;
const NeutralToneMapping = 7;
const AttachedBindMode = 'attached';
const DetachedBindMode = 'detached';
const UVMapping = 300;
const CubeReflectionMapping = 301;
const CubeRefractionMapping = 302;
const EquirectangularReflectionMapping = 303;
const EquirectangularRefractionMapping = 304;
const CubeUVReflectionMapping = 306;
const RepeatWrapping = 1000;
const ClampToEdgeWrapping = 1001;
const MirroredRepeatWrapping = 1002;
const NearestFilter = 1003;
const NearestMipmapNearestFilter = 1004;
const NearestMipMapNearestFilter = 1004; // legacy
const NearestMipmapLinearFilter = 1005;
const NearestMipMapLinearFilter = 1005; // legacy
const LinearFilter = 1006;
const LinearMipmapNearestFilter = 1007;
const LinearMipMapNearestFilter = 1007; // legacy
const LinearMipmapLinearFilter = 1008;
const LinearMipMapLinearFilter = 1008; // legacy
const UnsignedByteType = 1009;
const ByteType = 1010;
const ShortType = 1011;
const UnsignedShortType = 1012;
const IntType = 1013;
const UnsignedIntType = 1014;
const FloatType = 1015;
const HalfFloatType = 1016;
const UnsignedShort4444Type = 1017;
const UnsignedShort5551Type = 1018;
const UnsignedInt248Type = 1020;
const UnsignedInt5999Type = 35902;
const UnsignedInt101111Type = 35899;
const AlphaFormat = 1021;
const RGBFormat = 1022;
const RGBAFormat = 1023;
const DepthFormat = 1026;
const DepthStencilFormat = 1027;
const RedFormat = 1028;
const RedIntegerFormat = 1029;
const RGFormat = 1030;
const RGIntegerFormat = 1031;
const RGBIntegerFormat = 1032;
const RGBAIntegerFormat = 1033;
const RGB_S3TC_DXT1_Format = 33776;
const RGBA_S3TC_DXT1_Format = 33777;
const RGBA_S3TC_DXT3_Format = 33778;
const RGBA_S3TC_DXT5_Format = 33779;
const RGB_PVRTC_4BPPV1_Format = 35840;
const RGB_PVRTC_2BPPV1_Format = 35841;
const RGBA_PVRTC_4BPPV1_Format = 35842;
const RGBA_PVRTC_2BPPV1_Format = 35843;
const RGB_ETC1_Format = 36196;
const RGB_ETC2_Format = 37492;
const RGBA_ETC2_EAC_Format = 37496;
const RGBA_ASTC_4x4_Format = 37808;
const RGBA_ASTC_5x4_Format = 37809;
const RGBA_ASTC_5x5_Format = 37810;
const RGBA_ASTC_6x5_Format = 37811;
const RGBA_ASTC_6x6_Format = 37812;
const RGBA_ASTC_8x5_Format = 37813;
const RGBA_ASTC_8x6_Format = 37814;
const RGBA_ASTC_8x8_Format = 37815;
const RGBA_ASTC_10x5_Format = 37816;
const RGBA_ASTC_10x6_Format = 37817;
const RGBA_ASTC_10x8_Format = 37818;
const RGBA_ASTC_10x10_Format = 37819;
const RGBA_ASTC_12x10_Format = 37820;
const RGBA_ASTC_12x12_Format = 37821;
const RGBA_BPTC_Format = 36492;
const RGB_BPTC_SIGNED_Format = 36494;
const RGB_BPTC_UNSIGNED_Format = 36495;
const RED_RGTC1_Format = 36283;
const SIGNED_RED_RGTC1_Format = 36284;
const RED_GREEN_RGTC2_Format = 36285;
const SIGNED_RED_GREEN_RGTC2_Format = 36286;
const LoopOnce = 2200;
const LoopRepeat = 2201;
const LoopPingPong = 2202;
const InterpolateDiscrete = 2300;
const InterpolateLinear = 2301;
const InterpolateSmooth = 2302;
const ZeroCurvatureEnding = 2400;
const ZeroSlopeEnding = 2401;
const WrapAroundEnding = 2402;
const NormalAnimationBlendMode = 2500;
const AdditiveAnimationBlendMode = 2501;
const TrianglesDrawMode = 0;
const TriangleStripDrawMode = 1;
const TriangleFanDrawMode = 2;
const BasicDepthPacking = 3200;
const RGBADepthPacking = 3201;
const RGBDepthPacking = 3202;
const RGDepthPacking = 3203;
const TangentSpaceNormalMap = 0;
const ObjectSpaceNormalMap = 1;
const NoColorSpace = '';
const SRGBColorSpace = 'srgb';
const LinearSRGBColorSpace = 'srgb-linear';
const LinearTransfer = 'linear';
const SRGBTransfer = 'srgb';
const ZeroStencilOp = 0;
const KeepStencilOp = 7680;
const ReplaceStencilOp = 7681;
const IncrementStencilOp = 7682;
const DecrementStencilOp = 7683;
const IncrementWrapStencilOp = 34055;
const DecrementWrapStencilOp = 34056;
const InvertStencilOp = 5386;
const NeverStencilFunc = 512;
const LessStencilFunc = 513;
const EqualStencilFunc = 514;
const LessEqualStencilFunc = 515;
const GreaterStencilFunc = 516;
const NotEqualStencilFunc = 517;
const GreaterEqualStencilFunc = 518;
const AlwaysStencilFunc = 519;
const NeverCompare = 512;
const LessCompare = 513;
const EqualCompare = 514;
const LessEqualCompare = 515;
const GreaterCompare = 516;
const NotEqualCompare = 517;
const GreaterEqualCompare = 518;
const AlwaysCompare = 519;
const StaticDrawUsage = 35044;
const DynamicDrawUsage = 35048;
const StreamDrawUsage = 35040;
const StaticReadUsage = 35045;
const DynamicReadUsage = 35049;
const StreamReadUsage = 35041;
const StaticCopyUsage = 35046;
const DynamicCopyUsage = 35050;
const StreamCopyUsage = 35042;
const GLSL1 = '100';
const GLSL3 = '300 es';
const WebGLCoordinateSystem = 2000;
const WebGPUCoordinateSystem = 2001;
const TimestampQuery = {
    COMPUTE: 'compute',
    RENDER: 'render'
};
const InterpolationSamplingType = {
    PERSPECTIVE: 'perspective',
    LINEAR: 'linear',
    FLAT: 'flat'
};
const InterpolationSamplingMode = {
    NORMAL: 'normal',
    CENTROID: 'centroid',
    SAMPLE: 'sample',
    FIRST: 'first',
    EITHER: 'either'
}; /**
 * This type represents mouse buttons and interaction types in context of controls.
 *
 * @typedef {Object} ConstantsMouse
 * @property {number} MIDDLE - The left mouse button.
 * @property {number} LEFT - The middle mouse button.
 * @property {number} RIGHT - The right mouse button.
 * @property {number} ROTATE - A rotate interaction.
 * @property {number} DOLLY - A dolly interaction.
 * @property {number} PAN - A pan interaction.
 **/  /**
 * This type represents touch interaction types in context of controls.
 *
 * @typedef {Object} ConstantsTouch
 * @property {number} ROTATE - A rotate interaction.
 * @property {number} PAN - A pan interaction.
 * @property {number} DOLLY_PAN - The dolly-pan interaction.
 * @property {number} DOLLY_ROTATE - A dolly-rotate interaction.
 **/  /**
 * This type represents the different timestamp query types.
 *
 * @typedef {Object} ConstantsTimestampQuery
 * @property {string} COMPUTE - A `compute` timestamp query.
 * @property {string} RENDER - A `render` timestamp query.
 **/  /**
 * Represents the different interpolation sampling types.
 *
 * @typedef {Object} ConstantsInterpolationSamplingType
 * @property {string} PERSPECTIVE - Perspective-correct interpolation.
 * @property {string} LINEAR - Linear interpolation.
 * @property {string} FLAT - Flat interpolation.
 */  /**
 * Represents the different interpolation sampling modes.
 *
 * @typedef {Object} ConstantsInterpolationSamplingMode
 * @property {string} NORMAL - Normal sampling mode.
 * @property {string} CENTROID - Centroid sampling mode.
 * @property {string} SAMPLE - Sample-specific sampling mode.
 * @property {string} FIRST - Flat interpolation using the first vertex.
 * @property {string} EITHER - Flat interpolation using either vertex.
 */ 
}),
"[project]/frontend/landing/node_modules/three/src/math/MathUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEG2RAD",
    ()=>DEG2RAD,
    "MathUtils",
    ()=>MathUtils,
    "RAD2DEG",
    ()=>RAD2DEG,
    "ceilPowerOfTwo",
    ()=>ceilPowerOfTwo,
    "clamp",
    ()=>clamp,
    "damp",
    ()=>damp,
    "degToRad",
    ()=>degToRad,
    "denormalize",
    ()=>denormalize,
    "euclideanModulo",
    ()=>euclideanModulo,
    "floorPowerOfTwo",
    ()=>floorPowerOfTwo,
    "generateUUID",
    ()=>generateUUID,
    "inverseLerp",
    ()=>inverseLerp,
    "isPowerOfTwo",
    ()=>isPowerOfTwo,
    "lerp",
    ()=>lerp,
    "mapLinear",
    ()=>mapLinear,
    "normalize",
    ()=>normalize,
    "pingpong",
    ()=>pingpong,
    "radToDeg",
    ()=>radToDeg,
    "randFloat",
    ()=>randFloat,
    "randFloatSpread",
    ()=>randFloatSpread,
    "randInt",
    ()=>randInt,
    "seededRandom",
    ()=>seededRandom,
    "setQuaternionFromProperEuler",
    ()=>setQuaternionFromProperEuler,
    "smootherstep",
    ()=>smootherstep,
    "smoothstep",
    ()=>smoothstep
]);
const _lut = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '0a',
    '0b',
    '0c',
    '0d',
    '0e',
    '0f',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '1a',
    '1b',
    '1c',
    '1d',
    '1e',
    '1f',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '2a',
    '2b',
    '2c',
    '2d',
    '2e',
    '2f',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '3a',
    '3b',
    '3c',
    '3d',
    '3e',
    '3f',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '4a',
    '4b',
    '4c',
    '4d',
    '4e',
    '4f',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '5a',
    '5b',
    '5c',
    '5d',
    '5e',
    '5f',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '6a',
    '6b',
    '6c',
    '6d',
    '6e',
    '6f',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '7a',
    '7b',
    '7c',
    '7d',
    '7e',
    '7f',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '8a',
    '8b',
    '8c',
    '8d',
    '8e',
    '8f',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
    '9a',
    '9b',
    '9c',
    '9d',
    '9e',
    '9f',
    'a0',
    'a1',
    'a2',
    'a3',
    'a4',
    'a5',
    'a6',
    'a7',
    'a8',
    'a9',
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
    'b0',
    'b1',
    'b2',
    'b3',
    'b4',
    'b5',
    'b6',
    'b7',
    'b8',
    'b9',
    'ba',
    'bb',
    'bc',
    'bd',
    'be',
    'bf',
    'c0',
    'c1',
    'c2',
    'c3',
    'c4',
    'c5',
    'c6',
    'c7',
    'c8',
    'c9',
    'ca',
    'cb',
    'cc',
    'cd',
    'ce',
    'cf',
    'd0',
    'd1',
    'd2',
    'd3',
    'd4',
    'd5',
    'd6',
    'd7',
    'd8',
    'd9',
    'da',
    'db',
    'dc',
    'dd',
    'de',
    'df',
    'e0',
    'e1',
    'e2',
    'e3',
    'e4',
    'e5',
    'e6',
    'e7',
    'e8',
    'e9',
    'ea',
    'eb',
    'ec',
    'ed',
    'ee',
    'ef',
    'f0',
    'f1',
    'f2',
    'f3',
    'f4',
    'f5',
    'f6',
    'f7',
    'f8',
    'f9',
    'fa',
    'fb',
    'fc',
    'fd',
    'fe',
    'ff'
];
let _seed = 1234567;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
/**
 * Generate a [UUID]{@link https://en.wikipedia.org/wiki/Universally_unique_identifier}
 * (universally unique identifier).
 *
 * @return {string} The UUID.
 */ function generateUUID() {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
    const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' + _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' + _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] + _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];
    // .toLowerCase() here flattens concatenated strings to save heap memory space.
    return uuid.toLowerCase();
}
/**
 * Clamps the given value between min and max.
 *
 * @param {number} value - The value to clamp.
 * @param {number} min - The min value.
 * @param {number} max - The max value.
 * @return {number} The clamped value.
 */ function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
/**
 * Computes the Euclidean modulo of the given parameters that
 * is `( ( n % m ) + m ) % m`.
 *
 * @param {number} n - The first parameter.
 * @param {number} m - The second parameter.
 * @return {number} The Euclidean modulo.
 */ function euclideanModulo(n, m) {
    // https://en.wikipedia.org/wiki/Modulo_operation
    return (n % m + m) % m;
}
/**
 * Performs a linear mapping from range `<a1, a2>` to range `<b1, b2>`
 * for the given value.
 *
 * @param {number} x - The value to be mapped.
 * @param {number} a1 - Minimum value for range A.
 * @param {number} a2 - Maximum value for range A.
 * @param {number} b1 - Minimum value for range B.
 * @param {number} b2 - Maximum value for range B.
 * @return {number} The mapped value.
 */ function mapLinear(x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}
/**
 * Returns the percentage in the closed interval `[0, 1]` of the given value
 * between the start and end point.
 *
 * @param {number} x - The start point
 * @param {number} y - The end point.
 * @param {number} value - A value between start and end.
 * @return {number} The interpolation factor.
 */ function inverseLerp(x, y, value) {
    // https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
    if (x !== y) {
        return (value - x) / (y - x);
    } else {
        return 0;
    }
}
/**
 * Returns a value linearly interpolated from two known points based on the given interval -
 * `t = 0` will return `x` and `t = 1` will return `y`.
 *
 * @param {number} x - The start point
 * @param {number} y - The end point.
 * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
 * @return {number} The interpolated value.
 */ function lerp(x, y, t) {
    return (1 - t) * x + t * y;
}
/**
 * Smoothly interpolate a number from `x` to `y` in  a spring-like manner using a delta
 * time to maintain frame rate independent movement. For details, see
 * [Frame rate independent damping using lerp]{@link http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/}.
 *
 * @param {number} x - The current point.
 * @param {number} y - The target point.
 * @param {number} lambda - A higher lambda value will make the movement more sudden,
 * and a lower value will make the movement more gradual.
 * @param {number} dt - Delta time in seconds.
 * @return {number} The interpolated value.
 */ function damp(x, y, lambda, dt) {
    return lerp(x, y, 1 - Math.exp(-lambda * dt));
}
/**
 * Returns a value that alternates between `0` and the given `length` parameter.
 *
 * @param {number} x - The value to pingpong.
 * @param {number} [length=1] - The positive value the function will pingpong to.
 * @return {number} The alternated value.
 */ function pingpong(x) {
    let length = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    // https://www.desmos.com/calculator/vcsjnyz7x4
    return length - Math.abs(euclideanModulo(x, length * 2) - length);
}
/**
 * Returns a value in the range `[0,1]` that represents the percentage that `x` has
 * moved between `min` and `max`, but smoothed or slowed down the closer `x` is to
 * the `min` and `max`.
 *
 * See [Smoothstep]{@link http://en.wikipedia.org/wiki/Smoothstep} for more details.
 *
 * @param {number} x - The value to evaluate based on its position between min and max.
 * @param {number} min - The min value. Any x value below min will be `0`.
 * @param {number} max - The max value. Any x value above max will be `1`.
 * @return {number} The alternated value.
 */ function smoothstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
}
/**
 * A [variation on smoothstep]{@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
 * that has zero 1st and 2nd order derivatives at x=0 and x=1.
 *
 * @param {number} x - The value to evaluate based on its position between min and max.
 * @param {number} min - The min value. Any x value below min will be `0`.
 * @param {number} max - The max value. Any x value above max will be `1`.
 * @return {number} The alternated value.
 */ function smootherstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
}
/**
 * Returns a random integer from `<low, high>` interval.
 *
 * @param {number} low - The lower value boundary.
 * @param {number} high - The upper value boundary
 * @return {number} A random integer.
 */ function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}
/**
 * Returns a random float from `<low, high>` interval.
 *
 * @param {number} low - The lower value boundary.
 * @param {number} high - The upper value boundary
 * @return {number} A random float.
 */ function randFloat(low, high) {
    return low + Math.random() * (high - low);
}
/**
 * Returns a random integer from `<-range/2, range/2>` interval.
 *
 * @param {number} range - Defines the value range.
 * @return {number} A random float.
 */ function randFloatSpread(range) {
    return range * (0.5 - Math.random());
}
/**
 * Returns a deterministic pseudo-random float in the interval `[0, 1]`.
 *
 * @param {number} [s] - The integer seed.
 * @return {number} A random float.
 */ function seededRandom(s) {
    if (s !== undefined) _seed = s;
    // Mulberry32 generator
    let t = _seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
/**
 * Converts degrees to radians.
 *
 * @param {number} degrees - A value in degrees.
 * @return {number} The converted value in radians.
 */ function degToRad(degrees) {
    return degrees * DEG2RAD;
}
/**
 * Converts radians to degrees.
 *
 * @param {number} radians - A value in radians.
 * @return {number} The converted value in degrees.
 */ function radToDeg(radians) {
    return radians * RAD2DEG;
}
/**
 * Returns `true` if the given number is a power of two.
 *
 * @param {number} value - The value to check.
 * @return {boolean} Whether the given number is a power of two or not.
 */ function isPowerOfTwo(value) {
    return (value & value - 1) === 0 && value !== 0;
}
/**
 * Returns the smallest power of two that is greater than or equal to the given number.
 *
 * @param {number} value - The value to find a POT for.
 * @return {number} The smallest power of two that is greater than or equal to the given number.
 */ function ceilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}
/**
 * Returns the largest power of two that is less than or equal to the given number.
 *
 * @param {number} value - The value to find a POT for.
 * @return {number} The largest power of two that is less than or equal to the given number.
 */ function floorPowerOfTwo(value) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}
/**
 * Sets the given quaternion from the [Intrinsic Proper Euler Angles]{@link https://en.wikipedia.org/wiki/Euler_angles}
 * defined by the given angles and order.
 *
 * Rotations are applied to the axes in the order specified by order:
 * rotation by angle `a` is applied first, then by angle `b`, then by angle `c`.
 *
 * @param {Quaternion} q - The quaternion to set.
 * @param {number} a - The rotation applied to the first axis, in radians.
 * @param {number} b - The rotation applied to the second axis, in radians.
 * @param {number} c - The rotation applied to the third axis, in radians.
 * @param {('XYX'|'XZX'|'YXY'|'YZY'|'ZXZ'|'ZYZ')} order - A string specifying the axes order.
 */ function setQuaternionFromProperEuler(q, a, b, c, order) {
    const cos = Math.cos;
    const sin = Math.sin;
    const c2 = cos(b / 2);
    const s2 = sin(b / 2);
    const c13 = cos((a + c) / 2);
    const s13 = sin((a + c) / 2);
    const c1_3 = cos((a - c) / 2);
    const s1_3 = sin((a - c) / 2);
    const c3_1 = cos((c - a) / 2);
    const s3_1 = sin((c - a) / 2);
    switch(order){
        case 'XYX':
            q.set(c2 * s13, s2 * c1_3, s2 * s1_3, c2 * c13);
            break;
        case 'YZY':
            q.set(s2 * s1_3, c2 * s13, s2 * c1_3, c2 * c13);
            break;
        case 'ZXZ':
            q.set(s2 * c1_3, s2 * s1_3, c2 * s13, c2 * c13);
            break;
        case 'XZX':
            q.set(c2 * s13, s2 * s3_1, s2 * c3_1, c2 * c13);
            break;
        case 'YXY':
            q.set(s2 * c3_1, c2 * s13, s2 * s3_1, c2 * c13);
            break;
        case 'ZYZ':
            q.set(s2 * s3_1, s2 * c3_1, c2 * s13, c2 * c13);
            break;
        default:
            console.warn('THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: ' + order);
    }
}
/**
 * Denormalizes the given value according to the given typed array.
 *
 * @param {number} value - The value to denormalize.
 * @param {TypedArray} array - The typed array that defines the data type of the value.
 * @return {number} The denormalize (float) value in the range `[0,1]`.
 */ function denormalize(value, array) {
    switch(array.constructor){
        case Float32Array:
            return value;
        case Uint32Array:
            return value / 4294967295.0;
        case Uint16Array:
            return value / 65535.0;
        case Uint8Array:
            return value / 255.0;
        case Int32Array:
            return Math.max(value / 2147483647.0, -1.0);
        case Int16Array:
            return Math.max(value / 32767.0, -1.0);
        case Int8Array:
            return Math.max(value / 127.0, -1.0);
        default:
            throw new Error('Invalid component type.');
    }
}
/**
 * Normalizes the given value according to the given typed array.
 *
 * @param {number} value - The float value in the range `[0,1]` to normalize.
 * @param {TypedArray} array - The typed array that defines the data type of the value.
 * @return {number} The normalize value.
 */ function normalize(value, array) {
    switch(array.constructor){
        case Float32Array:
            return value;
        case Uint32Array:
            return Math.round(value * 4294967295.0);
        case Uint16Array:
            return Math.round(value * 65535.0);
        case Uint8Array:
            return Math.round(value * 255.0);
        case Int32Array:
            return Math.round(value * 2147483647.0);
        case Int16Array:
            return Math.round(value * 32767.0);
        case Int8Array:
            return Math.round(value * 127.0);
        default:
            throw new Error('Invalid component type.');
    }
}
/**
 * @class
 * @classdesc A collection of math utility functions.
 * @hideconstructor
 */ const MathUtils = {
    DEG2RAD: DEG2RAD,
    RAD2DEG: RAD2DEG,
    /**
	 * Generate a [UUID]{@link https://en.wikipedia.org/wiki/Universally_unique_identifier}
	 * (universally unique identifier).
	 *
	 * @static
	 * @method
	 * @return {string} The UUID.
	 */ generateUUID: generateUUID,
    /**
	 * Clamps the given value between min and max.
	 *
	 * @static
	 * @method
	 * @param {number} value - The value to clamp.
	 * @param {number} min - The min value.
	 * @param {number} max - The max value.
	 * @return {number} The clamped value.
	 */ clamp: clamp,
    /**
	 * Computes the Euclidean modulo of the given parameters that
	 * is `( ( n % m ) + m ) % m`.
	 *
	 * @static
	 * @method
	 * @param {number} n - The first parameter.
	 * @param {number} m - The second parameter.
	 * @return {number} The Euclidean modulo.
	 */ euclideanModulo: euclideanModulo,
    /**
	 * Performs a linear mapping from range `<a1, a2>` to range `<b1, b2>`
	 * for the given value.
	 *
	 * @static
	 * @method
	 * @param {number} x - The value to be mapped.
	 * @param {number} a1 - Minimum value for range A.
	 * @param {number} a2 - Maximum value for range A.
	 * @param {number} b1 - Minimum value for range B.
	 * @param {number} b2 - Maximum value for range B.
	 * @return {number} The mapped value.
	 */ mapLinear: mapLinear,
    /**
	 * Returns the percentage in the closed interval `[0, 1]` of the given value
	 * between the start and end point.
	 *
	 * @static
	 * @method
	 * @param {number} x - The start point
	 * @param {number} y - The end point.
	 * @param {number} value - A value between start and end.
	 * @return {number} The interpolation factor.
	 */ inverseLerp: inverseLerp,
    /**
	 * Returns a value linearly interpolated from two known points based on the given interval -
	 * `t = 0` will return `x` and `t = 1` will return `y`.
	 *
	 * @static
	 * @method
	 * @param {number} x - The start point
	 * @param {number} y - The end point.
	 * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
	 * @return {number} The interpolated value.
	 */ lerp: lerp,
    /**
	 * Smoothly interpolate a number from `x` to `y` in  a spring-like manner using a delta
	 * time to maintain frame rate independent movement. For details, see
	 * [Frame rate independent damping using lerp]{@link http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/}.
	 *
	 * @static
	 * @method
	 * @param {number} x - The current point.
	 * @param {number} y - The target point.
	 * @param {number} lambda - A higher lambda value will make the movement more sudden,
	 * and a lower value will make the movement more gradual.
	 * @param {number} dt - Delta time in seconds.
	 * @return {number} The interpolated value.
	 */ damp: damp,
    /**
	 * Returns a value that alternates between `0` and the given `length` parameter.
	 *
	 * @static
	 * @method
	 * @param {number} x - The value to pingpong.
	 * @param {number} [length=1] - The positive value the function will pingpong to.
	 * @return {number} The alternated value.
	 */ pingpong: pingpong,
    /**
	 * Returns a value in the range `[0,1]` that represents the percentage that `x` has
	 * moved between `min` and `max`, but smoothed or slowed down the closer `x` is to
	 * the `min` and `max`.
	 *
	 * See [Smoothstep]{@link http://en.wikipedia.org/wiki/Smoothstep} for more details.
	 *
	 * @static
	 * @method
	 * @param {number} x - The value to evaluate based on its position between min and max.
	 * @param {number} min - The min value. Any x value below min will be `0`.
	 * @param {number} max - The max value. Any x value above max will be `1`.
	 * @return {number} The alternated value.
	 */ smoothstep: smoothstep,
    /**
	 * A [variation on smoothstep]{@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
	 * that has zero 1st and 2nd order derivatives at x=0 and x=1.
	 *
	 * @static
	 * @method
	 * @param {number} x - The value to evaluate based on its position between min and max.
	 * @param {number} min - The min value. Any x value below min will be `0`.
	 * @param {number} max - The max value. Any x value above max will be `1`.
	 * @return {number} The alternated value.
	 */ smootherstep: smootherstep,
    /**
	 * Returns a random integer from `<low, high>` interval.
	 *
	 * @static
	 * @method
	 * @param {number} low - The lower value boundary.
	 * @param {number} high - The upper value boundary
	 * @return {number} A random integer.
	 */ randInt: randInt,
    /**
	 * Returns a random float from `<low, high>` interval.
	 *
	 * @static
	 * @method
	 * @param {number} low - The lower value boundary.
	 * @param {number} high - The upper value boundary
	 * @return {number} A random float.
	 */ randFloat: randFloat,
    /**
	 * Returns a random integer from `<-range/2, range/2>` interval.
	 *
	 * @static
	 * @method
	 * @param {number} range - Defines the value range.
	 * @return {number} A random float.
	 */ randFloatSpread: randFloatSpread,
    /**
	 * Returns a deterministic pseudo-random float in the interval `[0, 1]`.
	 *
	 * @static
	 * @method
	 * @param {number} [s] - The integer seed.
	 * @return {number} A random float.
	 */ seededRandom: seededRandom,
    /**
	 * Converts degrees to radians.
	 *
	 * @static
	 * @method
	 * @param {number} degrees - A value in degrees.
	 * @return {number} The converted value in radians.
	 */ degToRad: degToRad,
    /**
	 * Converts radians to degrees.
	 *
	 * @static
	 * @method
	 * @param {number} radians - A value in radians.
	 * @return {number} The converted value in degrees.
	 */ radToDeg: radToDeg,
    /**
	 * Returns `true` if the given number is a power of two.
	 *
	 * @static
	 * @method
	 * @param {number} value - The value to check.
	 * @return {boolean} Whether the given number is a power of two or not.
	 */ isPowerOfTwo: isPowerOfTwo,
    /**
	 * Returns the smallest power of two that is greater than or equal to the given number.
	 *
	 * @static
	 * @method
	 * @param {number} value - The value to find a POT for.
	 * @return {number} The smallest power of two that is greater than or equal to the given number.
	 */ ceilPowerOfTwo: ceilPowerOfTwo,
    /**
	 * Returns the largest power of two that is less than or equal to the given number.
	 *
	 * @static
	 * @method
	 * @param {number} value - The value to find a POT for.
	 * @return {number} The largest power of two that is less than or equal to the given number.
	 */ floorPowerOfTwo: floorPowerOfTwo,
    /**
	 * Sets the given quaternion from the [Intrinsic Proper Euler Angles]{@link https://en.wikipedia.org/wiki/Euler_angles}
	 * defined by the given angles and order.
	 *
	 * Rotations are applied to the axes in the order specified by order:
	 * rotation by angle `a` is applied first, then by angle `b`, then by angle `c`.
	 *
	 * @static
	 * @method
	 * @param {Quaternion} q - The quaternion to set.
	 * @param {number} a - The rotation applied to the first axis, in radians.
	 * @param {number} b - The rotation applied to the second axis, in radians.
	 * @param {number} c - The rotation applied to the third axis, in radians.
	 * @param {('XYX'|'XZX'|'YXY'|'YZY'|'ZXZ'|'ZYZ')} order - A string specifying the axes order.
	 */ setQuaternionFromProperEuler: setQuaternionFromProperEuler,
    /**
	 * Normalizes the given value according to the given typed array.
	 *
	 * @static
	 * @method
	 * @param {number} value - The float value in the range `[0,1]` to normalize.
	 * @param {TypedArray} array - The typed array that defines the data type of the value.
	 * @return {number} The normalize value.
	 */ normalize: normalize,
    /**
	 * Denormalizes the given value according to the given typed array.
	 *
	 * @static
	 * @method
	 * @param {number} value - The value to denormalize.
	 * @param {TypedArray} array - The typed array that defines the data type of the value.
	 * @return {number} The denormalize (float) value in the range `[0,1]`.
	 */ denormalize: denormalize
};
;
}),
"[project]/frontend/landing/node_modules/three/src/math/Vector2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Vector2",
    ()=>Vector2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/MathUtils.js [app-client] (ecmascript)");
;
/**
 * Class representing a 2D vector. A 2D vector is an ordered pair of numbers
 * (labeled x and y), which can be used to represent a number of things, such as:
 *
 * - A point in 2D space (i.e. a position on a plane).
 * - A direction and length across a plane. In three.js the length will
 * always be the Euclidean distance(straight-line distance) from `(0, 0)` to `(x, y)`
 * and the direction is also measured from `(0, 0)` towards `(x, y)`.
 * - Any arbitrary ordered pair of numbers.
 *
 * There are other things a 2D vector can be used to represent, such as
 * momentum vectors, complex numbers and so on, however these are the most
 * common uses in three.js.
 *
 * Iterating through a vector instance will yield its components `(x, y)` in
 * the corresponding order.
 * ```js
 * const a = new THREE.Vector2( 0, 1 );
 *
 * //no arguments; will be initialised to (0, 0)
 * const b = new THREE.Vector2( );
 *
 * const d = a.distanceTo( b );
 * ```
 */ class Vector2 {
    /**
	 * Alias for {@link Vector2#x}.
	 *
	 * @type {number}
	 */ get width() {
        return this.x;
    }
    set width(value) {
        this.x = value;
    }
    /**
	 * Alias for {@link Vector2#y}.
	 *
	 * @type {number}
	 */ get height() {
        return this.y;
    }
    set height(value) {
        this.y = value;
    }
    /**
	 * Sets the vector components.
	 *
	 * @param {number} x - The value of the x component.
	 * @param {number} y - The value of the y component.
	 * @return {Vector2} A reference to this vector.
	 */ set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /**
	 * Sets the vector components to the same value.
	 *
	 * @param {number} scalar - The value to set for all vector components.
	 * @return {Vector2} A reference to this vector.
	 */ setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        return this;
    }
    /**
	 * Sets the vector's x component to the given value
	 *
	 * @param {number} x - The value to set.
	 * @return {Vector2} A reference to this vector.
	 */ setX(x) {
        this.x = x;
        return this;
    }
    /**
	 * Sets the vector's y component to the given value
	 *
	 * @param {number} y - The value to set.
	 * @return {Vector2} A reference to this vector.
	 */ setY(y) {
        this.y = y;
        return this;
    }
    /**
	 * Allows to set a vector component with an index.
	 *
	 * @param {number} index - The component index. `0` equals to x, `1` equals to y.
	 * @param {number} value - The value to set.
	 * @return {Vector2} A reference to this vector.
	 */ setComponent(index, value) {
        switch(index){
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default:
                throw new Error('index is out of range: ' + index);
        }
        return this;
    }
    /**
	 * Returns the value of the vector component which matches the given index.
	 *
	 * @param {number} index - The component index. `0` equals to x, `1` equals to y.
	 * @return {number} A vector component value.
	 */ getComponent(index) {
        switch(index){
            case 0:
                return this.x;
            case 1:
                return this.y;
            default:
                throw new Error('index is out of range: ' + index);
        }
    }
    /**
	 * Returns a new vector with copied values from this instance.
	 *
	 * @return {Vector2} A clone of this instance.
	 */ clone() {
        return new this.constructor(this.x, this.y);
    }
    /**
	 * Copies the values of the given vector to this instance.
	 *
	 * @param {Vector2} v - The vector to copy.
	 * @return {Vector2} A reference to this vector.
	 */ copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    /**
	 * Adds the given vector to this instance.
	 *
	 * @param {Vector2} v - The vector to add.
	 * @return {Vector2} A reference to this vector.
	 */ add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    /**
	 * Adds the given scalar value to all components of this instance.
	 *
	 * @param {number} s - The scalar to add.
	 * @return {Vector2} A reference to this vector.
	 */ addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    /**
	 * Adds the given vectors and stores the result in this instance.
	 *
	 * @param {Vector2} a - The first vector.
	 * @param {Vector2} b - The second vector.
	 * @return {Vector2} A reference to this vector.
	 */ addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }
    /**
	 * Adds the given vector scaled by the given factor to this instance.
	 *
	 * @param {Vector2} v - The vector.
	 * @param {number} s - The factor that scales `v`.
	 * @return {Vector2} A reference to this vector.
	 */ addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
    }
    /**
	 * Subtracts the given vector from this instance.
	 *
	 * @param {Vector2} v - The vector to subtract.
	 * @return {Vector2} A reference to this vector.
	 */ sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    /**
	 * Subtracts the given scalar value from all components of this instance.
	 *
	 * @param {number} s - The scalar to subtract.
	 * @return {Vector2} A reference to this vector.
	 */ subScalar(s) {
        this.x -= s;
        this.y -= s;
        return this;
    }
    /**
	 * Subtracts the given vectors and stores the result in this instance.
	 *
	 * @param {Vector2} a - The first vector.
	 * @param {Vector2} b - The second vector.
	 * @return {Vector2} A reference to this vector.
	 */ subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    /**
	 * Multiplies the given vector with this instance.
	 *
	 * @param {Vector2} v - The vector to multiply.
	 * @return {Vector2} A reference to this vector.
	 */ multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    /**
	 * Multiplies the given scalar value with all components of this instance.
	 *
	 * @param {number} scalar - The scalar to multiply.
	 * @return {Vector2} A reference to this vector.
	 */ multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /**
	 * Divides this instance by the given vector.
	 *
	 * @param {Vector2} v - The vector to divide.
	 * @return {Vector2} A reference to this vector.
	 */ divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    /**
	 * Divides this vector by the given scalar.
	 *
	 * @param {number} scalar - The scalar to divide.
	 * @return {Vector2} A reference to this vector.
	 */ divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }
    /**
	 * Multiplies this vector (with an implicit 1 as the 3rd component) by
	 * the given 3x3 matrix.
	 *
	 * @param {Matrix3} m - The matrix to apply.
	 * @return {Vector2} A reference to this vector.
	 */ applyMatrix3(m) {
        const x = this.x, y = this.y;
        const e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6];
        this.y = e[1] * x + e[4] * y + e[7];
        return this;
    }
    /**
	 * If this vector's x or y value is greater than the given vector's x or y
	 * value, replace that value with the corresponding min value.
	 *
	 * @param {Vector2} v - The vector.
	 * @return {Vector2} A reference to this vector.
	 */ min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }
    /**
	 * If this vector's x or y value is less than the given vector's x or y
	 * value, replace that value with the corresponding max value.
	 *
	 * @param {Vector2} v - The vector.
	 * @return {Vector2} A reference to this vector.
	 */ max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }
    /**
	 * If this vector's x or y value is greater than the max vector's x or y
	 * value, it is replaced by the corresponding value.
	 * If this vector's x or y value is less than the min vector's x or y value,
	 * it is replaced by the corresponding value.
	 *
	 * @param {Vector2} min - The minimum x and y values.
	 * @param {Vector2} max - The maximum x and y values in the desired range.
	 * @return {Vector2} A reference to this vector.
	 */ clamp(min, max) {
        // assumes min < max, componentwise
        this.x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.x, min.x, max.x);
        this.y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.y, min.y, max.y);
        return this;
    }
    /**
	 * If this vector's x or y values are greater than the max value, they are
	 * replaced by the max value.
	 * If this vector's x or y values are less than the min value, they are
	 * replaced by the min value.
	 *
	 * @param {number} minVal - The minimum value the components will be clamped to.
	 * @param {number} maxVal - The maximum value the components will be clamped to.
	 * @return {Vector2} A reference to this vector.
	 */ clampScalar(minVal, maxVal) {
        this.x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.x, minVal, maxVal);
        this.y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.y, minVal, maxVal);
        return this;
    }
    /**
	 * If this vector's length is greater than the max value, it is replaced by
	 * the max value.
	 * If this vector's length is less than the min value, it is replaced by the
	 * min value.
	 *
	 * @param {number} min - The minimum value the vector length will be clamped to.
	 * @param {number} max - The maximum value the vector length will be clamped to.
	 * @return {Vector2} A reference to this vector.
	 */ clampLength(min, max) {
        const length = this.length();
        return this.divideScalar(length || 1).multiplyScalar((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(length, min, max));
    }
    /**
	 * The components of this vector are rounded down to the nearest integer value.
	 *
	 * @return {Vector2} A reference to this vector.
	 */ floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    /**
	 * The components of this vector are rounded up to the nearest integer value.
	 *
	 * @return {Vector2} A reference to this vector.
	 */ ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    /**
	 * The components of this vector are rounded to the nearest integer value
	 *
	 * @return {Vector2} A reference to this vector.
	 */ round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    /**
	 * The components of this vector are rounded towards zero (up if negative,
	 * down if positive) to an integer value.
	 *
	 * @return {Vector2} A reference to this vector.
	 */ roundToZero() {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        return this;
    }
    /**
	 * Inverts this vector - i.e. sets x = -x and y = -y.
	 *
	 * @return {Vector2} A reference to this vector.
	 */ negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    /**
	 * Calculates the dot product of the given vector with this instance.
	 *
	 * @param {Vector2} v - The vector to compute the dot product with.
	 * @return {number} The result of the dot product.
	 */ dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    /**
	 * Calculates the cross product of the given vector with this instance.
	 *
	 * @param {Vector2} v - The vector to compute the cross product with.
	 * @return {number} The result of the cross product.
	 */ cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    /**
	 * Computes the square of the Euclidean length (straight-line length) from
	 * (0, 0) to (x, y). If you are comparing the lengths of vectors, you should
	 * compare the length squared instead as it is slightly more efficient to calculate.
	 *
	 * @return {number} The square length of this vector.
	 */ lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    /**
	 * Computes the  Euclidean length (straight-line length) from (0, 0) to (x, y).
	 *
	 * @return {number} The length of this vector.
	 */ length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
	 * Computes the Manhattan length of this vector.
	 *
	 * @return {number} The length of this vector.
	 */ manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y);
    }
    /**
	 * Converts this vector to a unit vector - that is, sets it equal to a vector
	 * with the same direction as this one, but with a vector length of `1`.
	 *
	 * @return {Vector2} A reference to this vector.
	 */ normalize() {
        return this.divideScalar(this.length() || 1);
    }
    /**
	 * Computes the angle in radians of this vector with respect to the positive x-axis.
	 *
	 * @return {number} The angle in radians.
	 */ angle() {
        const angle = Math.atan2(-this.y, -this.x) + Math.PI;
        return angle;
    }
    /**
	 * Returns the angle between the given vector and this instance in radians.
	 *
	 * @param {Vector2} v - The vector to compute the angle with.
	 * @return {number} The angle in radians.
	 */ angleTo(v) {
        const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
        if (denominator === 0) return Math.PI / 2;
        const theta = this.dot(v) / denominator;
        // clamp, to handle numerical problems
        return Math.acos((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(theta, -1, 1));
    }
    /**
	 * Computes the distance from the given vector to this instance.
	 *
	 * @param {Vector2} v - The vector to compute the distance to.
	 * @return {number} The distance.
	 */ distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }
    /**
	 * Computes the squared distance from the given vector to this instance.
	 * If you are just comparing the distance with another distance, you should compare
	 * the distance squared instead as it is slightly more efficient to calculate.
	 *
	 * @param {Vector2} v - The vector to compute the squared distance to.
	 * @return {number} The squared distance.
	 */ distanceToSquared(v) {
        const dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    }
    /**
	 * Computes the Manhattan distance from the given vector to this instance.
	 *
	 * @param {Vector2} v - The vector to compute the Manhattan distance to.
	 * @return {number} The Manhattan distance.
	 */ manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
    /**
	 * Sets this vector to a vector with the same direction as this one, but
	 * with the specified length.
	 *
	 * @param {number} length - The new length of this vector.
	 * @return {Vector2} A reference to this vector.
	 */ setLength(length) {
        return this.normalize().multiplyScalar(length);
    }
    /**
	 * Linearly interpolates between the given vector and this instance, where
	 * alpha is the percent distance along the line - alpha = 0 will be this
	 * vector, and alpha = 1 will be the given one.
	 *
	 * @param {Vector2} v - The vector to interpolate towards.
	 * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
	 * @return {Vector2} A reference to this vector.
	 */ lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    }
    /**
	 * Linearly interpolates between the given vectors, where alpha is the percent
	 * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
	 * be the second one. The result is stored in this instance.
	 *
	 * @param {Vector2} v1 - The first vector.
	 * @param {Vector2} v2 - The second vector.
	 * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
	 * @return {Vector2} A reference to this vector.
	 */ lerpVectors(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        return this;
    }
    /**
	 * Returns `true` if this vector is equal with the given one.
	 *
	 * @param {Vector2} v - The vector to test for equality.
	 * @return {boolean} Whether this vector is equal with the given one.
	 */ equals(v) {
        return v.x === this.x && v.y === this.y;
    }
    /**
	 * Sets this vector's x value to be `array[ offset ]` and y
	 * value to be `array[ offset + 1 ]`.
	 *
	 * @param {Array<number>} array - An array holding the vector component values.
	 * @param {number} [offset=0] - The offset into the array.
	 * @return {Vector2} A reference to this vector.
	 */ fromArray(array) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    }
    /**
	 * Writes the components of this vector to the given array. If no array is provided,
	 * the method returns a new instance.
	 *
	 * @param {Array<number>} [array=[]] - The target array holding the vector components.
	 * @param {number} [offset=0] - Index of the first element in the array.
	 * @return {Array<number>} The vector components.
	 */ toArray() {
        let array = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
    }
    /**
	 * Sets the components of this vector from the given buffer attribute.
	 *
	 * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
	 * @param {number} index - The index into the attribute.
	 * @return {Vector2} A reference to this vector.
	 */ fromBufferAttribute(attribute, index) {
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        return this;
    }
    /**
	 * Rotates this vector around the given center by the given angle.
	 *
	 * @param {Vector2} center - The point around which to rotate.
	 * @param {number} angle - The angle to rotate, in radians.
	 * @return {Vector2} A reference to this vector.
	 */ rotateAround(center, angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        const x = this.x - center.x;
        const y = this.y - center.y;
        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
    }
    /**
	 * Sets each component of this vector to a pseudo-random value between `0` and
	 * `1`, excluding `1`.
	 *
	 * @return {Vector2} A reference to this vector.
	 */ random() {
        this.x = Math.random();
        this.y = Math.random();
        return this;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
    /**
	 * Constructs a new 2D vector.
	 *
	 * @param {number} [x=0] - The x value of this vector.
	 * @param {number} [y=0] - The y value of this vector.
	 */ constructor(x = 0, y = 0){
        /**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */ Vector2.prototype.isVector2 = true;
        /**
		 * The x value of this vector.
		 *
		 * @type {number}
		 */ this.x = x;
        /**
		 * The y value of this vector.
		 *
		 * @type {number}
		 */ this.y = y;
    }
}
;
}),
"[project]/frontend/landing/node_modules/three/src/math/Quaternion.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Quaternion",
    ()=>Quaternion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/MathUtils.js [app-client] (ecmascript)");
;
/**
 * Class for representing a Quaternion. Quaternions are used in three.js to represent rotations.
 *
 * Iterating through a vector instance will yield its components `(x, y, z, w)` in
 * the corresponding order.
 *
 * Note that three.js expects Quaternions to be normalized.
 * ```js
 * const quaternion = new THREE.Quaternion();
 * quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
 *
 * const vector = new THREE.Vector3( 1, 0, 0 );
 * vector.applyQuaternion( quaternion );
 * ```
 */ class Quaternion {
    /**
	 * Interpolates between two quaternions via SLERP. This implementation assumes the
	 * quaternion data are managed  in flat arrays.
	 *
	 * @param {Array<number>} dst - The destination array.
	 * @param {number} dstOffset - An offset into the destination array.
	 * @param {Array<number>} src0 - The source array of the first quaternion.
	 * @param {number} srcOffset0 - An offset into the first source array.
	 * @param {Array<number>} src1 -  The source array of the second quaternion.
	 * @param {number} srcOffset1 - An offset into the second source array.
	 * @param {number} t - The interpolation factor in the range `[0,1]`.
	 * @see {@link Quaternion#slerp}
	 */ static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
        // fuzz-free, array-based Quaternion SLERP operation
        let x0 = src0[srcOffset0 + 0], y0 = src0[srcOffset0 + 1], z0 = src0[srcOffset0 + 2], w0 = src0[srcOffset0 + 3];
        const x1 = src1[srcOffset1 + 0], y1 = src1[srcOffset1 + 1], z1 = src1[srcOffset1 + 2], w1 = src1[srcOffset1 + 3];
        if (t === 0) {
            dst[dstOffset + 0] = x0;
            dst[dstOffset + 1] = y0;
            dst[dstOffset + 2] = z0;
            dst[dstOffset + 3] = w0;
            return;
        }
        if (t === 1) {
            dst[dstOffset + 0] = x1;
            dst[dstOffset + 1] = y1;
            dst[dstOffset + 2] = z1;
            dst[dstOffset + 3] = w1;
            return;
        }
        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
            let s = 1 - t;
            const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1, dir = cos >= 0 ? 1 : -1, sqrSin = 1 - cos * cos;
            // Skip the Slerp for tiny steps to avoid numeric problems:
            if (sqrSin > Number.EPSILON) {
                const sin = Math.sqrt(sqrSin), len = Math.atan2(sin, cos * dir);
                s = Math.sin(s * len) / sin;
                t = Math.sin(t * len) / sin;
            }
            const tDir = t * dir;
            x0 = x0 * s + x1 * tDir;
            y0 = y0 * s + y1 * tDir;
            z0 = z0 * s + z1 * tDir;
            w0 = w0 * s + w1 * tDir;
            // Normalize in case we just did a lerp:
            if (s === 1 - t) {
                const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
                x0 *= f;
                y0 *= f;
                z0 *= f;
                w0 *= f;
            }
        }
        dst[dstOffset] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
    }
    /**
	 * Multiplies two quaternions. This implementation assumes the quaternion data are managed
	 * in flat arrays.
	 *
	 * @param {Array<number>} dst - The destination array.
	 * @param {number} dstOffset - An offset into the destination array.
	 * @param {Array<number>} src0 - The source array of the first quaternion.
	 * @param {number} srcOffset0 - An offset into the first source array.
	 * @param {Array<number>} src1 -  The source array of the second quaternion.
	 * @param {number} srcOffset1 - An offset into the second source array.
	 * @return {Array<number>} The destination array.
	 * @see {@link Quaternion#multiplyQuaternions}.
	 */ static multiplyQuaternionsFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1) {
        const x0 = src0[srcOffset0];
        const y0 = src0[srcOffset0 + 1];
        const z0 = src0[srcOffset0 + 2];
        const w0 = src0[srcOffset0 + 3];
        const x1 = src1[srcOffset1];
        const y1 = src1[srcOffset1 + 1];
        const z1 = src1[srcOffset1 + 2];
        const w1 = src1[srcOffset1 + 3];
        dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
        dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
        dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
        dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
        return dst;
    }
    /**
	 * The x value of this quaternion.
	 *
	 * @type {number}
	 * @default 0
	 */ get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
        this._onChangeCallback();
    }
    /**
	 * The y value of this quaternion.
	 *
	 * @type {number}
	 * @default 0
	 */ get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
        this._onChangeCallback();
    }
    /**
	 * The z value of this quaternion.
	 *
	 * @type {number}
	 * @default 0
	 */ get z() {
        return this._z;
    }
    set z(value) {
        this._z = value;
        this._onChangeCallback();
    }
    /**
	 * The w value of this quaternion.
	 *
	 * @type {number}
	 * @default 1
	 */ get w() {
        return this._w;
    }
    set w(value) {
        this._w = value;
        this._onChangeCallback();
    }
    /**
	 * Sets the quaternion components.
	 *
	 * @param {number} x - The x value of this quaternion.
	 * @param {number} y - The y value of this quaternion.
	 * @param {number} z - The z value of this quaternion.
	 * @param {number} w - The w value of this quaternion.
	 * @return {Quaternion} A reference to this quaternion.
	 */ set(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
        this._onChangeCallback();
        return this;
    }
    /**
	 * Returns a new quaternion with copied values from this instance.
	 *
	 * @return {Quaternion} A clone of this instance.
	 */ clone() {
        return new this.constructor(this._x, this._y, this._z, this._w);
    }
    /**
	 * Copies the values of the given quaternion to this instance.
	 *
	 * @param {Quaternion} quaternion - The quaternion to copy.
	 * @return {Quaternion} A reference to this quaternion.
	 */ copy(quaternion) {
        this._x = quaternion.x;
        this._y = quaternion.y;
        this._z = quaternion.z;
        this._w = quaternion.w;
        this._onChangeCallback();
        return this;
    }
    /**
	 * Sets this quaternion from the rotation specified by the given
	 * Euler angles.
	 *
	 * @param {Euler} euler - The Euler angles.
	 * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
	 * @return {Quaternion} A reference to this quaternion.
	 */ setFromEuler(euler) {
        let update = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        const x = euler._x, y = euler._y, z = euler._z, order = euler._order;
        // http://www.mathworks.com/matlabcentral/fileexchange/
        // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //	content/SpinCalc.m
        const cos = Math.cos;
        const sin = Math.sin;
        const c1 = cos(x / 2);
        const c2 = cos(y / 2);
        const c3 = cos(z / 2);
        const s1 = sin(x / 2);
        const s2 = sin(y / 2);
        const s3 = sin(z / 2);
        switch(order){
            case 'XYZ':
                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'YXZ':
                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case 'ZXY':
                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'ZYX':
                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case 'YZX':
                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'XZY':
                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            default:
                console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order);
        }
        if (update === true) this._onChangeCallback();
        return this;
    }
    /**
	 * Sets this quaternion from the given axis and angle.
	 *
	 * @param {Vector3} axis - The normalized axis.
	 * @param {number} angle - The angle in radians.
	 * @return {Quaternion} A reference to this quaternion.
	 */ setFromAxisAngle(axis, angle) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        const halfAngle = angle / 2, s = Math.sin(halfAngle);
        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos(halfAngle);
        this._onChangeCallback();
        return this;
    }
    /**
	 * Sets this quaternion from the given rotation matrix.
	 *
	 * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
	 * @return {Quaternion} A reference to this quaternion.
	 */ setFromRotationMatrix(m) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        const te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            this._w = 0.25 / s;
            this._x = (m32 - m23) * s;
            this._y = (m13 - m31) * s;
            this._z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            this._w = (m32 - m23) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21) / s;
            this._z = (m13 + m31) / s;
        } else if (m22 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            this._w = (m13 - m31) / s;
            this._x = (m12 + m21) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32) / s;
        } else {
            const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
            this._w = (m21 - m12) / s;
            this._x = (m13 + m31) / s;
            this._y = (m23 + m32) / s;
            this._z = 0.25 * s;
        }
        this._onChangeCallback();
        return this;
    }
    /**
	 * Sets this quaternion to the rotation required to rotate the direction vector
	 * `vFrom` to the direction vector `vTo`.
	 *
	 * @param {Vector3} vFrom - The first (normalized) direction vector.
	 * @param {Vector3} vTo - The second (normalized) direction vector.
	 * @return {Quaternion} A reference to this quaternion.
	 */ setFromUnitVectors(vFrom, vTo) {
        // assumes direction vectors vFrom and vTo are normalized
        let r = vFrom.dot(vTo) + 1;
        if (r < 1e-8) {
            // vFrom and vTo point in opposite directions
            r = 0;
            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                this._x = -vFrom.y;
                this._y = vFrom.x;
                this._z = 0;
                this._w = r;
            } else {
                this._x = 0;
                this._y = -vFrom.z;
                this._z = vFrom.y;
                this._w = r;
            }
        } else {
            // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
            this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this._w = r;
        }
        return this.normalize();
    }
    /**
	 * Returns the angle between this quaternion and the given one in radians.
	 *
	 * @param {Quaternion} q - The quaternion to compute the angle with.
	 * @return {number} The angle in radians.
	 */ angleTo(q) {
        return 2 * Math.acos(Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.dot(q), -1, 1)));
    }
    /**
	 * Rotates this quaternion by a given angular step to the given quaternion.
	 * The method ensures that the final quaternion will not overshoot `q`.
	 *
	 * @param {Quaternion} q - The target quaternion.
	 * @param {number} step - The angular step in radians.
	 * @return {Quaternion} A reference to this quaternion.
	 */ rotateTowards(q, step) {
        const angle = this.angleTo(q);
        if (angle === 0) return this;
        const t = Math.min(1, step / angle);
        this.slerp(q, t);
        return this;
    }
    /**
	 * Sets this quaternion to the identity quaternion; that is, to the
	 * quaternion that represents "no rotation".
	 *
	 * @return {Quaternion} A reference to this quaternion.
	 */ identity() {
        return this.set(0, 0, 0, 1);
    }
    /**
	 * Inverts this quaternion via {@link Quaternion#conjugate}. The
	 * quaternion is assumed to have unit length.
	 *
	 * @return {Quaternion} A reference to this quaternion.
	 */ invert() {
        return this.conjugate();
    }
    /**
	 * Returns the rotational conjugate of this quaternion. The conjugate of a
	 * quaternion represents the same rotation in the opposite direction about
	 * the rotational axis.
	 *
	 * @return {Quaternion} A reference to this quaternion.
	 */ conjugate() {
        this._x *= -1;
        this._y *= -1;
        this._z *= -1;
        this._onChangeCallback();
        return this;
    }
    /**
	 * Calculates the dot product of this quaternion and the given one.
	 *
	 * @param {Quaternion} v - The quaternion to compute the dot product with.
	 * @return {number} The result of the dot product.
	 */ dot(v) {
        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
    }
    /**
	 * Computes the squared Euclidean length (straight-line length) of this quaternion,
	 * considered as a 4 dimensional vector. This can be useful if you are comparing the
	 * lengths of two quaternions, as this is a slightly more efficient calculation than
	 * {@link Quaternion#length}.
	 *
	 * @return {number} The squared Euclidean length.
	 */ lengthSq() {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    /**
	 * Computes the Euclidean length (straight-line length) of this quaternion,
	 * considered as a 4 dimensional vector.
	 *
	 * @return {number} The Euclidean length.
	 */ length() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    /**
	 * Normalizes this quaternion - that is, calculated the quaternion that performs
	 * the same rotation as this one, but has a length equal to `1`.
	 *
	 * @return {Quaternion} A reference to this quaternion.
	 */ normalize() {
        let l = this.length();
        if (l === 0) {
            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;
        } else {
            l = 1 / l;
            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;
        }
        this._onChangeCallback();
        return this;
    }
    /**
	 * Multiplies this quaternion by the given one.
	 *
	 * @param {Quaternion} q - The quaternion.
	 * @return {Quaternion} A reference to this quaternion.
	 */ multiply(q) {
        return this.multiplyQuaternions(this, q);
    }
    /**
	 * Pre-multiplies this quaternion by the given one.
	 *
	 * @param {Quaternion} q - The quaternion.
	 * @return {Quaternion} A reference to this quaternion.
	 */ premultiply(q) {
        return this.multiplyQuaternions(q, this);
    }
    /**
	 * Multiplies the given quaternions and stores the result in this instance.
	 *
	 * @param {Quaternion} a - The first quaternion.
	 * @param {Quaternion} b - The second quaternion.
	 * @return {Quaternion} A reference to this quaternion.
	 */ multiplyQuaternions(a, b) {
        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
        const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
        const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        this._onChangeCallback();
        return this;
    }
    /**
	 * Performs a spherical linear interpolation between quaternions.
	 *
	 * @param {Quaternion} qb - The target quaternion.
	 * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
	 * @return {Quaternion} A reference to this quaternion.
	 */ slerp(qb, t) {
        if (t === 0) return this;
        if (t === 1) return this.copy(qb);
        const x = this._x, y = this._y, z = this._z, w = this._w;
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
        if (cosHalfTheta < 0) {
            this._w = -qb._w;
            this._x = -qb._x;
            this._y = -qb._y;
            this._z = -qb._z;
            cosHalfTheta = -cosHalfTheta;
        } else {
            this.copy(qb);
        }
        if (cosHalfTheta >= 1.0) {
            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;
            return this;
        }
        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
        if (sqrSinHalfTheta <= Number.EPSILON) {
            const s = 1 - t;
            this._w = s * w + t * this._w;
            this._x = s * x + t * this._x;
            this._y = s * y + t * this._y;
            this._z = s * z + t * this._z;
            this.normalize(); // normalize calls _onChangeCallback()
            return this;
        }
        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        this._w = w * ratioA + this._w * ratioB;
        this._x = x * ratioA + this._x * ratioB;
        this._y = y * ratioA + this._y * ratioB;
        this._z = z * ratioA + this._z * ratioB;
        this._onChangeCallback();
        return this;
    }
    /**
	 * Performs a spherical linear interpolation between the given quaternions
	 * and stores the result in this quaternion.
	 *
	 * @param {Quaternion} qa - The source quaternion.
	 * @param {Quaternion} qb - The target quaternion.
	 * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
	 * @return {Quaternion} A reference to this quaternion.
	 */ slerpQuaternions(qa, qb, t) {
        return this.copy(qa).slerp(qb, t);
    }
    /**
	 * Sets this quaternion to a uniformly random, normalized quaternion.
	 *
	 * @return {Quaternion} A reference to this quaternion.
	 */ random() {
        // Ken Shoemake
        // Uniform random rotations
        // D. Kirk, editor, Graphics Gems III, pages 124-132. Academic Press, New York, 1992.
        const theta1 = 2 * Math.PI * Math.random();
        const theta2 = 2 * Math.PI * Math.random();
        const x0 = Math.random();
        const r1 = Math.sqrt(1 - x0);
        const r2 = Math.sqrt(x0);
        return this.set(r1 * Math.sin(theta1), r1 * Math.cos(theta1), r2 * Math.sin(theta2), r2 * Math.cos(theta2));
    }
    /**
	 * Returns `true` if this quaternion is equal with the given one.
	 *
	 * @param {Quaternion} quaternion - The quaternion to test for equality.
	 * @return {boolean} Whether this quaternion is equal with the given one.
	 */ equals(quaternion) {
        return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
    }
    /**
	 * Sets this quaternion's components from the given array.
	 *
	 * @param {Array<number>} array - An array holding the quaternion component values.
	 * @param {number} [offset=0] - The offset into the array.
	 * @return {Quaternion} A reference to this quaternion.
	 */ fromArray(array) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2];
        this._w = array[offset + 3];
        this._onChangeCallback();
        return this;
    }
    /**
	 * Writes the components of this quaternion to the given array. If no array is provided,
	 * the method returns a new instance.
	 *
	 * @param {Array<number>} [array=[]] - The target array holding the quaternion components.
	 * @param {number} [offset=0] - Index of the first element in the array.
	 * @return {Array<number>} The quaternion components.
	 */ toArray() {
        let array = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._w;
        return array;
    }
    /**
	 * Sets the components of this quaternion from the given buffer attribute.
	 *
	 * @param {BufferAttribute} attribute - The buffer attribute holding quaternion data.
	 * @param {number} index - The index into the attribute.
	 * @return {Quaternion} A reference to this quaternion.
	 */ fromBufferAttribute(attribute, index) {
        this._x = attribute.getX(index);
        this._y = attribute.getY(index);
        this._z = attribute.getZ(index);
        this._w = attribute.getW(index);
        this._onChangeCallback();
        return this;
    }
    /**
	 * This methods defines the serialization result of this class. Returns the
	 * numerical elements of this quaternion in an array of format `[x, y, z, w]`.
	 *
	 * @return {Array<number>} The serialized quaternion.
	 */ toJSON() {
        return this.toArray();
    }
    _onChange(callback) {
        this._onChangeCallback = callback;
        return this;
    }
    _onChangeCallback() {}
    *[Symbol.iterator]() {
        yield this._x;
        yield this._y;
        yield this._z;
        yield this._w;
    }
    /**
	 * Constructs a new quaternion.
	 *
	 * @param {number} [x=0] - The x value of this quaternion.
	 * @param {number} [y=0] - The y value of this quaternion.
	 * @param {number} [z=0] - The z value of this quaternion.
	 * @param {number} [w=1] - The w value of this quaternion.
	 */ constructor(x = 0, y = 0, z = 0, w = 1){
        /**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */ this.isQuaternion = true;
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }
}
;
}),
"[project]/frontend/landing/node_modules/three/src/math/Vector3.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Vector3",
    ()=>Vector3
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/MathUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Quaternion$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/Quaternion.js [app-client] (ecmascript)");
;
;
/**
 * Class representing a 3D vector. A 3D vector is an ordered triplet of numbers
 * (labeled x, y and z), which can be used to represent a number of things, such as:
 *
 * - A point in 3D space.
 * - A direction and length in 3D space. In three.js the length will
 * always be the Euclidean distance(straight-line distance) from `(0, 0, 0)` to `(x, y, z)`
 * and the direction is also measured from `(0, 0, 0)` towards `(x, y, z)`.
 * - Any arbitrary ordered triplet of numbers.
 *
 * There are other things a 3D vector can be used to represent, such as
 * momentum vectors and so on, however these are the most
 * common uses in three.js.
 *
 * Iterating through a vector instance will yield its components `(x, y, z)` in
 * the corresponding order.
 * ```js
 * const a = new THREE.Vector3( 0, 1, 0 );
 *
 * //no arguments; will be initialised to (0, 0, 0)
 * const b = new THREE.Vector3( );
 *
 * const d = a.distanceTo( b );
 * ```
 */ class Vector3 {
    /**
	 * Sets the vector components.
	 *
	 * @param {number} x - The value of the x component.
	 * @param {number} y - The value of the y component.
	 * @param {number} z - The value of the z component.
	 * @return {Vector3} A reference to this vector.
	 */ set(x, y, z) {
        if (z === undefined) z = this.z; // sprite.scale.set(x,y)
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    /**
	 * Sets the vector components to the same value.
	 *
	 * @param {number} scalar - The value to set for all vector components.
	 * @return {Vector3} A reference to this vector.
	 */ setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
    }
    /**
	 * Sets the vector's x component to the given value
	 *
	 * @param {number} x - The value to set.
	 * @return {Vector3} A reference to this vector.
	 */ setX(x) {
        this.x = x;
        return this;
    }
    /**
	 * Sets the vector's y component to the given value
	 *
	 * @param {number} y - The value to set.
	 * @return {Vector3} A reference to this vector.
	 */ setY(y) {
        this.y = y;
        return this;
    }
    /**
	 * Sets the vector's z component to the given value
	 *
	 * @param {number} z - The value to set.
	 * @return {Vector3} A reference to this vector.
	 */ setZ(z) {
        this.z = z;
        return this;
    }
    /**
	 * Allows to set a vector component with an index.
	 *
	 * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
	 * @param {number} value - The value to set.
	 * @return {Vector3} A reference to this vector.
	 */ setComponent(index, value) {
        switch(index){
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw new Error('index is out of range: ' + index);
        }
        return this;
    }
    /**
	 * Returns the value of the vector component which matches the given index.
	 *
	 * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
	 * @return {number} A vector component value.
	 */ getComponent(index) {
        switch(index){
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error('index is out of range: ' + index);
        }
    }
    /**
	 * Returns a new vector with copied values from this instance.
	 *
	 * @return {Vector3} A clone of this instance.
	 */ clone() {
        return new this.constructor(this.x, this.y, this.z);
    }
    /**
	 * Copies the values of the given vector to this instance.
	 *
	 * @param {Vector3} v - The vector to copy.
	 * @return {Vector3} A reference to this vector.
	 */ copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    /**
	 * Adds the given vector to this instance.
	 *
	 * @param {Vector3} v - The vector to add.
	 * @return {Vector3} A reference to this vector.
	 */ add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    /**
	 * Adds the given scalar value to all components of this instance.
	 *
	 * @param {number} s - The scalar to add.
	 * @return {Vector3} A reference to this vector.
	 */ addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }
    /**
	 * Adds the given vectors and stores the result in this instance.
	 *
	 * @param {Vector3} a - The first vector.
	 * @param {Vector3} b - The second vector.
	 * @return {Vector3} A reference to this vector.
	 */ addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }
    /**
	 * Adds the given vector scaled by the given factor to this instance.
	 *
	 * @param {Vector3|Vector4} v - The vector.
	 * @param {number} s - The factor that scales `v`.
	 * @return {Vector3} A reference to this vector.
	 */ addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
    }
    /**
	 * Subtracts the given vector from this instance.
	 *
	 * @param {Vector3} v - The vector to subtract.
	 * @return {Vector3} A reference to this vector.
	 */ sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    /**
	 * Subtracts the given scalar value from all components of this instance.
	 *
	 * @param {number} s - The scalar to subtract.
	 * @return {Vector3} A reference to this vector.
	 */ subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    }
    /**
	 * Subtracts the given vectors and stores the result in this instance.
	 *
	 * @param {Vector3} a - The first vector.
	 * @param {Vector3} b - The second vector.
	 * @return {Vector3} A reference to this vector.
	 */ subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
    /**
	 * Multiplies the given vector with this instance.
	 *
	 * @param {Vector3} v - The vector to multiply.
	 * @return {Vector3} A reference to this vector.
	 */ multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }
    /**
	 * Multiplies the given scalar value with all components of this instance.
	 *
	 * @param {number} scalar - The scalar to multiply.
	 * @return {Vector3} A reference to this vector.
	 */ multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    /**
	 * Multiplies the given vectors and stores the result in this instance.
	 *
	 * @param {Vector3} a - The first vector.
	 * @param {Vector3} b - The second vector.
	 * @return {Vector3} A reference to this vector.
	 */ multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }
    /**
	 * Applies the given Euler rotation to this vector.
	 *
	 * @param {Euler} euler - The Euler angles.
	 * @return {Vector3} A reference to this vector.
	 */ applyEuler(euler) {
        return this.applyQuaternion(_quaternion.setFromEuler(euler));
    }
    /**
	 * Applies a rotation specified by an axis and an angle to this vector.
	 *
	 * @param {Vector3} axis - A normalized vector representing the rotation axis.
	 * @param {number} angle - The angle in radians.
	 * @return {Vector3} A reference to this vector.
	 */ applyAxisAngle(axis, angle) {
        return this.applyQuaternion(_quaternion.setFromAxisAngle(axis, angle));
    }
    /**
	 * Multiplies this vector with the given 3x3 matrix.
	 *
	 * @param {Matrix3} m - The 3x3 matrix.
	 * @return {Vector3} A reference to this vector.
	 */ applyMatrix3(m) {
        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    }
    /**
	 * Multiplies this vector by the given normal matrix and normalizes
	 * the result.
	 *
	 * @param {Matrix3} m - The normal matrix.
	 * @return {Vector3} A reference to this vector.
	 */ applyNormalMatrix(m) {
        return this.applyMatrix3(m).normalize();
    }
    /**
	 * Multiplies this vector (with an implicit 1 in the 4th dimension) by m, and
	 * divides by perspective.
	 *
	 * @param {Matrix4} m - The matrix to apply.
	 * @return {Vector3} A reference to this vector.
	 */ applyMatrix4(m) {
        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;
        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        return this;
    }
    /**
	 * Applies the given Quaternion to this vector.
	 *
	 * @param {Quaternion} q - The Quaternion.
	 * @return {Vector3} A reference to this vector.
	 */ applyQuaternion(q) {
        // quaternion q is assumed to have unit length
        const vx = this.x, vy = this.y, vz = this.z;
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
        // t = 2 * cross( q.xyz, v );
        const tx = 2 * (qy * vz - qz * vy);
        const ty = 2 * (qz * vx - qx * vz);
        const tz = 2 * (qx * vy - qy * vx);
        // v + q.w * t + cross( q.xyz, t );
        this.x = vx + qw * tx + qy * tz - qz * ty;
        this.y = vy + qw * ty + qz * tx - qx * tz;
        this.z = vz + qw * tz + qx * ty - qy * tx;
        return this;
    }
    /**
	 * Projects this vector from world space into the camera's normalized
	 * device coordinate (NDC) space.
	 *
	 * @param {Camera} camera - The camera.
	 * @return {Vector3} A reference to this vector.
	 */ project(camera) {
        return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
    }
    /**
	 * Unprojects this vector from the camera's normalized device coordinate (NDC)
	 * space into world space.
	 *
	 * @param {Camera} camera - The camera.
	 * @return {Vector3} A reference to this vector.
	 */ unproject(camera) {
        return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
    }
    /**
	 * Transforms the direction of this vector by a matrix (the upper left 3 x 3
	 * subset of the given 4x4 matrix and then normalizes the result.
	 *
	 * @param {Matrix4} m - The matrix.
	 * @return {Vector3} A reference to this vector.
	 */ transformDirection(m) {
        // input: THREE.Matrix4 affine matrix
        // vector interpreted as a direction
        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        return this.normalize();
    }
    /**
	 * Divides this instance by the given vector.
	 *
	 * @param {Vector3} v - The vector to divide.
	 * @return {Vector3} A reference to this vector.
	 */ divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }
    /**
	 * Divides this vector by the given scalar.
	 *
	 * @param {number} scalar - The scalar to divide.
	 * @return {Vector3} A reference to this vector.
	 */ divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }
    /**
	 * If this vector's x, y or z value is greater than the given vector's x, y or z
	 * value, replace that value with the corresponding min value.
	 *
	 * @param {Vector3} v - The vector.
	 * @return {Vector3} A reference to this vector.
	 */ min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
    }
    /**
	 * If this vector's x, y or z value is less than the given vector's x, y or z
	 * value, replace that value with the corresponding max value.
	 *
	 * @param {Vector3} v - The vector.
	 * @return {Vector3} A reference to this vector.
	 */ max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    }
    /**
	 * If this vector's x, y or z value is greater than the max vector's x, y or z
	 * value, it is replaced by the corresponding value.
	 * If this vector's x, y or z value is less than the min vector's x, y or z value,
	 * it is replaced by the corresponding value.
	 *
	 * @param {Vector3} min - The minimum x, y and z values.
	 * @param {Vector3} max - The maximum x, y and z values in the desired range.
	 * @return {Vector3} A reference to this vector.
	 */ clamp(min, max) {
        // assumes min < max, componentwise
        this.x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.x, min.x, max.x);
        this.y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.y, min.y, max.y);
        this.z = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.z, min.z, max.z);
        return this;
    }
    /**
	 * If this vector's x, y or z values are greater than the max value, they are
	 * replaced by the max value.
	 * If this vector's x, y or z values are less than the min value, they are
	 * replaced by the min value.
	 *
	 * @param {number} minVal - The minimum value the components will be clamped to.
	 * @param {number} maxVal - The maximum value the components will be clamped to.
	 * @return {Vector3} A reference to this vector.
	 */ clampScalar(minVal, maxVal) {
        this.x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.x, minVal, maxVal);
        this.y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.y, minVal, maxVal);
        this.z = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(this.z, minVal, maxVal);
        return this;
    }
    /**
	 * If this vector's length is greater than the max value, it is replaced by
	 * the max value.
	 * If this vector's length is less than the min value, it is replaced by the
	 * min value.
	 *
	 * @param {number} min - The minimum value the vector length will be clamped to.
	 * @param {number} max - The maximum value the vector length will be clamped to.
	 * @return {Vector3} A reference to this vector.
	 */ clampLength(min, max) {
        const length = this.length();
        return this.divideScalar(length || 1).multiplyScalar((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(length, min, max));
    }
    /**
	 * The components of this vector are rounded down to the nearest integer value.
	 *
	 * @return {Vector3} A reference to this vector.
	 */ floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }
    /**
	 * The components of this vector are rounded up to the nearest integer value.
	 *
	 * @return {Vector3} A reference to this vector.
	 */ ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }
    /**
	 * The components of this vector are rounded to the nearest integer value
	 *
	 * @return {Vector3} A reference to this vector.
	 */ round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    /**
	 * The components of this vector are rounded towards zero (up if negative,
	 * down if positive) to an integer value.
	 *
	 * @return {Vector3} A reference to this vector.
	 */ roundToZero() {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        this.z = Math.trunc(this.z);
        return this;
    }
    /**
	 * Inverts this vector - i.e. sets x = -x, y = -y and z = -z.
	 *
	 * @return {Vector3} A reference to this vector.
	 */ negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    /**
	 * Calculates the dot product of the given vector with this instance.
	 *
	 * @param {Vector3} v - The vector to compute the dot product with.
	 * @return {number} The result of the dot product.
	 */ dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    // TODO lengthSquared?
    /**
	 * Computes the square of the Euclidean length (straight-line length) from
	 * (0, 0, 0) to (x, y, z). If you are comparing the lengths of vectors, you should
	 * compare the length squared instead as it is slightly more efficient to calculate.
	 *
	 * @return {number} The square length of this vector.
	 */ lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
	 * Computes the  Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).
	 *
	 * @return {number} The length of this vector.
	 */ length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /**
	 * Computes the Manhattan length of this vector.
	 *
	 * @return {number} The length of this vector.
	 */ manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    /**
	 * Converts this vector to a unit vector - that is, sets it equal to a vector
	 * with the same direction as this one, but with a vector length of `1`.
	 *
	 * @return {Vector3} A reference to this vector.
	 */ normalize() {
        return this.divideScalar(this.length() || 1);
    }
    /**
	 * Sets this vector to a vector with the same direction as this one, but
	 * with the specified length.
	 *
	 * @param {number} length - The new length of this vector.
	 * @return {Vector3} A reference to this vector.
	 */ setLength(length) {
        return this.normalize().multiplyScalar(length);
    }
    /**
	 * Linearly interpolates between the given vector and this instance, where
	 * alpha is the percent distance along the line - alpha = 0 will be this
	 * vector, and alpha = 1 will be the given one.
	 *
	 * @param {Vector3} v - The vector to interpolate towards.
	 * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
	 * @return {Vector3} A reference to this vector.
	 */ lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }
    /**
	 * Linearly interpolates between the given vectors, where alpha is the percent
	 * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
	 * be the second one. The result is stored in this instance.
	 *
	 * @param {Vector3} v1 - The first vector.
	 * @param {Vector3} v2 - The second vector.
	 * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
	 * @return {Vector3} A reference to this vector.
	 */ lerpVectors(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        this.z = v1.z + (v2.z - v1.z) * alpha;
        return this;
    }
    /**
	 * Calculates the cross product of the given vector with this instance.
	 *
	 * @param {Vector3} v - The vector to compute the cross product with.
	 * @return {Vector3} The result of the cross product.
	 */ cross(v) {
        return this.crossVectors(this, v);
    }
    /**
	 * Calculates the cross product of the given vectors and stores the result
	 * in this instance.
	 *
	 * @param {Vector3} a - The first vector.
	 * @param {Vector3} b - The second vector.
	 * @return {Vector3} A reference to this vector.
	 */ crossVectors(a, b) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }
    /**
	 * Projects this vector onto the given one.
	 *
	 * @param {Vector3} v - The vector to project to.
	 * @return {Vector3} A reference to this vector.
	 */ projectOnVector(v) {
        const denominator = v.lengthSq();
        if (denominator === 0) return this.set(0, 0, 0);
        const scalar = v.dot(this) / denominator;
        return this.copy(v).multiplyScalar(scalar);
    }
    /**
	 * Projects this vector onto a plane by subtracting this
	 * vector projected onto the plane's normal from this vector.
	 *
	 * @param {Vector3} planeNormal - The plane normal.
	 * @return {Vector3} A reference to this vector.
	 */ projectOnPlane(planeNormal) {
        _vector.copy(this).projectOnVector(planeNormal);
        return this.sub(_vector);
    }
    /**
	 * Reflects this vector off a plane orthogonal to the given normal vector.
	 *
	 * @param {Vector3} normal - The (normalized) normal vector.
	 * @return {Vector3} A reference to this vector.
	 */ reflect(normal) {
        return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
    }
    /**
	 * Returns the angle between the given vector and this instance in radians.
	 *
	 * @param {Vector3} v - The vector to compute the angle with.
	 * @return {number} The angle in radians.
	 */ angleTo(v) {
        const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
        if (denominator === 0) return Math.PI / 2;
        const theta = this.dot(v) / denominator;
        // clamp, to handle numerical problems
        return Math.acos((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(theta, -1, 1));
    }
    /**
	 * Computes the distance from the given vector to this instance.
	 *
	 * @param {Vector3} v - The vector to compute the distance to.
	 * @return {number} The distance.
	 */ distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }
    /**
	 * Computes the squared distance from the given vector to this instance.
	 * If you are just comparing the distance with another distance, you should compare
	 * the distance squared instead as it is slightly more efficient to calculate.
	 *
	 * @param {Vector3} v - The vector to compute the squared distance to.
	 * @return {number} The squared distance.
	 */ distanceToSquared(v) {
        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }
    /**
	 * Computes the Manhattan distance from the given vector to this instance.
	 *
	 * @param {Vector3} v - The vector to compute the Manhattan distance to.
	 * @return {number} The Manhattan distance.
	 */ manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
    }
    /**
	 * Sets the vector components from the given spherical coordinates.
	 *
	 * @param {Spherical} s - The spherical coordinates.
	 * @return {Vector3} A reference to this vector.
	 */ setFromSpherical(s) {
        return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }
    /**
	 * Sets the vector components from the given spherical coordinates.
	 *
	 * @param {number} radius - The radius.
	 * @param {number} phi - The phi angle in radians.
	 * @param {number} theta - The theta angle in radians.
	 * @return {Vector3} A reference to this vector.
	 */ setFromSphericalCoords(radius, phi, theta) {
        const sinPhiRadius = Math.sin(phi) * radius;
        this.x = sinPhiRadius * Math.sin(theta);
        this.y = Math.cos(phi) * radius;
        this.z = sinPhiRadius * Math.cos(theta);
        return this;
    }
    /**
	 * Sets the vector components from the given cylindrical coordinates.
	 *
	 * @param {Cylindrical} c - The cylindrical coordinates.
	 * @return {Vector3} A reference to this vector.
	 */ setFromCylindrical(c) {
        return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    }
    /**
	 * Sets the vector components from the given cylindrical coordinates.
	 *
	 * @param {number} radius - The radius.
	 * @param {number} theta - The theta angle in radians.
	 * @param {number} y - The y value.
	 * @return {Vector3} A reference to this vector.
	 */ setFromCylindricalCoords(radius, theta, y) {
        this.x = radius * Math.sin(theta);
        this.y = y;
        this.z = radius * Math.cos(theta);
        return this;
    }
    /**
	 * Sets the vector components to the position elements of the
	 * given transformation matrix.
	 *
	 * @param {Matrix4} m - The 4x4 matrix.
	 * @return {Vector3} A reference to this vector.
	 */ setFromMatrixPosition(m) {
        const e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    }
    /**
	 * Sets the vector components to the scale elements of the
	 * given transformation matrix.
	 *
	 * @param {Matrix4} m - The 4x4 matrix.
	 * @return {Vector3} A reference to this vector.
	 */ setFromMatrixScale(m) {
        const sx = this.setFromMatrixColumn(m, 0).length();
        const sy = this.setFromMatrixColumn(m, 1).length();
        const sz = this.setFromMatrixColumn(m, 2).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    }
    /**
	 * Sets the vector components from the specified matrix column.
	 *
	 * @param {Matrix4} m - The 4x4 matrix.
	 * @param {number} index - The column index.
	 * @return {Vector3} A reference to this vector.
	 */ setFromMatrixColumn(m, index) {
        return this.fromArray(m.elements, index * 4);
    }
    /**
	 * Sets the vector components from the specified matrix column.
	 *
	 * @param {Matrix3} m - The 3x3 matrix.
	 * @param {number} index - The column index.
	 * @return {Vector3} A reference to this vector.
	 */ setFromMatrix3Column(m, index) {
        return this.fromArray(m.elements, index * 3);
    }
    /**
	 * Sets the vector components from the given Euler angles.
	 *
	 * @param {Euler} e - The Euler angles to set.
	 * @return {Vector3} A reference to this vector.
	 */ setFromEuler(e) {
        this.x = e._x;
        this.y = e._y;
        this.z = e._z;
        return this;
    }
    /**
	 * Sets the vector components from the RGB components of the
	 * given color.
	 *
	 * @param {Color} c - The color to set.
	 * @return {Vector3} A reference to this vector.
	 */ setFromColor(c) {
        this.x = c.r;
        this.y = c.g;
        this.z = c.b;
        return this;
    }
    /**
	 * Returns `true` if this vector is equal with the given one.
	 *
	 * @param {Vector3} v - The vector to test for equality.
	 * @return {boolean} Whether this vector is equal with the given one.
	 */ equals(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z;
    }
    /**
	 * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`
	 * and z value to be `array[ offset + 2 ]`.
	 *
	 * @param {Array<number>} array - An array holding the vector component values.
	 * @param {number} [offset=0] - The offset into the array.
	 * @return {Vector3} A reference to this vector.
	 */ fromArray(array) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    }
    /**
	 * Writes the components of this vector to the given array. If no array is provided,
	 * the method returns a new instance.
	 *
	 * @param {Array<number>} [array=[]] - The target array holding the vector components.
	 * @param {number} [offset=0] - Index of the first element in the array.
	 * @return {Array<number>} The vector components.
	 */ toArray() {
        let array = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
    }
    /**
	 * Sets the components of this vector from the given buffer attribute.
	 *
	 * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
	 * @param {number} index - The index into the attribute.
	 * @return {Vector3} A reference to this vector.
	 */ fromBufferAttribute(attribute, index) {
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        return this;
    }
    /**
	 * Sets each component of this vector to a pseudo-random value between `0` and
	 * `1`, excluding `1`.
	 *
	 * @return {Vector3} A reference to this vector.
	 */ random() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        return this;
    }
    /**
	 * Sets this vector to a uniformly random point on a unit sphere.
	 *
	 * @return {Vector3} A reference to this vector.
	 */ randomDirection() {
        // https://mathworld.wolfram.com/SpherePointPicking.html
        const theta = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        const c = Math.sqrt(1 - u * u);
        this.x = c * Math.cos(theta);
        this.y = u;
        this.z = c * Math.sin(theta);
        return this;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
    /**
	 * Constructs a new 3D vector.
	 *
	 * @param {number} [x=0] - The x value of this vector.
	 * @param {number} [y=0] - The y value of this vector.
	 * @param {number} [z=0] - The z value of this vector.
	 */ constructor(x = 0, y = 0, z = 0){
        /**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */ Vector3.prototype.isVector3 = true;
        /**
		 * The x value of this vector.
		 *
		 * @type {number}
		 */ this.x = x;
        /**
		 * The y value of this vector.
		 *
		 * @type {number}
		 */ this.y = y;
        /**
		 * The z value of this vector.
		 *
		 * @type {number}
		 */ this.z = z;
    }
}
const _vector = /*@__PURE__*/ new Vector3();
const _quaternion = /*@__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Quaternion$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"]();
;
}),
"[project]/frontend/landing/node_modules/three/src/math/Matrix3.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Represents a 3x3 matrix.
 *
 * A Note on Row-Major and Column-Major Ordering:
 *
 * The constructor and {@link Matrix3#set} method take arguments in
 * [row-major]{@link https://en.wikipedia.org/wiki/Row-_and_column-major_order#Column-major_order}
 * order, while internally they are stored in the {@link Matrix3#elements} array in column-major order.
 * This means that calling:
 * ```js
 * const m = new THREE.Matrix();
 * m.set( 11, 12, 13,
 *        21, 22, 23,
 *        31, 32, 33 );
 * ```
 * will result in the elements array containing:
 * ```js
 * m.elements = [ 11, 21, 31,
 *                12, 22, 32,
 *                13, 23, 33 ];
 * ```
 * and internally all calculations are performed using column-major ordering.
 * However, as the actual ordering makes no difference mathematically and
 * most people are used to thinking about matrices in row-major order, the
 * three.js documentation shows matrices in row-major order. Just bear in
 * mind that if you are reading the source code, you'll have to take the
 * transpose of any matrices outlined here to make sense of the calculations.
 */ __turbopack_context__.s([
    "Matrix3",
    ()=>Matrix3
]);
class Matrix3 {
    /**
	 * Sets the elements of the matrix.The arguments are supposed to be
	 * in row-major order.
	 *
	 * @param {number} [n11] - 1-1 matrix element.
	 * @param {number} [n12] - 1-2 matrix element.
	 * @param {number} [n13] - 1-3 matrix element.
	 * @param {number} [n21] - 2-1 matrix element.
	 * @param {number} [n22] - 2-2 matrix element.
	 * @param {number} [n23] - 2-3 matrix element.
	 * @param {number} [n31] - 3-1 matrix element.
	 * @param {number} [n32] - 3-2 matrix element.
	 * @param {number} [n33] - 3-3 matrix element.
	 * @return {Matrix3} A reference to this matrix.
	 */ set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
        const te = this.elements;
        te[0] = n11;
        te[1] = n21;
        te[2] = n31;
        te[3] = n12;
        te[4] = n22;
        te[5] = n32;
        te[6] = n13;
        te[7] = n23;
        te[8] = n33;
        return this;
    }
    /**
	 * Sets this matrix to the 3x3 identity matrix.
	 *
	 * @return {Matrix3} A reference to this matrix.
	 */ identity() {
        this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return this;
    }
    /**
	 * Copies the values of the given matrix to this instance.
	 *
	 * @param {Matrix3} m - The matrix to copy.
	 * @return {Matrix3} A reference to this matrix.
	 */ copy(m) {
        const te = this.elements;
        const me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        return this;
    }
    /**
	 * Extracts the basis of this matrix into the three axis vectors provided.
	 *
	 * @param {Vector3} xAxis - The basis's x axis.
	 * @param {Vector3} yAxis - The basis's y axis.
	 * @param {Vector3} zAxis - The basis's z axis.
	 * @return {Matrix3} A reference to this matrix.
	 */ extractBasis(xAxis, yAxis, zAxis) {
        xAxis.setFromMatrix3Column(this, 0);
        yAxis.setFromMatrix3Column(this, 1);
        zAxis.setFromMatrix3Column(this, 2);
        return this;
    }
    /**
	 * Set this matrix to the upper 3x3 matrix of the given 4x4 matrix.
	 *
	 * @param {Matrix4} m - The 4x4 matrix.
	 * @return {Matrix3} A reference to this matrix.
	 */ setFromMatrix4(m) {
        const me = m.elements;
        this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);
        return this;
    }
    /**
	 * Post-multiplies this matrix by the given 3x3 matrix.
	 *
	 * @param {Matrix3} m - The matrix to multiply with.
	 * @return {Matrix3} A reference to this matrix.
	 */ multiply(m) {
        return this.multiplyMatrices(this, m);
    }
    /**
	 * Pre-multiplies this matrix by the given 3x3 matrix.
	 *
	 * @param {Matrix3} m - The matrix to multiply with.
	 * @return {Matrix3} A reference to this matrix.
	 */ premultiply(m) {
        return this.multiplyMatrices(m, this);
    }
    /**
	 * Multiples the given 3x3 matrices and stores the result
	 * in this matrix.
	 *
	 * @param {Matrix3} a - The first matrix.
	 * @param {Matrix3} b - The second matrix.
	 * @return {Matrix3} A reference to this matrix.
	 */ multiplyMatrices(a, b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;
        const a11 = ae[0], a12 = ae[3], a13 = ae[6];
        const a21 = ae[1], a22 = ae[4], a23 = ae[7];
        const a31 = ae[2], a32 = ae[5], a33 = ae[8];
        const b11 = be[0], b12 = be[3], b13 = be[6];
        const b21 = be[1], b22 = be[4], b23 = be[7];
        const b31 = be[2], b32 = be[5], b33 = be[8];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31;
        te[3] = a11 * b12 + a12 * b22 + a13 * b32;
        te[6] = a11 * b13 + a12 * b23 + a13 * b33;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31;
        te[4] = a21 * b12 + a22 * b22 + a23 * b32;
        te[7] = a21 * b13 + a22 * b23 + a23 * b33;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31;
        te[5] = a31 * b12 + a32 * b22 + a33 * b32;
        te[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    }
    /**
	 * Multiplies every component of the matrix by the given scalar.
	 *
	 * @param {number} s - The scalar.
	 * @return {Matrix3} A reference to this matrix.
	 */ multiplyScalar(s) {
        const te = this.elements;
        te[0] *= s;
        te[3] *= s;
        te[6] *= s;
        te[1] *= s;
        te[4] *= s;
        te[7] *= s;
        te[2] *= s;
        te[5] *= s;
        te[8] *= s;
        return this;
    }
    /**
	 * Computes and returns the determinant of this matrix.
	 *
	 * @return {number} The determinant.
	 */ determinant() {
        const te = this.elements;
        const a = te[0], b = te[1], c = te[2], d = te[3], e = te[4], f = te[5], g = te[6], h = te[7], i = te[8];
        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    }
    /**
	 * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
	 * You can not invert with a determinant of zero. If you attempt this, the method produces
	 * a zero matrix instead.
	 *
	 * @return {Matrix3} A reference to this matrix.
	 */ invert() {
        const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n12 = te[3], n22 = te[4], n32 = te[5], n13 = te[6], n23 = te[7], n33 = te[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
        if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        const detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n31 * n23 - n33 * n21) * detInv;
        te[2] = (n32 * n21 - n31 * n22) * detInv;
        te[3] = t12 * detInv;
        te[4] = (n33 * n11 - n31 * n13) * detInv;
        te[5] = (n31 * n12 - n32 * n11) * detInv;
        te[6] = t13 * detInv;
        te[7] = (n21 * n13 - n23 * n11) * detInv;
        te[8] = (n22 * n11 - n21 * n12) * detInv;
        return this;
    }
    /**
	 * Transposes this matrix in place.
	 *
	 * @return {Matrix3} A reference to this matrix.
	 */ transpose() {
        let tmp;
        const m = this.elements;
        tmp = m[1];
        m[1] = m[3];
        m[3] = tmp;
        tmp = m[2];
        m[2] = m[6];
        m[6] = tmp;
        tmp = m[5];
        m[5] = m[7];
        m[7] = tmp;
        return this;
    }
    /**
	 * Computes the normal matrix which is the inverse transpose of the upper
	 * left 3x3 portion of the given 4x4 matrix.
	 *
	 * @param {Matrix4} matrix4 - The 4x4 matrix.
	 * @return {Matrix3} A reference to this matrix.
	 */ getNormalMatrix(matrix4) {
        return this.setFromMatrix4(matrix4).invert().transpose();
    }
    /**
	 * Transposes this matrix into the supplied array, and returns itself unchanged.
	 *
	 * @param {Array<number>} r - An array to store the transposed matrix elements.
	 * @return {Matrix3} A reference to this matrix.
	 */ transposeIntoArray(r) {
        const m = this.elements;
        r[0] = m[0];
        r[1] = m[3];
        r[2] = m[6];
        r[3] = m[1];
        r[4] = m[4];
        r[5] = m[7];
        r[6] = m[2];
        r[7] = m[5];
        r[8] = m[8];
        return this;
    }
    /**
	 * Sets the UV transform matrix from offset, repeat, rotation, and center.
	 *
	 * @param {number} tx - Offset x.
	 * @param {number} ty - Offset y.
	 * @param {number} sx - Repeat x.
	 * @param {number} sy - Repeat y.
	 * @param {number} rotation - Rotation, in radians. Positive values rotate counterclockwise.
	 * @param {number} cx - Center x of rotation.
	 * @param {number} cy - Center y of rotation
	 * @return {Matrix3} A reference to this matrix.
	 */ setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
        const c = Math.cos(rotation);
        const s = Math.sin(rotation);
        this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1);
        return this;
    }
    /**
	 * Scales this matrix with the given scalar values.
	 *
	 * @param {number} sx - The amount to scale in the X axis.
	 * @param {number} sy - The amount to scale in the Y axis.
	 * @return {Matrix3} A reference to this matrix.
	 */ scale(sx, sy) {
        this.premultiply(_m3.makeScale(sx, sy));
        return this;
    }
    /**
	 * Rotates this matrix by the given angle.
	 *
	 * @param {number} theta - The rotation in radians.
	 * @return {Matrix3} A reference to this matrix.
	 */ rotate(theta) {
        this.premultiply(_m3.makeRotation(-theta));
        return this;
    }
    /**
	 * Translates this matrix by the given scalar values.
	 *
	 * @param {number} tx - The amount to translate in the X axis.
	 * @param {number} ty - The amount to translate in the Y axis.
	 * @return {Matrix3} A reference to this matrix.
	 */ translate(tx, ty) {
        this.premultiply(_m3.makeTranslation(tx, ty));
        return this;
    }
    // for 2D Transforms
    /**
	 * Sets this matrix as a 2D translation transform.
	 *
	 * @param {number|Vector2} x - The amount to translate in the X axis or alternatively a translation vector.
	 * @param {number} y - The amount to translate in the Y axis.
	 * @return {Matrix3} A reference to this matrix.
	 */ makeTranslation(x, y) {
        if (x.isVector2) {
            this.set(1, 0, x.x, 0, 1, x.y, 0, 0, 1);
        } else {
            this.set(1, 0, x, 0, 1, y, 0, 0, 1);
        }
        return this;
    }
    /**
	 * Sets this matrix as a 2D rotational transformation.
	 *
	 * @param {number} theta - The rotation in radians.
	 * @return {Matrix3} A reference to this matrix.
	 */ makeRotation(theta) {
        // counterclockwise
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(c, -s, 0, s, c, 0, 0, 0, 1);
        return this;
    }
    /**
	 * Sets this matrix as a 2D scale transform.
	 *
	 * @param {number} x - The amount to scale in the X axis.
	 * @param {number} y - The amount to scale in the Y axis.
	 * @return {Matrix3} A reference to this matrix.
	 */ makeScale(x, y) {
        this.set(x, 0, 0, 0, y, 0, 0, 0, 1);
        return this;
    }
    /**
	 * Returns `true` if this matrix is equal with the given one.
	 *
	 * @param {Matrix3} matrix - The matrix to test for equality.
	 * @return {boolean} Whether this matrix is equal with the given one.
	 */ equals(matrix) {
        const te = this.elements;
        const me = matrix.elements;
        for(let i = 0; i < 9; i++){
            if (te[i] !== me[i]) return false;
        }
        return true;
    }
    /**
	 * Sets the elements of the matrix from the given array.
	 *
	 * @param {Array<number>} array - The matrix elements in column-major order.
	 * @param {number} [offset=0] - Index of the first element in the array.
	 * @return {Matrix3} A reference to this matrix.
	 */ fromArray(array) {
        let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        for(let i = 0; i < 9; i++){
            this.elements[i] = array[i + offset];
        }
        return this;
    }
    /**
	 * Writes the elements of this matrix to the given array. If no array is provided,
	 * the method returns a new instance.
	 *
	 * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
	 * @param {number} [offset=0] - Index of the first element in the array.
	 * @return {Array<number>} The matrix elements in column-major order.
	 */ toArray() {
        let array = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        const te = this.elements;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        return array;
    }
    /**
	 * Returns a matrix with copied values from this instance.
	 *
	 * @return {Matrix3} A clone of this instance.
	 */ clone() {
        return new this.constructor().fromArray(this.elements);
    }
    /**
	 * Constructs a new 3x3 matrix. The arguments are supposed to be
	 * in row-major order. If no arguments are provided, the constructor
	 * initializes the matrix as an identity matrix.
	 *
	 * @param {number} [n11] - 1-1 matrix element.
	 * @param {number} [n12] - 1-2 matrix element.
	 * @param {number} [n13] - 1-3 matrix element.
	 * @param {number} [n21] - 2-1 matrix element.
	 * @param {number} [n22] - 2-2 matrix element.
	 * @param {number} [n23] - 2-3 matrix element.
	 * @param {number} [n31] - 3-1 matrix element.
	 * @param {number} [n32] - 3-2 matrix element.
	 * @param {number} [n33] - 3-3 matrix element.
	 */ constructor(n11, n12, n13, n21, n22, n23, n31, n32, n33){
        /**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */ Matrix3.prototype.isMatrix3 = true;
        /**
		 * A column-major list of matrix values.
		 *
		 * @type {Array<number>}
		 */ this.elements = [
            1,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1
        ];
        if (n11 !== undefined) {
            this.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
        }
    }
}
const _m3 = /*@__PURE__*/ new Matrix3();
;
}),
"[project]/frontend/landing/node_modules/three/src/math/ColorManagement.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ColorManagement",
    ()=>ColorManagement,
    "LinearToSRGB",
    ()=>LinearToSRGB,
    "SRGBToLinear",
    ()=>SRGBToLinear
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Matrix3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/Matrix3.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/utils.js [app-client] (ecmascript)");
;
;
;
const LINEAR_REC709_TO_XYZ = /*@__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Matrix3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix3"]().set(0.4123908, 0.3575843, 0.1804808, 0.2126390, 0.7151687, 0.0721923, 0.0193308, 0.1191948, 0.9505322);
const XYZ_TO_LINEAR_REC709 = /*@__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Matrix3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix3"]().set(3.2409699, -1.5373832, -0.4986108, -0.9692436, 1.8759675, 0.0415551, 0.0556301, -0.2039770, 1.0569715);
function createColorManagement() {
    const ColorManagement = {
        enabled: true,
        workingColorSpace: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearSRGBColorSpace"],
        /**
		 * Implementations of supported color spaces.
		 *
		 * Required:
		 *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
		 *	- whitePoint: reference white [ x y ]
		 *	- transfer: transfer function (pre-defined)
		 *	- toXYZ: Matrix3 RGB to XYZ transform
		 *	- fromXYZ: Matrix3 XYZ to RGB transform
		 *	- luminanceCoefficients: RGB luminance coefficients
		 *
		 * Optional:
		 *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace, toneMappingMode: 'extended' | 'standard' }
		 *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
		 *
		 * Reference:
		 * - https://www.russellcottrell.com/photo/matrixCalculator.htm
		 */ spaces: {},
        convert: function(color, sourceColorSpace, targetColorSpace) {
            if (this.enabled === false || sourceColorSpace === targetColorSpace || !sourceColorSpace || !targetColorSpace) {
                return color;
            }
            if (this.spaces[sourceColorSpace].transfer === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBTransfer"]) {
                color.r = SRGBToLinear(color.r);
                color.g = SRGBToLinear(color.g);
                color.b = SRGBToLinear(color.b);
            }
            if (this.spaces[sourceColorSpace].primaries !== this.spaces[targetColorSpace].primaries) {
                color.applyMatrix3(this.spaces[sourceColorSpace].toXYZ);
                color.applyMatrix3(this.spaces[targetColorSpace].fromXYZ);
            }
            if (this.spaces[targetColorSpace].transfer === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBTransfer"]) {
                color.r = LinearToSRGB(color.r);
                color.g = LinearToSRGB(color.g);
                color.b = LinearToSRGB(color.b);
            }
            return color;
        },
        workingToColorSpace: function(color, targetColorSpace) {
            return this.convert(color, this.workingColorSpace, targetColorSpace);
        },
        colorSpaceToWorking: function(color, sourceColorSpace) {
            return this.convert(color, sourceColorSpace, this.workingColorSpace);
        },
        getPrimaries: function(colorSpace) {
            return this.spaces[colorSpace].primaries;
        },
        getTransfer: function(colorSpace) {
            if (colorSpace === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoColorSpace"]) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearTransfer"];
            return this.spaces[colorSpace].transfer;
        },
        getToneMappingMode: function(colorSpace) {
            return this.spaces[colorSpace].outputColorSpaceConfig.toneMappingMode || 'standard';
        },
        getLuminanceCoefficients: function(target) {
            let colorSpace = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.workingColorSpace;
            return target.fromArray(this.spaces[colorSpace].luminanceCoefficients);
        },
        define: function(colorSpaces) {
            Object.assign(this.spaces, colorSpaces);
        },
        // Internal APIs
        _getMatrix: function(targetMatrix, sourceColorSpace, targetColorSpace) {
            return targetMatrix.copy(this.spaces[sourceColorSpace].toXYZ).multiply(this.spaces[targetColorSpace].fromXYZ);
        },
        _getDrawingBufferColorSpace: function(colorSpace) {
            return this.spaces[colorSpace].outputColorSpaceConfig.drawingBufferColorSpace;
        },
        _getUnpackColorSpace: function() {
            let colorSpace = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.workingColorSpace;
            return this.spaces[colorSpace].workingColorSpaceConfig.unpackColorSpace;
        },
        // Deprecated
        fromWorkingColorSpace: function(color, targetColorSpace) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warnOnce"])('THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().'); // @deprecated, r177
            return ColorManagement.workingToColorSpace(color, targetColorSpace);
        },
        toWorkingColorSpace: function(color, sourceColorSpace) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warnOnce"])('THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().'); // @deprecated, r177
            return ColorManagement.colorSpaceToWorking(color, sourceColorSpace);
        }
    };
    /******************************************************************************
	 * sRGB definitions
	 */ const REC709_PRIMARIES = [
        0.640,
        0.330,
        0.300,
        0.600,
        0.150,
        0.060
    ];
    const REC709_LUMINANCE_COEFFICIENTS = [
        0.2126,
        0.7152,
        0.0722
    ];
    const D65 = [
        0.3127,
        0.3290
    ];
    ColorManagement.define({
        [__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearSRGBColorSpace"]]: {
            primaries: REC709_PRIMARIES,
            whitePoint: D65,
            transfer: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearTransfer"],
            toXYZ: LINEAR_REC709_TO_XYZ,
            fromXYZ: XYZ_TO_LINEAR_REC709,
            luminanceCoefficients: REC709_LUMINANCE_COEFFICIENTS,
            workingColorSpaceConfig: {
                unpackColorSpace: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"]
            },
            outputColorSpaceConfig: {
                drawingBufferColorSpace: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"]
            }
        },
        [__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"]]: {
            primaries: REC709_PRIMARIES,
            whitePoint: D65,
            transfer: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBTransfer"],
            toXYZ: LINEAR_REC709_TO_XYZ,
            fromXYZ: XYZ_TO_LINEAR_REC709,
            luminanceCoefficients: REC709_LUMINANCE_COEFFICIENTS,
            outputColorSpaceConfig: {
                drawingBufferColorSpace: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"]
            }
        }
    });
    return ColorManagement;
}
const ColorManagement = /*@__PURE__*/ createColorManagement();
function SRGBToLinear(c) {
    return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
}
function LinearToSRGB(c) {
    return c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055;
}
}),
"[project]/frontend/landing/node_modules/three/src/extras/ImageUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImageUtils",
    ()=>ImageUtils
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$ColorManagement$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/ColorManagement.js [app-client] (ecmascript)");
;
;
let _canvas;
/**
 * A class containing utility functions for images.
 *
 * @hideconstructor
 */ class ImageUtils {
    /**
	 * Returns a data URI containing a representation of the given image.
	 *
	 * @param {(HTMLImageElement|HTMLCanvasElement)} image - The image object.
	 * @param {string} [type='image/png'] - Indicates the image format.
	 * @return {string} The data URI.
	 */ static getDataURL(image) {
        let type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'image/png';
        if (/^data:/i.test(image.src)) {
            return image.src;
        }
        if (typeof HTMLCanvasElement === 'undefined') {
            return image.src;
        }
        let canvas;
        if (image instanceof HTMLCanvasElement) {
            canvas = image;
        } else {
            if (_canvas === undefined) _canvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElementNS"])('canvas');
            _canvas.width = image.width;
            _canvas.height = image.height;
            const context = _canvas.getContext('2d');
            if (image instanceof ImageData) {
                context.putImageData(image, 0, 0);
            } else {
                context.drawImage(image, 0, 0, image.width, image.height);
            }
            canvas = _canvas;
        }
        return canvas.toDataURL(type);
    }
    /**
	 * Converts the given sRGB image data to linear color space.
	 *
	 * @param {(HTMLImageElement|HTMLCanvasElement|ImageBitmap|Object)} image - The image object.
	 * @return {HTMLCanvasElement|Object} The converted image.
	 */ static sRGBToLinear(image) {
        if (typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement || typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement || typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
            const canvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElementNS"])('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, image.width, image.height);
            const imageData = context.getImageData(0, 0, image.width, image.height);
            const data = imageData.data;
            for(let i = 0; i < data.length; i++){
                data[i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$ColorManagement$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBToLinear"])(data[i] / 255) * 255;
            }
            context.putImageData(imageData, 0, 0);
            return canvas;
        } else if (image.data) {
            const data = image.data.slice(0);
            for(let i = 0; i < data.length; i++){
                if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
                    data[i] = Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$ColorManagement$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBToLinear"])(data[i] / 255) * 255);
                } else {
                    // assuming float
                    data[i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$ColorManagement$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBToLinear"])(data[i]);
                }
            }
            return {
                data: data,
                width: image.width,
                height: image.height
            };
        } else {
            console.warn('THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.');
            return image;
        }
    }
}
;
}),
"[project]/frontend/landing/node_modules/three/src/textures/Source.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Source",
    ()=>Source
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$extras$2f$ImageUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/extras/ImageUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/MathUtils.js [app-client] (ecmascript)");
;
;
let _sourceId = 0;
/**
 * Represents the data source of a texture.
 *
 * The main purpose of this class is to decouple the data definition from the texture
 * definition so the same data can be used with multiple texture instances.
 */ class Source {
    /**
	 * Returns the dimensions of the source into the given target vector.
	 *
	 * @param {(Vector2|Vector3)} target - The target object the result is written into.
	 * @return {(Vector2|Vector3)} The dimensions of the source.
	 */ getSize(target) {
        const data = this.data;
        if (typeof HTMLVideoElement !== 'undefined' && data instanceof HTMLVideoElement) {
            target.set(data.videoWidth, data.videoHeight, 0);
        } else if (data instanceof VideoFrame) {
            target.set(data.displayHeight, data.displayWidth, 0);
        } else if (data !== null) {
            target.set(data.width, data.height, data.depth || 0);
        } else {
            target.set(0, 0, 0);
        }
        return target;
    }
    /**
	 * When the property is set to `true`, the engine allocates the memory
	 * for the texture (if necessary) and triggers the actual texture upload
	 * to the GPU next time the source is used.
	 *
	 * @type {boolean}
	 * @default false
	 * @param {boolean} value
	 */ set needsUpdate(value) {
        if (value === true) this.version++;
    }
    /**
	 * Serializes the source into JSON.
	 *
	 * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
	 * @return {Object} A JSON object representing the serialized source.
	 * @see {@link ObjectLoader#parse}
	 */ toJSON(meta) {
        const isRootObject = meta === undefined || typeof meta === 'string';
        if (!isRootObject && meta.images[this.uuid] !== undefined) {
            return meta.images[this.uuid];
        }
        const output = {
            uuid: this.uuid,
            url: ''
        };
        const data = this.data;
        if (data !== null) {
            let url;
            if (Array.isArray(data)) {
                // cube texture
                url = [];
                for(let i = 0, l = data.length; i < l; i++){
                    if (data[i].isDataTexture) {
                        url.push(serializeImage(data[i].image));
                    } else {
                        url.push(serializeImage(data[i]));
                    }
                }
            } else {
                // texture
                url = serializeImage(data);
            }
            output.url = url;
        }
        if (!isRootObject) {
            meta.images[this.uuid] = output;
        }
        return output;
    }
    /**
	 * Constructs a new video texture.
	 *
	 * @param {any} [data=null] - The data definition of a texture.
	 */ constructor(data = null){
        /**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */ this.isSource = true;
        /**
		 * The ID of the source.
		 *
		 * @name Source#id
		 * @type {number}
		 * @readonly
		 */ Object.defineProperty(this, 'id', {
            value: _sourceId++
        });
        /**
		 * The UUID of the source.
		 *
		 * @type {string}
		 * @readonly
		 */ this.uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateUUID"])();
        /**
		 * The data definition of a texture.
		 *
		 * @type {any}
		 */ this.data = data;
        /**
		 * This property is only relevant when {@link Source#needsUpdate} is set to `true` and
		 * provides more control on how texture data should be processed. When `dataReady` is set
		 * to `false`, the engine performs the memory allocation (if necessary) but does not transfer
		 * the data into the GPU memory.
		 *
		 * @type {boolean}
		 * @default true
		 */ this.dataReady = true;
        /**
		 * This starts at `0` and counts how many times {@link Source#needsUpdate} is set to `true`.
		 *
		 * @type {number}
		 * @readonly
		 * @default 0
		 */ this.version = 0;
    }
}
function serializeImage(image) {
    if (typeof HTMLImageElement !== 'undefined' && image instanceof HTMLImageElement || typeof HTMLCanvasElement !== 'undefined' && image instanceof HTMLCanvasElement || typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
        // default images
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$extras$2f$ImageUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageUtils"].getDataURL(image);
    } else {
        if (image.data) {
            // images of DataTexture
            return {
                data: Array.from(image.data),
                width: image.width,
                height: image.height,
                type: image.data.constructor.name
            };
        } else {
            console.warn('THREE.Texture: Unable to serialize Texture.');
            return {};
        }
    }
}
;
}),
"[project]/frontend/landing/node_modules/three/src/textures/Texture.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Texture",
    ()=>Texture
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$core$2f$EventDispatcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/core/EventDispatcher.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/MathUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Vector2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/Vector2.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Vector3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/Vector3.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Matrix3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/math/Matrix3.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$textures$2f$Source$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/textures/Source.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
let _textureId = 0;
const _tempVec3 = /*@__PURE__*/ new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Vector3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
/**
 * Base class for all textures.
 *
 * Note: After the initial use of a texture, its dimensions, format, and type
 * cannot be changed. Instead, call {@link Texture#dispose} on the texture and instantiate a new one.
 *
 * @augments EventDispatcher
 */ class Texture extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$core$2f$EventDispatcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventDispatcher"] {
    /**
	 * The width of the texture in pixels.
	 */ get width() {
        return this.source.getSize(_tempVec3).x;
    }
    /**
	 * The height of the texture in pixels.
	 */ get height() {
        return this.source.getSize(_tempVec3).y;
    }
    /**
	 * The depth of the texture in pixels.
	 */ get depth() {
        return this.source.getSize(_tempVec3).z;
    }
    /**
	 * The image object holding the texture data.
	 *
	 * @type {?Object}
	 */ get image() {
        return this.source.data;
    }
    set image(value) {
        if (value === void 0) value = null;
        this.source.data = value;
    }
    /**
	 * Updates the texture transformation matrix from the from the properties {@link Texture#offset},
	 * {@link Texture#repeat}, {@link Texture#rotation}, and {@link Texture#center}.
	 */ updateMatrix() {
        this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    /**
	 * Adds a range of data in the data texture to be updated on the GPU.
	 *
	 * @param {number} start - Position at which to start update.
	 * @param {number} count - The number of components to update.
	 */ addUpdateRange(start, count) {
        this.updateRanges.push({
            start,
            count
        });
    }
    /**
	 * Clears the update ranges.
	 */ clearUpdateRanges() {
        this.updateRanges.length = 0;
    }
    /**
	 * Returns a new texture with copied values from this instance.
	 *
	 * @return {Texture} A clone of this instance.
	 */ clone() {
        return new this.constructor().copy(this);
    }
    /**
	 * Copies the values of the given texture to this instance.
	 *
	 * @param {Texture} source - The texture to copy.
	 * @return {Texture} A reference to this instance.
	 */ copy(source) {
        this.name = source.name;
        this.source = source.source;
        this.mipmaps = source.mipmaps.slice(0);
        this.mapping = source.mapping;
        this.channel = source.channel;
        this.wrapS = source.wrapS;
        this.wrapT = source.wrapT;
        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;
        this.anisotropy = source.anisotropy;
        this.format = source.format;
        this.internalFormat = source.internalFormat;
        this.type = source.type;
        this.offset.copy(source.offset);
        this.repeat.copy(source.repeat);
        this.center.copy(source.center);
        this.rotation = source.rotation;
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrix.copy(source.matrix);
        this.generateMipmaps = source.generateMipmaps;
        this.premultiplyAlpha = source.premultiplyAlpha;
        this.flipY = source.flipY;
        this.unpackAlignment = source.unpackAlignment;
        this.colorSpace = source.colorSpace;
        this.renderTarget = source.renderTarget;
        this.isRenderTargetTexture = source.isRenderTargetTexture;
        this.isArrayTexture = source.isArrayTexture;
        this.userData = JSON.parse(JSON.stringify(source.userData));
        this.needsUpdate = true;
        return this;
    }
    /**
	 * Sets this texture's properties based on `values`.
	 * @param {Object} values - A container with texture parameters.
	 */ setValues(values) {
        for(const key in values){
            const newValue = values[key];
            if (newValue === undefined) {
                console.warn("THREE.Texture.setValues(): parameter '".concat(key, "' has value of undefined."));
                continue;
            }
            const currentValue = this[key];
            if (currentValue === undefined) {
                console.warn("THREE.Texture.setValues(): property '".concat(key, "' does not exist."));
                continue;
            }
            if (currentValue && newValue && currentValue.isVector2 && newValue.isVector2) {
                currentValue.copy(newValue);
            } else if (currentValue && newValue && currentValue.isVector3 && newValue.isVector3) {
                currentValue.copy(newValue);
            } else if (currentValue && newValue && currentValue.isMatrix3 && newValue.isMatrix3) {
                currentValue.copy(newValue);
            } else {
                this[key] = newValue;
            }
        }
    }
    /**
	 * Serializes the texture into JSON.
	 *
	 * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
	 * @return {Object} A JSON object representing the serialized texture.
	 * @see {@link ObjectLoader#parse}
	 */ toJSON(meta) {
        const isRootObject = meta === undefined || typeof meta === 'string';
        if (!isRootObject && meta.textures[this.uuid] !== undefined) {
            return meta.textures[this.uuid];
        }
        const output = {
            metadata: {
                version: 4.7,
                type: 'Texture',
                generator: 'Texture.toJSON'
            },
            uuid: this.uuid,
            name: this.name,
            image: this.source.toJSON(meta).uuid,
            mapping: this.mapping,
            channel: this.channel,
            repeat: [
                this.repeat.x,
                this.repeat.y
            ],
            offset: [
                this.offset.x,
                this.offset.y
            ],
            center: [
                this.center.x,
                this.center.y
            ],
            rotation: this.rotation,
            wrap: [
                this.wrapS,
                this.wrapT
            ],
            format: this.format,
            internalFormat: this.internalFormat,
            type: this.type,
            colorSpace: this.colorSpace,
            minFilter: this.minFilter,
            magFilter: this.magFilter,
            anisotropy: this.anisotropy,
            flipY: this.flipY,
            generateMipmaps: this.generateMipmaps,
            premultiplyAlpha: this.premultiplyAlpha,
            unpackAlignment: this.unpackAlignment
        };
        if (Object.keys(this.userData).length > 0) output.userData = this.userData;
        if (!isRootObject) {
            meta.textures[this.uuid] = output;
        }
        return output;
    }
    /**
	 * Frees the GPU-related resources allocated by this instance. Call this
	 * method whenever this instance is no longer used in your app.
	 *
	 * @fires Texture#dispose
	 */ dispose() {
        /**
		 * Fires when the texture has been disposed of.
		 *
		 * @event Texture#dispose
		 * @type {Object}
		 */ this.dispatchEvent({
            type: 'dispose'
        });
    }
    /**
	 * Transforms the given uv vector with the textures uv transformation matrix.
	 *
	 * @param {Vector2} uv - The uv vector.
	 * @return {Vector2} The transformed uv vector.
	 */ transformUv(uv) {
        if (this.mapping !== __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UVMapping"]) return uv;
        uv.applyMatrix3(this.matrix);
        if (uv.x < 0 || uv.x > 1) {
            switch(this.wrapS){
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepeatWrapping"]:
                    uv.x = uv.x - Math.floor(uv.x);
                    break;
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClampToEdgeWrapping"]:
                    uv.x = uv.x < 0 ? 0 : 1;
                    break;
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MirroredRepeatWrapping"]:
                    if (Math.abs(Math.floor(uv.x) % 2) === 1) {
                        uv.x = Math.ceil(uv.x) - uv.x;
                    } else {
                        uv.x = uv.x - Math.floor(uv.x);
                    }
                    break;
            }
        }
        if (uv.y < 0 || uv.y > 1) {
            switch(this.wrapT){
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepeatWrapping"]:
                    uv.y = uv.y - Math.floor(uv.y);
                    break;
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClampToEdgeWrapping"]:
                    uv.y = uv.y < 0 ? 0 : 1;
                    break;
                case __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MirroredRepeatWrapping"]:
                    if (Math.abs(Math.floor(uv.y) % 2) === 1) {
                        uv.y = Math.ceil(uv.y) - uv.y;
                    } else {
                        uv.y = uv.y - Math.floor(uv.y);
                    }
                    break;
            }
        }
        if (this.flipY) {
            uv.y = 1 - uv.y;
        }
        return uv;
    }
    /**
	 * Setting this property to `true` indicates the engine the texture
	 * must be updated in the next render. This triggers a texture upload
	 * to the GPU and ensures correct texture parameter configuration.
	 *
	 * @type {boolean}
	 * @default false
	 * @param {boolean} value
	 */ set needsUpdate(value) {
        if (value === true) {
            this.version++;
            this.source.needsUpdate = true;
        }
    }
    /**
	 * Setting this property to `true` indicates the engine the PMREM
	 * must be regenerated.
	 *
	 * @type {boolean}
	 * @default false
	 * @param {boolean} value
	 */ set needsPMREMUpdate(value) {
        if (value === true) {
            this.pmremVersion++;
        }
    }
    /**
	 * Constructs a new texture.
	 *
	 * @param {?Object} [image=Texture.DEFAULT_IMAGE] - The image holding the texture data.
	 * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
	 * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
	 * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
	 * @param {number} [magFilter=LinearFilter] - The mag filter value.
	 * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
	 * @param {number} [format=RGBAFormat] - The texture format.
	 * @param {number} [type=UnsignedByteType] - The texture type.
	 * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
	 * @param {string} [colorSpace=NoColorSpace] - The color space.
	 */ constructor(image = Texture.DEFAULT_IMAGE, mapping = Texture.DEFAULT_MAPPING, wrapS = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClampToEdgeWrapping"], wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClampToEdgeWrapping"], magFilter = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearFilter"], minFilter = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LinearMipmapLinearFilter"], format = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RGBAFormat"], type = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UnsignedByteType"], anisotropy = Texture.DEFAULT_ANISOTROPY, colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoColorSpace"]){
        super();
        /**
		 * This flag can be used for type testing.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default true
		 */ this.isTexture = true;
        /**
		 * The ID of the texture.
		 *
		 * @name Texture#id
		 * @type {number}
		 * @readonly
		 */ Object.defineProperty(this, 'id', {
            value: _textureId++
        });
        /**
		 * The UUID of the material.
		 *
		 * @type {string}
		 * @readonly
		 */ this.uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$MathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateUUID"])();
        /**
		 * The name of the material.
		 *
		 * @type {string}
		 */ this.name = '';
        /**
		 * The data definition of a texture. A reference to the data source can be
		 * shared across textures. This is often useful in context of spritesheets
		 * where multiple textures render the same data but with different texture
		 * transformations.
		 *
		 * @type {Source}
		 */ this.source = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$textures$2f$Source$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Source"](image);
        /**
		 * An array holding user-defined mipmaps.
		 *
		 * @type {Array<Object>}
		 */ this.mipmaps = [];
        /**
		 * How the texture is applied to the object. The value `UVMapping`
		 * is the default, where texture or uv coordinates are used to apply the map.
		 *
		 * @type {(UVMapping|CubeReflectionMapping|CubeRefractionMapping|EquirectangularReflectionMapping|EquirectangularRefractionMapping|CubeUVReflectionMapping)}
		 * @default UVMapping
		*/ this.mapping = mapping;
        /**
		 * Lets you select the uv attribute to map the texture to. `0` for `uv`,
		 * `1` for `uv1`, `2` for `uv2` and `3` for `uv3`.
		 *
		 * @type {number}
		 * @default 0
		 */ this.channel = 0;
        /**
		 * This defines how the texture is wrapped horizontally and corresponds to
		 * *U* in UV mapping.
		 *
		 * @type {(RepeatWrapping|ClampToEdgeWrapping|MirroredRepeatWrapping)}
		 * @default ClampToEdgeWrapping
		 */ this.wrapS = wrapS;
        /**
		 * This defines how the texture is wrapped horizontally and corresponds to
		 * *V* in UV mapping.
		 *
		 * @type {(RepeatWrapping|ClampToEdgeWrapping|MirroredRepeatWrapping)}
		 * @default ClampToEdgeWrapping
		 */ this.wrapT = wrapT;
        /**
		 * How the texture is sampled when a texel covers more than one pixel.
		 *
		 * @type {(NearestFilter|NearestMipmapNearestFilter|NearestMipmapLinearFilter|LinearFilter|LinearMipmapNearestFilter|LinearMipmapLinearFilter)}
		 * @default LinearFilter
		 */ this.magFilter = magFilter;
        /**
		 * How the texture is sampled when a texel covers less than one pixel.
		 *
		 * @type {(NearestFilter|NearestMipmapNearestFilter|NearestMipmapLinearFilter|LinearFilter|LinearMipmapNearestFilter|LinearMipmapLinearFilter)}
		 * @default LinearMipmapLinearFilter
		 */ this.minFilter = minFilter;
        /**
		 * The number of samples taken along the axis through the pixel that has the
		 * highest density of texels. By default, this value is `1`. A higher value
		 * gives a less blurry result than a basic mipmap, at the cost of more
		 * texture samples being used.
		 *
		 * @type {number}
		 * @default 0
		 */ this.anisotropy = anisotropy;
        /**
		 * The format of the texture.
		 *
		 * @type {number}
		 * @default RGBAFormat
		 */ this.format = format;
        /**
		 * The default internal format is derived from {@link Texture#format} and {@link Texture#type} and
		 * defines how the texture data is going to be stored on the GPU.
		 *
		 * This property allows to overwrite the default format.
		 *
		 * @type {?string}
		 * @default null
		 */ this.internalFormat = null;
        /**
		 * The data type of the texture.
		 *
		 * @type {number}
		 * @default UnsignedByteType
		 */ this.type = type;
        /**
		 * How much a single repetition of the texture is offset from the beginning,
		 * in each direction U and V. Typical range is `0.0` to `1.0`.
		 *
		 * @type {Vector2}
		 * @default (0,0)
		 */ this.offset = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Vector2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](0, 0);
        /**
		 * How many times the texture is repeated across the surface, in each
		 * direction U and V. If repeat is set greater than `1` in either direction,
		 * the corresponding wrap parameter should also be set to `RepeatWrapping`
		 * or `MirroredRepeatWrapping` to achieve the desired tiling effect.
		 *
		 * @type {Vector2}
		 * @default (1,1)
		 */ this.repeat = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Vector2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](1, 1);
        /**
		 * The point around which rotation occurs. A value of `(0.5, 0.5)` corresponds
		 * to the center of the texture. Default is `(0, 0)`, the lower left.
		 *
		 * @type {Vector2}
		 * @default (0,0)
		 */ this.center = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Vector2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"](0, 0);
        /**
		 * How much the texture is rotated around the center point, in radians.
		 * Positive values are counter-clockwise.
		 *
		 * @type {number}
		 * @default 0
		 */ this.rotation = 0;
        /**
		 * Whether to update the texture's uv-transformation {@link Texture#matrix}
		 * from the properties {@link Texture#offset}, {@link Texture#repeat},
		 * {@link Texture#rotation}, and {@link Texture#center}.
		 *
		 * Set this to `false` if you are specifying the uv-transform matrix directly.
		 *
		 * @type {boolean}
		 * @default true
		 */ this.matrixAutoUpdate = true;
        /**
		 * The uv-transformation matrix of the texture.
		 *
		 * @type {Matrix3}
		 */ this.matrix = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$math$2f$Matrix3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Matrix3"]();
        /**
		 * Whether to generate mipmaps (if possible) for a texture.
		 *
		 * Set this to `false` if you are creating mipmaps manually.
		 *
		 * @type {boolean}
		 * @default true
		 */ this.generateMipmaps = true;
        /**
		 * If set to `true`, the alpha channel, if present, is multiplied into the
		 * color channels when the texture is uploaded to the GPU.
		 *
		 * Note that this property has no effect when using `ImageBitmap`. You need to
		 * configure premultiply alpha on bitmap creation instead.
		 *
		 * @type {boolean}
		 * @default false
		 */ this.premultiplyAlpha = false;
        /**
		 * If set to `true`, the texture is flipped along the vertical axis when
		 * uploaded to the GPU.
		 *
		 * Note that this property has no effect when using `ImageBitmap`. You need to
		 * configure the flip on bitmap creation instead.
		 *
		 * @type {boolean}
		 * @default true
		 */ this.flipY = true;
        /**
		 * Specifies the alignment requirements for the start of each pixel row in memory.
		 * The allowable values are `1` (byte-alignment), `2` (rows aligned to even-numbered bytes),
		 * `4` (word-alignment), and `8` (rows start on double-word boundaries).
		 *
		 * @type {number}
		 * @default 4
		 */ this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
        /**
		 * Textures containing color data should be annotated with `SRGBColorSpace` or `LinearSRGBColorSpace`.
		 *
		 * @type {string}
		 * @default NoColorSpace
		 */ this.colorSpace = colorSpace;
        /**
		 * An object that can be used to store custom data about the texture. It
		 * should not hold references to functions as these will not be cloned.
		 *
		 * @type {Object}
		 */ this.userData = {};
        /**
		 * This can be used to only update a subregion or specific rows of the texture (for example, just the
		 * first 3 rows). Use the `addUpdateRange()` function to add ranges to this array.
		 *
		 * @type {Array<Object>}
		 */ this.updateRanges = [];
        /**
		 * This starts at `0` and counts how many times {@link Texture#needsUpdate} is set to `true`.
		 *
		 * @type {number}
		 * @readonly
		 * @default 0
		 */ this.version = 0;
        /**
		 * A callback function, called when the texture is updated (e.g., when
		 * {@link Texture#needsUpdate} has been set to true and then the texture is used).
		 *
		 * @type {?Function}
		 * @default null
		 */ this.onUpdate = null;
        /**
		 * An optional back reference to the textures render target.
		 *
		 * @type {?(RenderTarget|WebGLRenderTarget)}
		 * @default null
		 */ this.renderTarget = null;
        /**
		 * Indicates whether a texture belongs to a render target or not.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default false
		 */ this.isRenderTargetTexture = false;
        /**
		 * Indicates if a texture should be handled like a texture array.
		 *
		 * @type {boolean}
		 * @readonly
		 * @default false
		 */ this.isArrayTexture = image && image.depth && image.depth > 1 ? true : false;
        /**
		 * Indicates whether this texture should be processed by `PMREMGenerator` or not
		 * (only relevant for render target textures).
		 *
		 * @type {number}
		 * @readonly
		 * @default 0
		 */ this.pmremVersion = 0;
    }
}
/**
 * The default image for all textures.
 *
 * @static
 * @type {?Image}
 * @default null
 */ Texture.DEFAULT_IMAGE = null;
/**
 * The default mapping for all textures.
 *
 * @static
 * @type {number}
 * @default UVMapping
 */ Texture.DEFAULT_MAPPING = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UVMapping"];
/**
 * The default anisotropy value for all textures.
 *
 * @static
 * @type {number}
 * @default 1
 */ Texture.DEFAULT_ANISOTROPY = 1;
;
}),
"[project]/frontend/landing/node_modules/three/src/loaders/TextureLoader.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextureLoader",
    ()=>TextureLoader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$ImageLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/loaders/ImageLoader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$textures$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/textures/Texture.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/landing/node_modules/three/src/loaders/Loader.js [app-client] (ecmascript)");
;
;
;
/**
 * Class for loading textures. Images are internally
 * loaded via {@link ImageLoader}.
 *
 * ```js
 * const loader = new THREE.TextureLoader();
 * const texture = await loader.loadAsync( 'textures/land_ocean_ice_cloud_2048.jpg' );
 *
 * const material = new THREE.MeshBasicMaterial( { map:texture } );
 * ```
 * Please note that `TextureLoader` has dropped support for progress
 * events in `r84`. For a `TextureLoader` that supports progress events, see
 * [this thread]{@link https://github.com/mrdoob/three.js/issues/10439#issuecomment-293260145}.
 *
 * @augments Loader
 */ class TextureLoader extends __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$Loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Loader"] {
    /**
	 * Starts loading from the given URL and pass the fully loaded texture
	 * to the `onLoad()` callback. The method also returns a new texture object which can
	 * directly be used for material creation. If you do it this way, the texture
	 * may pop up in your scene once the respective loading process is finished.
	 *
	 * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	 * @param {function(Texture)} onLoad - Executed when the loading process has been finished.
	 * @param {onProgressCallback} onProgress - Unsupported in this loader.
	 * @param {onErrorCallback} onError - Executed when errors occur.
	 * @return {Texture} The texture.
	 */ load(url, onLoad, onProgress, onError) {
        const texture = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$textures$2f$Texture$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Texture"]();
        const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$landing$2f$node_modules$2f$three$2f$src$2f$loaders$2f$ImageLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageLoader"](this.manager);
        loader.setCrossOrigin(this.crossOrigin);
        loader.setPath(this.path);
        loader.load(url, function(image) {
            texture.image = image;
            texture.needsUpdate = true;
            if (onLoad !== undefined) {
                onLoad(texture);
            }
        }, onProgress, onError);
        return texture;
    }
    /**
	 * Constructs a new texture loader.
	 *
	 * @param {LoadingManager} [manager] - The loading manager.
	 */ constructor(manager){
        super(manager);
    }
}
;
}),
]);

//# sourceMappingURL=bdc20_three_src_0580cc93._.js.map