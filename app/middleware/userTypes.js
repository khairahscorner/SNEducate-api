const isUserTypeDev = (req, res, next) => {
    try {
        if (req.user?.userType === 'dev') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const isUserTypeAdmin = (req, res, next) => {
    try {
        if (req.user?.userType === 'school_admin') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const isUserTypeDevOrAdmin = (req, res, next) => {
    try {
        if (req.user?.userType === 'dev' || req.user?.userType === 'school_admin') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const isUserTypeStaff = (req, res, next) => {
    try {
        if (req.user?.userType === 'staff') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const isUserTypeAdminOrStaff = (req, res, next) => {
    try {
        if (req.user?.userType === 'staff' || req.user?.userType === 'school_admin') {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { isUserTypeDev, isUserTypeAdmin, isUserTypeDevOrAdmin, isUserTypeStaff, isUserTypeAdminOrStaff };
