import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;  // API Gateway port set to 5000

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    next();  
});

const authenticate = async (req: Request, res: Response, next: () => void) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }
        const isValid = await axios.post('http://localhost:3000/api/validate-token', { token });  
        if (!isValid.data.valid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error validating token' });
    }
};

app.use(
    '/api/users',
    createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true,
        // pathRewrite: { '^/api/users': '' }, // Remove the rewrite
    })
);


app.use(
    '/api/products',
    createProxyMiddleware({
        target: 'http://localhost:3001',  
        changeOrigin: true,
        // pathRewrite: { '^/api/products': '/api/products' },
    })
);

app.use(
    '/api/carts',
    createProxyMiddleware({
        target: 'http://localhost:3002',  
        changeOrigin: true,
        // pathRewrite: { '^/api/carts': '/api/carts' },
    })
);

app.use((req: Request, res: Response) => {
    console.log(`Unmatched route: ${req.method} ${req.url}`);  
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
