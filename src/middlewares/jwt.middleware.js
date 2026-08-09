import jwt from 'jsonwebtoken';
import UserRepository from '../features/user/user.repository.js';

const userRepository = new UserRepository();

const jwtAuth = async (req, res, next) => {
    //1. read the token
    const token = req.headers['authorization'];

    //2. if no token, reject
    if (!token) {
        return res.status(401).send('unauthorised');
    }

    //3. verify the signature
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).send('unauthorised');
    }

    // A valid token must carry a well-formed user id. A malformed one is an auth
    // failure (401) — never a DB CastError → 500. (Real DB errors below stay 500.)
    if (!payload.userId || !/^[0-9a-fA-F]{24}$/.test(payload.userId)) {
        return res.status(401).send('unauthorised');
    }

    //4. confirm the token hasn't been revoked (tokenVersion must still match)
    try {
        const user = await userRepository.findById(payload.userId);
        if (!user || (user.tokenVersion || 0) !== (payload.tv || 0)) {
            return res.status(401).send('unauthorised');
        }
        req.userId = payload.userId;
        req.userRole = user.type; // use the current role from the DB
        next();
    } catch (err) {
        return next(err);
    }
};

export default jwtAuth;
