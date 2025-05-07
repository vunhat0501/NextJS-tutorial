import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || '';
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);
        if (
            typeof decodedToken === 'object' &&
            decodedToken !== null &&
            'id' in decodedToken
        ) {
            return (decodedToken as jwt.JwtPayload).id;
        }
        throw new Error('Invalid token payload');
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.error('An unknown error occurred while decoding the token');
        return null;
    }
};
