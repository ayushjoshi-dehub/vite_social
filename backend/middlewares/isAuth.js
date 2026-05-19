import jwt from 'jsonwebtoken';
export const isAuth = async (req, res, next) => {
    try {
            const token = req.cookies.token
            if(!token){
                return res.status(401).json({message: "token not found"})
            }
    const verifyToken=await jwt.verify(token, process.env.JWT_SECRET);

    req.userId=verifyToken.id;
    req.user = { id: verifyToken.id };
    next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }
}   

export default isAuth;
