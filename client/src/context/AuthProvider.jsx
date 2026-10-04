import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext();

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // ============================================
    // RESTORE USER WHEN APP STARTS
    // ============================================
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Invalid stored user:", error);

                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);


    // ============================================
    // REGISTER
    // ============================================
    const register = async (userData) => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            return data;

        } finally {
            setLoading(false);
        }
    };


    // ============================================
    // LOGIN
    // ============================================
    const login = async (credentials) => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // -----------------------------
            // Save user in React state
            // -----------------------------
            setUser(data.user);

            // -----------------------------
            // Save user in localStorage
            // -----------------------------
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // -----------------------------
            // Save JWT token
            // -----------------------------
            if (data.token) {
                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            return data;

        } finally {
            setLoading(false);
        }
    };


    // ============================================
    // LOGOUT
    // ============================================
    const logout = () => {

        // React state
        setUser(null);

        // Browser storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


// ============================================
// CUSTOM HOOK
// ============================================
export const useAuth = () => {
    return useContext(AuthContext);
};