module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/smart-tourist-safety-system/frontend/landing/contexts/ThemeContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeContext",
    ()=>ThemeContext,
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])();
const ThemeProvider = ({ children })=>{
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [
        darkMode
    ]);
    const toggleDarkMode = ()=>{
        setDarkMode(!darkMode);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
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
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/smart-tourist-safety-system/frontend/landing/contexts/AuthContext.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/smart-tourist-safety-system/frontend/landing/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
"use client";
;
;
;
// Auth Service URL from environment variables or default to API Gateway
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const AUTH_SERVICE_ENDPOINT = `${API_URL}/api/auth`;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])();
const AuthProvider = ({ children })=>{
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Set axios default headers
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (token) {
            __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'] = token;
        } else {
            delete __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'];
        }
    }, [
        token
    ]);
    // Helper function to set auth header
    const setAuthHeader = (token)=>{
        if (token) {
            __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'] = token;
        } else {
            delete __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].defaults.headers.common['x-auth-token'];
        }
    };
    // Check if user is authenticated on initial load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const verifyToken = async ()=>{
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${AUTH_SERVICE_ENDPOINT}/verify`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setIsAuthenticated(true);
                setUser(res.data);
                // Check admin status
                const roleRes = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${AUTH_SERVICE_ENDPOINT}/role`, {
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
        };
        verifyToken();
    }, [
        token
    ]);
    // Register user
    const register = async (userData)=>{
        setLoading(true);
        setError(null);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${AUTH_SERVICE_ENDPOINT}/register`, userData);
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
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${AUTH_SERVICE_ENDPOINT}/login`, {
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
            setError(err.response?.data?.message || 'Login failed');
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
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${AUTH_SERVICE_ENDPOINT}/admin/login`, {
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
            setError(err.response?.data?.message || 'Admin login failed');
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${AUTH_SERVICE_ENDPOINT}/logout`, {}, {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$smart$2d$tourist$2d$safety$2d$system$2f$frontend$2f$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bb375c59._.js.map