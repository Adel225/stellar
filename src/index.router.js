
import authRouter from '../routes/auth.router.js';
import stellarRoutes from '../routes/stellarRoutes.js';
import cors from 'cors';

const bootstrab = (app, express) => {
    // CORS
    const whitelist = ["http://127.0.0.1:5500"];
    app.use(cors());

    app.use((req, res, next) => {
        if (req.originalUrl === "/order/webhook") {
            return next();
        }
        express.json()(req, res, next);
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use("/auth", authRouter);
    app.use("/api/stellar", stellarRoutes);

    app.all("*", (req, res, next) => {
        return next(new Error("Page not found", { cause: 404 }));
    });

    app.use((err, req, res, next) => {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message,
            cause: err.cause,
            stack: err.stack
        });
    });
};


export default bootstrab;
