import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';

export interface AuthenticatedRequest extends Request {
    userAddress?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Get the authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        // In a real implementation, you would:
        // 1. Verify the JWT token
        // 2. Extract the user's address from the token
        // 3. Set it on the request object
        
        // For now, we'll just use a simple header
        const address = authHeader.replace('Bearer ', '');
        if (!ethers.isAddress(address)) {
            return res.status(401).json({ error: 'Invalid address' });
        }

        // Set the address on the request object
        req.userAddress = address;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
}; 