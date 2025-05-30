import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

interface decodedJwt {
    id: string;
    email: string;
    role: string[];
    iat: number;
    exp: number;
}

export const authMiddlewareForRoles = (allowedRoles: string[]) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.signedCookies.jwt;
    if (token) {
        jwt.verify(
            token,
            process.env.JWT_SECRET as string,
            (err: jwt.VerifyErrors | null, decoded: unknown) => {
                if (err) {
                    return res.status(401).send("Not authorized");
                } else {
                    if (allowedRoles.includes((decoded as decodedJwt).role)) {
                        res.locals.user = decoded;
                        next();
                    } else {
                        return res.status(401).send("Not authorized");
                    }
                }
            }
        );
    } else {
        return res.status(401).send("Not authorized");
    }
};
