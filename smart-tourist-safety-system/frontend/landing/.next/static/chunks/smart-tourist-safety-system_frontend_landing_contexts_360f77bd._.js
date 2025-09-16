(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/smart-tourist-safety-system/frontend/landing/contexts/ThemeContext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeContext",
    ()=>ThemeContext,
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const ThemeProvider = (param)=>{
    let { children } = param;
    _s();
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThemeProvider.useState": ()=>{
            const savedMode = localStorage.getItem('darkMode');
            return savedMode ? JSON.parse(savedMode) : false;
        }
    }["ThemeProvider.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }["ThemeProvider.useEffect"], [
        darkMode
    ]);
    const toggleDarkMode = ()=>{
        setDarkMode(!darkMode);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            darkMode,
            toggleDarkMode
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/smart-tourist-safety-system/frontend/landing/contexts/ThemeContext.js",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeProvider, "JEQUJJgiFPbvZBD3IWVL274Vb7Q=");
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/smart-tourist-safety-system/frontend/landing/contexts/AuthContext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// Auth Service URL from environment variables or default to API Gateway
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.REACT_APP_API_URL || 'http://localhost:5000';
const AUTH_SERVICE_ENDPOINT = "".concat(API_URL, "/api/auth");
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const AuthProvider = (param)=>{
    let { children } = param;
    _s();
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Set axios default headers
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (token) {
                __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'] = token;
            } else {
                delete __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'];
            }
        }
    }["AuthProvider.useEffect"], [
        token
    ]);
    // Helper function to set auth header
    const setAuthHeader = (token)=>{
        if (token) {
            __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'] = token;
        } else {
            delete __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'];
        }
    };
    // Check if user is authenticated on initial load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const verifyToken = {
                "AuthProvider.useEffect.verifyToken": async ()=>{
                    if (!token) {
                        setLoading(false);
                        return;
                    }
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(AUTH_SERVICE_ENDPOINT, "/verify"), {
                            headers: {
                                'x-auth-token': token
                            }
                        });
                        setIsAuthenticated(true);
                        setUser(res.data);
                        // Check admin status
                        const roleRes = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(AUTH_SERVICE_ENDPOINT, "/role"), {
                            headers: {
                                'x-auth-token': token
                            }
                        });
                        setIsAdmin(roleRes.data.isAdmin);
                    } catch (err) {
                        localStorage.removeItem('token');
                        setToken(null);
                        setError('Authentication failed. Please login again.');
                    } finally{
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect.verifyToken"];
            verifyToken();
        }
    }["AuthProvider.useEffect"], [
        token
    ]);
    // Register user
    const register = async (userData)=>{
        setLoading(true);
        setError(null);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(AUTH_SERVICE_ENDPOINT, "/register"), userData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setIsAuthenticated(true);
            setUser(res.data.user);
            setIsAdmin(res.data.user.isAdmin);
            return res.data;
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : 'Registration failed. Please try again.');
            // Propagate the error for the component to handle
            throw err;
        } finally{
            setLoading(false);
        }
    };
    // Admin status is now determined by the auth service response
    // Login user
    const login = async (phone, password)=>{
        setLoading(true);
        setError(null);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(AUTH_SERVICE_ENDPOINT, "/login"), {
                phone,
                password
            });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
                setUser(res.data.user);
                setIsAuthenticated(true);
                setIsAdmin(res.data.user.isAdmin);
                setAuthHeader(res.data.token);
            }
            return res.data;
        } catch (err) {
            var _err_response_data, _err_response;
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Login failed');
            throw err;
        } finally{
            setLoading(false);
        }
    };
    // Login as admin
    const loginAsAdmin = async (phone, password)=>{
        setLoading(true);
        setError(null);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(AUTH_SERVICE_ENDPOINT, "/admin/login"), {
                phone,
                password
            });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
                setUser(res.data.user);
                setIsAuthenticated(true);
                setIsAdmin(true);
                setAuthHeader(res.data.token);
            }
            return res.data;
        } catch (err) {
            var _err_response_data, _err_response;
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Admin login failed');
            throw err;
        } finally{
            setLoading(false);
        }
    };
    // Logout user
    const logout = async ()=>{
        try {
            if (token) {
                // Notify auth service about logout
                await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(AUTH_SERVICE_ENDPOINT, "/logout"), {}, {
                    headers: {
                        'x-auth-token': token
                    }
                });
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally{
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            setAuthHeader(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            token,
            isAuthenticated,
            user,
            loading,
            error,
            isAdmin,
            register,
            login,
            loginAsAdmin,
            logout,
            setAuthHeader
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/smart-tourist-safety-system/frontend/landing/contexts/AuthContext.js",
        lineNumber: 171,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "+vu8rBwZl2aC7D2bQaRtRj6J1g8=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=smart-tourist-safety-system_frontend_landing_contexts_360f77bd._.js.map