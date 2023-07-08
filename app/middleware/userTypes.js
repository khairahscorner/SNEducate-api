const isUserTypeDev = (req, res, next) => {
    try {
        if (req.user?.userType === 'dev') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized user' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized user' });
    }
};

const isUserTypeAdmin = (req, res, next) => {
    try {
        if (req.user?.userType === 'school_admin') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized user' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized user' });
    }
};

const isUserTypeDevOrAdmin = (req, res, next) => {
    try {
        if (req.user?.userType === 'dev' || req.user?.userType === 'school_admin') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized user' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized user' });
    }
};

const isUserTypeStaff = (req, res, next) => {
    try {
        if (req.user?.userType === 'staff') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized user' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized user' });
    }
};

const isUserTypeAdminOrStaff = (req, res, next) => {
    try {
        if (req.user?.userType === 'staff' || req.user?.userType === 'school_admin') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized user' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized user' });
    }
};

module.exports = { isUserTypeDev, isUserTypeAdmin, isUserTypeDevOrAdmin, isUserTypeStaff, isUserTypeAdminOrStaff };
