export const adminOnly = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();

    } catch (error) {
        console.error("Admin authorization error:", error);

        return res.status(500).json({
            message: "Authorization failed"
        });
    }
};