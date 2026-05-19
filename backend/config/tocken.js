import jwt from 'jsonwebtoken';
const genToken=async(userId)=>{
try{
    const token=await jwt.sign({userId},process.env.Jwt_Secret,{expiresIn:"10years"})
    return token;
} catch(error){
    throw new Error("Error generating token: " + error.message);
}
}
export default genToken;