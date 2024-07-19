const jwt = require('jsonwebtoken')

require('dotenv').config();

const generateToken = ({ rutUser }) => {
    const tokenKey = process.env.TOKEN_KEY;

    const token = jwt.sign(
        { rut: rutUser },
        tokenKey,
        { expiresIn: "2h" }
    );

    return token;
}

// Middle Ware 
const validateToken = (req, res, next) => {
    const tokenKey = process.env.TOKEN_KEY;
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    //console.log(token)
    if (token == null) {
        res.status(401).send({
            status: "Error de acceso",
            data: { error: 'Token requerido' }
        });
    }
    // Funcion para validar el token con el modulo jsonwebtoken

    jwt.verify(token, tokenKey, (error, user) => {
        if (error){
            res.send({
                status: "Error de acceso",
                data: { error: 'Token inválido' }
            });
        }

        next();
    });

}

module.exports = {
    generateToken,
    validateToken
}