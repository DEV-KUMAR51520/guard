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
    // 1. Initialize state to a default value (e.g., false)
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 2. Use useEffect to safely access localStorage on the client
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const savedMode = localStorage.getItem('darkMode');
            // Only set state if a value was found in localStorage
            if (savedMode !== null) {
                setDarkMode(JSON.parse(savedMode));
            }
        }
    }["ThemeProvider.useEffect"], []); // Empty array ensures this runs only once on mount
    // 3. Update localStorage whenever darkMode changes
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
        setDarkMode((prevMode)=>!prevMode);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            darkMode,
            toggleDarkMode
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/smart-tourist-safety-system/frontend/landing/contexts/ThemeContext.js",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeProvider, "jxWvogfm97D9w3+yMzVp/epPJCw=");
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
// This URL should point to your API Gateway
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AUTH_SERVICE_ENDPOINT = "".concat(API_URL, "/api/auth");
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const AuthProvider = (param)=>{
    let { children } = param;
    _s();
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Safely get the token from localStorage on the client-side
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                setLoading(false); // No token, so we're done loading
            }
        }
    }["AuthProvider.useEffect"], []);
    // This effect automatically handles setting headers and verifying the token
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const verifyToken = {
                "AuthProvider.useEffect.verifyToken": async (tokenToVerify)=>{
                    try {
                        __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'] = tokenToVerify;
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("".concat(AUTH_SERVICE_ENDPOINT, "/verify"));
                        setIsAuthenticated(true);
                        setUser(res.data.user); // Assumes backend sends { user: {...} }
                        setIsAdmin(res.data.user.isAdmin || false);
                    } catch (err) {
                        localStorage.removeItem('token');
                        setToken(null);
                    } finally{
                        setLoading(false);
                    }
                }
            }["AuthProvider.useEffect.verifyToken"];
            if (token) {
                verifyToken(token);
            }
        }
    }["AuthProvider.useEffect"], [
        token
    ]);
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
                setToken(res.data.token); // This will trigger the useEffect to verify
            }
            return res.data;
        } catch (err) {
            var _err_response_data, _err_response;
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Login failed');
            throw err;
        }
    };
    const register = async (userData)=>{
        setLoading(true);
        setError(null);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(AUTH_SERVICE_ENDPOINT, "/register"), userData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
            }
            return res.data;
        } catch (err) {
            var _err_response_data, _err_response;
            setError(((_err_response = err.response) === null || _err_response === void 0 ? void 0 : (_err_response_data = _err_response.data) === null || _err_response_data === void 0 ? void 0 : _err_response_data.message) || 'Registration failed');
            throw err;
        } finally{
            setLoading(false);
        }
    };
    const logout = ()=>{
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        delete __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'];
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
            logout,
            setError
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/smart-tourist-safety-system/frontend/landing/contexts/AuthContext.js",
        lineNumber: 97,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "Jwzp8QXUOc04zqjWvs9UkeJM4/I=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/smart-tourist-safety-system/frontend/landing/providers/ClientAuthProvider.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientAuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/contexts/AuthContext.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ClientAuthProvider(param) {
    let { children } = param;
    _s();
    const { isAuthenticated, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthContext"]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // 1. While loading, show a loading screen to prevent redirects
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/smart-tourist-safety-system/frontend/landing/providers/ClientAuthProvider.js",
                lineNumber: 16,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/smart-tourist-safety-system/frontend/landing/providers/ClientAuthProvider.js",
            lineNumber: 15,
            columnNumber: 7
        }, this);
    }
    // 2. If finished loading and user is NOT authenticated,
    // and they are trying to access a protected page...
    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
        // Redirect them to the authentication page
        router.push('/auth');
        return null; // Render nothing while redirecting
    }
    // 3. If finished loading and user IS authenticated,
    // and they are on the auth page...
    if (isAuthenticated && pathname.startsWith('/auth')) {
        // Redirect them to their dashboard
        router.push('/dashboard');
        return null; // Render nothing while redirecting
    }
    // 4. If none of the above, render the page
    return children;
}
_s(ClientAuthProvider, "1JlmnrQXenRgTuILes1uIAOo3Fc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ClientAuthProvider;
var _c;
__turbopack_context__.k.register(_c, "ClientAuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=smart-tourist-safety-system_frontend_landing_bd3bd9e6._.js.map