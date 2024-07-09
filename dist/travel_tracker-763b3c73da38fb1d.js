let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b)
});

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_24(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h77f8b3f955b62352(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_27(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h9c31f25252ac388a(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbe04fb7071009fed(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_33(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he23fa68ee57bbc4d(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_36(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hebe47264f46f1609(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_39(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha74985cfdedd7715(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h5ecfdd1cea6e5fca(arg0, arg1, addHeapObject(arg2));
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function __wbg_adapter_45(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf362b500f311e43c(arg0, arg1);
}

function __wbg_adapter_48(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h6b21f4b6f55cb356(arg0, arg1, addHeapObject(arg2));
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
function __wbg_adapter_361(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h8ad324bb5dd799be(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0));
/**
*/
export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr);
    }
    /**
    * @returns {string}
    */
    get type() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.intounderlyingbytesource_type(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getCachedStringFromWasm0(r0, r1);
        if (r0 !== 0) { wasm.__wbindgen_free(r0, r1, 1); }
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}
/**
* @returns {number}
*/
get autoAllocateChunkSize() {
    const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
    return ret >>> 0;
}
/**
* @param {ReadableByteStreamController} controller
*/
start(controller) {
    wasm.intounderlyingbytesource_start(this.__wbg_ptr, addHeapObject(controller));
}
/**
* @param {ReadableByteStreamController} controller
* @returns {Promise<any>}
*/
pull(controller) {
    const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, addHeapObject(controller));
    return takeObject(ret);
}
/**
*/
cancel() {
    const ptr = this.__destroy_into_raw();
    wasm.intounderlyingbytesource_cancel(ptr);
}
}

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0));
/**
*/
export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr);
    }
    /**
    * @param {any} chunk
    * @returns {Promise<any>}
    */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, addHeapObject(chunk));
        return takeObject(ret);
    }
    /**
    * @returns {Promise<any>}
    */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return takeObject(ret);
    }
    /**
    * @param {any} reason
    * @returns {Promise<any>}
    */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, addHeapObject(reason));
        return takeObject(ret);
    }
}

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0));
/**
*/
export class IntoUnderlyingSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr);
    }
    /**
    * @param {ReadableStreamDefaultController} controller
    * @returns {Promise<any>}
    */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, addHeapObject(controller));
        return takeObject(ret);
    }
    /**
    */
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1, 1); }
    console.error(v0);
};
imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
    const ret = new Error();
    return addHeapObject(ret);
};
imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};
imports.wbg.__wbindgen_is_string = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};
imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};
imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};
imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1));
}, arguments) };
imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};
imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};
imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};
imports.wbg.__wbg_on_bb371111a160a02d = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).on(v0, getObject(arg3));
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_3fbad3659d4787be = function(arg0) {
    const ret = new L.Icon(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_seticonUrl_5d54f21d67acc8ff = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).iconUrl = v0;
};
imports.wbg.__wbg_seticonSize_f5afed529582d8a1 = function(arg0, arg1) {
    getObject(arg0).iconSize = takeObject(arg1);
};
imports.wbg.__wbg_seticonAnchor_4925472d0698f7b0 = function(arg0, arg1) {
    getObject(arg0).iconAnchor = takeObject(arg1);
};
imports.wbg.__wbg_new_54c7f1da850bf3e2 = function(arg0, arg1) {
    const ret = new L.LatLng(arg0, arg1);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithoptions_b37ad6de85c29c0c = function(arg0, arg1) {
    const ret = new L.Polygon(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithoptions_f44672de024bc53c = function(arg0, arg1) {
    const ret = new L.Polyline(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setLatLngs_f10ae0bfd02b1a43 = function(arg0, arg1) {
    const ret = getObject(arg0).setLatLngs(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setsmoothFactor_6acb2f612cee9d00 = function(arg0, arg1) {
    getObject(arg0).smoothFactor = arg1;
};
imports.wbg.__wbg_setnoClip_33dc5402373d2c1a = function(arg0, arg1) {
    getObject(arg0).noClip = arg1 !== 0;
};
imports.wbg.__wbg_Tooltip_c46d5941b53c08d6 = function(arg0, arg1) {
    const ret = new L.Tooltip(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithlatlng_005cb9a2453e593c = function(arg0, arg1) {
    const ret = new L.Tooltip(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setContent_85f837de8c111e60 = function(arg0, arg1) {
    const ret = getObject(arg0).setContent(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setdirection_477d23b4389a8af7 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).direction = v0;
};
imports.wbg.__wbg_setpermanent_9038bc16f4febd1d = function(arg0, arg1) {
    getObject(arg0).permanent = arg1 !== 0;
};
imports.wbg.__wbg_setsticky_5262e3efb20cbba5 = function(arg0, arg1) {
    getObject(arg0).sticky = arg1 !== 0;
};
imports.wbg.__wbg_setopacity_a04eb4fb091fd0aa = function(arg0, arg1) {
    getObject(arg0).opacity = arg1;
};
imports.wbg.__wbg_setContent_ab74df6ab72ac315 = function(arg0, arg1) {
    const ret = getObject(arg0).setContent(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_openOn_15943d105a3619bc = function(arg0, arg1) {
    getObject(arg0).openOn(getObject(arg1));
};
imports.wbg.__wbg_newwithoptions_483eebc520bc7561 = function(arg0, arg1) {
    const ret = new L.Marker(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setOpacity_f4322c9c3adc11e8 = function(arg0, arg1) {
    getObject(arg0).setOpacity(arg1);
};
imports.wbg.__wbg_setLatLng_0fd7e52933626718 = function(arg0, arg1) {
    getObject(arg0).setLatLng(getObject(arg1));
};
imports.wbg.__wbg_dragging_0573ad7ae5e091f8 = function(arg0) {
    const ret = getObject(arg0).dragging;
    return addHeapObject(ret);
};
imports.wbg.__wbg_seticon_691c15e3b755b9f7 = function(arg0, arg1) {
    getObject(arg0).icon = takeObject(arg1);
};
imports.wbg.__wbg_setkeyboard_e7c7ef48fb3c6f6e = function(arg0, arg1) {
    getObject(arg0).keyboard = arg1 !== 0;
};
imports.wbg.__wbg_settitle_ffa05b0a8f2df27c = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).title = v0;
};
imports.wbg.__wbg_setalt_1971c852a1f062f3 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).alt = v0;
};
imports.wbg.__wbg_setzIndexOffset_2599ea9dac6b48e9 = function(arg0, arg1) {
    getObject(arg0).zIndexOffset = arg1;
};
imports.wbg.__wbg_setopacity_76b33b18af6cf8a1 = function(arg0, arg1) {
    getObject(arg0).opacity = arg1;
};
imports.wbg.__wbg_setriseOnHover_6c93b57362f2fad3 = function(arg0, arg1) {
    getObject(arg0).riseOnHover = arg1 !== 0;
};
imports.wbg.__wbg_setriseOffset_ba126f6f50a37b6f = function(arg0, arg1) {
    getObject(arg0).riseOffset = arg1;
};
imports.wbg.__wbg_setpane_056bff6554482ee4 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).pane = v0;
};
imports.wbg.__wbg_setshadowPane_408beb2f17301f76 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).shadowPane = v0;
};
imports.wbg.__wbg_setbubblingMouseEvents_0d174fc6a5b74281 = function(arg0, arg1) {
    getObject(arg0).bubblingMouseEvents = arg1 !== 0;
};
imports.wbg.__wbg_setdraggable_0dc6d7932728a413 = function(arg0, arg1) {
    getObject(arg0).draggable = arg1 !== 0;
};
imports.wbg.__wbg_setautoPan_63d0348fb87a696b = function(arg0, arg1) {
    getObject(arg0).autoPan = arg1 !== 0;
};
imports.wbg.__wbg_setautoPanPadding_91a9b9e4d9b0da9f = function(arg0, arg1) {
    getObject(arg0).autoPanPadding = takeObject(arg1);
};
imports.wbg.__wbg_setautoPanSpeed_d2e531dd8e820ea3 = function(arg0, arg1) {
    getObject(arg0).autoPanSpeed = arg1;
};
imports.wbg.__wbg_setinteractive_f867937f5332275f = function(arg0, arg1) {
    getObject(arg0).interactive = arg1 !== 0;
};
imports.wbg.__wbg_setattribution_56f32d84b24bb297 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).attribution = v0;
};
imports.wbg.__wbg_newwithoptions_2d3002678da94d9f = function(arg0, arg1) {
    const ret = new L.Circle(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setStyle_2620df7a2e5c1962 = function(arg0, arg1) {
    const ret = getObject(arg0).setStyle(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setRadius_4349dd5515b95d8e = function(arg0, arg1) {
    getObject(arg0).setRadius(arg1);
};
imports.wbg.__wbg_new_22a56583d310ebbe = function(arg0) {
    const ret = new L.DivIcon(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_seticonSize_b3f7ea93610b88a9 = function(arg0, arg1) {
    getObject(arg0).iconSize = takeObject(arg1);
};
imports.wbg.__wbg_seticonAnchor_6c42975fb1942581 = function(arg0, arg1) {
    getObject(arg0).iconAnchor = takeObject(arg1);
};
imports.wbg.__wbg_setclassName_942c073aeb437d18 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).className = v0;
};
imports.wbg.__wbg_bringToFront_006e7c5983b8a088 = function(arg0) {
    const ret = getObject(arg0).bringToFront();
    return addHeapObject(ret);
};
imports.wbg.__wbg_bringToBack_19c77dbedd359931 = function(arg0) {
    const ret = getObject(arg0).bringToBack();
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_20b3859723b176af = function(arg0, arg1) {
    const ret = new L.Point(arg0, arg1);
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_db95c803c2d9b064 = function(arg0, arg1) {
    const ret = new L.Popup(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithlatlng_652ea7b4308b0f2b = function(arg0, arg1) {
    const ret = new L.Popup(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setpane_a65ed287d904515e = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).pane = v0;
};
imports.wbg.__wbg_setoffset_dfd947800b01c71f = function(arg0, arg1) {
    getObject(arg0).offset = takeObject(arg1);
};
imports.wbg.__wbg_setminWidth_32aa823050d5cf7d = function(arg0, arg1) {
    getObject(arg0).minWidth = arg1;
};
imports.wbg.__wbg_setmaxWidth_26fcf6716a4ca6ee = function(arg0, arg1) {
    getObject(arg0).maxWidth = arg1;
};
imports.wbg.__wbg_setautoPan_701ab2ad17013e33 = function(arg0, arg1) {
    getObject(arg0).autoPan = arg1 !== 0;
};
imports.wbg.__wbg_setautoPanPaddingTopLeft_58039787c37f7280 = function(arg0, arg1) {
    getObject(arg0).autoPanPaddingTopLeft = takeObject(arg1);
};
imports.wbg.__wbg_setautoPanPaddingBottomRight_21dfb3477d1c5138 = function(arg0, arg1) {
    getObject(arg0).autoPanPaddingBottomRight = takeObject(arg1);
};
imports.wbg.__wbg_setautoPanPadding_82ada91c9480bd6c = function(arg0, arg1) {
    getObject(arg0).autoPanPadding = takeObject(arg1);
};
imports.wbg.__wbg_setkeepInView_f05b862f578bf69e = function(arg0, arg1) {
    getObject(arg0).keepInView = arg1 !== 0;
};
imports.wbg.__wbg_setcloseButton_085cdd35632213a5 = function(arg0, arg1) {
    getObject(arg0).closeButton = arg1 !== 0;
};
imports.wbg.__wbg_setautoClose_7cc686d04d97179e = function(arg0, arg1) {
    getObject(arg0).autoClose = arg1 !== 0;
};
imports.wbg.__wbg_setcloseOnEscapeKey_90a20c5fce4fb878 = function(arg0, arg1) {
    getObject(arg0).closeOnEscapeKey = arg1 !== 0;
};
imports.wbg.__wbg_setcloseOnClick_d45c0926e57b7d5d = function(arg0, arg1) {
    getObject(arg0).closeOnClick = arg1 !== 0;
};
imports.wbg.__wbg_setclassName_e1b7e6eb1f7b4642 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).className = v0;
};
imports.wbg.__wbg_newoptions_fb798c0c7c80dff1 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new L.TileLayer(v0, getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setattribution_ee40d57630eb41e9 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).attribution = v0;
};
imports.wbg.__wbg_locate_91ce9e58b4246e44 = function(arg0, arg1) {
    const ret = getObject(arg0).locate(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_remove_f331fc54d55415d5 = function(arg0) {
    const ret = getObject(arg0).remove();
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_37921c6ca585d1f4 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new L.Map(v0, getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setcenter_81d7bba7174e30d9 = function(arg0, arg1) {
    getObject(arg0).center = takeObject(arg1);
};
imports.wbg.__wbg_setzoom_4d42dd146d80ebab = function(arg0, arg1) {
    getObject(arg0).zoom = arg1;
};
imports.wbg.__wbg_enable_23f52f55a73ec4f9 = function(arg0) {
    const ret = getObject(arg0).enable();
    return addHeapObject(ret);
};
imports.wbg.__wbg_disable_42c529e51b8501f7 = function(arg0) {
    const ret = getObject(arg0).disable();
    return addHeapObject(ret);
};
imports.wbg.__wbg_addTo_0a793db2beaaa99c = function(arg0, arg1) {
    const ret = getObject(arg0).addTo(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_remove_39578a6c95657646 = function(arg0) {
    const ret = getObject(arg0).remove();
    return addHeapObject(ret);
};
imports.wbg.__wbg_bindPopup_447fbf5e2c37e22b = function(arg0, arg1) {
    const ret = getObject(arg0).bindPopup(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_bindTooltip_f699340fc8fcca97 = function(arg0, arg1) {
    const ret = getObject(arg0).bindTooltip(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_setLatLng_8ef4a930e44088df = function(arg0, arg1) {
    getObject(arg0).setLatLng(getObject(arg1));
};
imports.wbg.__wbg_setStyle_a1d2c172112addaf = function(arg0, arg1) {
    getObject(arg0).setStyle(getObject(arg1));
};
imports.wbg.__wbg_setstroke_2bacb602656a37f5 = function(arg0, arg1) {
    getObject(arg0).stroke = arg1 !== 0;
};
imports.wbg.__wbg_setcolor_d69196ddce29f517 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).color = v0;
};
imports.wbg.__wbg_setweight_a0633d577fce5e2c = function(arg0, arg1) {
    getObject(arg0).weight = arg1;
};
imports.wbg.__wbg_setinteractive_84a81774a9814892 = function(arg0, arg1) {
    getObject(arg0).interactive = arg1 !== 0;
};
imports.wbg.__wbg_setopacity_99751b2575814a5a = function(arg0, arg1) {
    getObject(arg0).opacity = arg1;
};
imports.wbg.__wbg_setlineCap_570e7621c66aa8e7 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).lineCap = v0;
};
imports.wbg.__wbg_setlineJoin_7790aa33c5f4cc81 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).lineJoin = v0;
};
imports.wbg.__wbg_setdashArray_ede959e286d7341e = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).dashArray = v0;
};
imports.wbg.__wbg_setdashOffset_6754675c709ed7d4 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).dashOffset = v0;
};
imports.wbg.__wbg_setfill_9ddc79f5d6b82718 = function(arg0, arg1) {
    getObject(arg0).fill = arg1 !== 0;
};
imports.wbg.__wbg_setfillColor_29db292258a90b17 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).fillColor = v0;
};
imports.wbg.__wbg_setfillOpacity_76acf4ab6ce60822 = function(arg0, arg1) {
    getObject(arg0).fillOpacity = arg1;
};
imports.wbg.__wbg_setfillRule_934e02d778d43f1b = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).fillRule = v0;
};
imports.wbg.__wbg_setbubblingMouseEvents_d99d3cca516a1a3b = function(arg0, arg1) {
    getObject(arg0).bubblingMouseEvents = arg1 !== 0;
};
imports.wbg.__wbg_setclassName_ff727132595cb1d7 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
if (arg1 !== 0) { wasm.__wbindgen_free(arg1, arg2, 1); }
getObject(arg0).className = v0;
};
imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};
imports.wbg.__wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};
imports.wbg.__wbg_instanceof_Window_f401953a2cf86220 = function(arg0) {
    let result;
    try {
        result = getObject(arg0) instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};
imports.wbg.__wbg_document_5100775d18896c16 = function(arg0) {
    const ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_requestAnimationFrame_549258cfa66011f0 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    return ret;
}, arguments) };
imports.wbg.__wbg_body_edb1908d3ceff3a1 = function(arg0) {
    const ret = getObject(arg0).body;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createComment_354ccab4fdc521ee = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createComment(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_createDocumentFragment_8c86903bbb0a3c3c = function(arg0) {
    const ret = getObject(arg0).createDocumentFragment();
    return addHeapObject(ret);
};
imports.wbg.__wbg_createElement_8bae7856a4bb7411 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createTextNode_0c38fd80a5b2284d = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    const ret = getObject(arg0).createTextNode(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_namespaceURI_5235ee79fd5f6781 = function(arg0, arg1) {
    const ret = getObject(arg1).namespaceURI;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_id_e0c4392b9418f9b0 = function(arg0, arg1) {
    const ret = getObject(arg1).id;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_setinnerHTML_26d69b59e1af99c7 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).innerHTML = v0;
};
imports.wbg.__wbg_outerHTML_e073aa84e7bc1eaf = function(arg0, arg1) {
    const ret = getObject(arg1).outerHTML;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_removeAttribute_1b10a06ae98ebbd1 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeAttribute(v0);
}, arguments) };
imports.wbg.__wbg_setAttribute_3c9f6c303b696daa = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_before_210596e44d88649f = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).before(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_close_a994f9425dab445c = function() { return handleError(function (arg0) {
    getObject(arg0).close();
}, arguments) };
imports.wbg.__wbg_enqueue_ea194723156c0cc2 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).enqueue(getObject(arg1));
}, arguments) };
imports.wbg.__wbg_getPropertyValue_fa32ee1811f224cb = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    const ret = getObject(arg1).getPropertyValue(v0);
    const ptr2 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len2;
    getInt32Memory0()[arg0 / 4 + 0] = ptr2;
}, arguments) };
imports.wbg.__wbg_setProperty_ea7d15a2b591aa97 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setProperty(v0, v1);
}, arguments) };
imports.wbg.__wbg_childNodes_118168e8b23bcb9b = function(arg0) {
    const ret = getObject(arg0).childNodes;
    return addHeapObject(ret);
};
imports.wbg.__wbg_nextSibling_709614fdb0fb7a66 = function(arg0) {
    const ret = getObject(arg0).nextSibling;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_settextContent_d271bab459cbb1ba = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).textContent = v0;
};
imports.wbg.__wbg_appendChild_580ccb11a660db68 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_cloneNode_e19c313ea20d5d1d = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).cloneNode();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_contains_fdfd1dc667f36695 = function(arg0, arg1) {
    const ret = getObject(arg0).contains(getObject(arg1));
    return ret;
};
imports.wbg.__wbg_warn_63bbae1730aead09 = function(arg0) {
    console.warn(getObject(arg0));
};
imports.wbg.__wbg_view_7f0ce470793a340f = function(arg0) {
    const ret = getObject(arg0).view;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_respond_b1a43b2e3a06d525 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).respond(arg1 >>> 0);
}, arguments) };
imports.wbg.__wbg_style_c3fc3dd146182a2d = function(arg0) {
    const ret = getObject(arg0).style;
    return addHeapObject(ret);
};
imports.wbg.__wbg_length_d0a802565d17eec4 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_append_f7fa3534fc158323 = function() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).append(getObject(arg1), getObject(arg2));
}, arguments) };
imports.wbg.__wbg_byobRequest_72fca99f9c32c193 = function(arg0) {
    const ret = getObject(arg0).byobRequest;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_close_184931724d961ccc = function() { return handleError(function (arg0) {
    getObject(arg0).close();
}, arguments) };
imports.wbg.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};
imports.wbg.__wbg_queueMicrotask_481971b0d87f3dd4 = function(arg0) {
    queueMicrotask(getObject(arg0));
};
imports.wbg.__wbg_queueMicrotask_3cbae2ec6b6cd3d6 = function(arg0) {
    const ret = getObject(arg0).queueMicrotask;
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
    const ret = new Array();
    return addHeapObject(ret);
};
imports.wbg.__wbg_push_a5b05aedc7234f9f = function(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
};
imports.wbg.__wbg_new_28c511d9baebfa89 = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Error(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    const ret = new Function(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_call_b3ca7c6051f9bec1 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_is_010fdc0f4ab96916 = function(arg0, arg1) {
    const ret = Object.is(getObject(arg0), getObject(arg1));
    return ret;
};
imports.wbg.__wbg_new_72fb9a18b5ae2624 = function() {
    const ret = new Object();
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_81740750da40724f = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_361(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};
imports.wbg.__wbg_resolve_b0083a7967828ec8 = function(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_0c86a60e8fcfe9f6 = function(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_207b558942527489 = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithlength_e9b4878cebadb3d3 = function(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_buffer_dd7f74bc60f1faab = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};
imports.wbg.__wbg_subarray_a1f73cd4b5b42fe1 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_length_c20a40f15020d68a = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_byteLength_58f7b4fab1919d44 = function(arg0) {
    const ret = getObject(arg0).byteLength;
    return ret;
};
imports.wbg.__wbg_byteOffset_81d60f7392524f62 = function(arg0) {
    const ret = getObject(arg0).byteOffset;
    return ret;
};
imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};
imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};
imports.wbg.__wbg_get_e3c254076557e348 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_set_1f9b04f170055d33 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper2590 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 150, __wbg_adapter_24);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper2592 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 152, __wbg_adapter_27);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper4197 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 240, __wbg_adapter_30);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper4199 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 238, __wbg_adapter_33);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper4201 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 236, __wbg_adapter_36);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper4203 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 234, __wbg_adapter_39);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper4205 = function(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 232, __wbg_adapter_42);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper6859 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 340, __wbg_adapter_45);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper11985 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 392, __wbg_adapter_48);
    return addHeapObject(ret);
};

return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('travel_tracker_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
