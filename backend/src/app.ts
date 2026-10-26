import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { pokemonRoutes } from './modules/pokemon/pokemon.routes.js';
import { generationRoutes } from './modules/generation/generation.routes.js';
import { typeRoutes } from './modules/type/type.routes.js';
import { abilityRoutes } from './modules/ability/ability.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
	origin: (origin, callback) => {
		const localDevelopmentOrigin = env.NODE_ENV !== 'production' && origin !== undefined &&
			/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
		callback(null, !origin || origin === env.WEB_ORIGIN || localDevelopmentOrigin);
	},
}));
app.use(express.json({ limit: '32kb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/generations', generationRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/abilities', abilityRoutes);
app.use(notFound);
app.use(errorHandler);