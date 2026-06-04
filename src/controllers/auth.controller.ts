import { Request, Response } from "express"
import { AuthenticatedUser } from "../config/auth.js"
import { signToken } from "../utils/jwt.js"

export const getAuthenticationCallback = (req: Request, res: Response) => {
    const user = req.user as AuthenticatedUser
    
    if (!user) {
        res.status(401).json({
            status: "fail", message: "Authentication handshake failed."
        })
        return
    }

    const token = signToken({
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        provider: user.provider,
    })

    res.status(200).json({
        status: 'success',
        data: { token, user },
    });
}