import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { runAITurn } from '../ai/aiLayer.js';
import { bankingService } from '../services.js';
import type { ChatRequest } from '../types/index.js';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as ChatRequest;

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      res.status(400).json({ error: 'INVALID_REQUEST', message: 'messages must be a non-empty array' });
      return;
    }

    const result = await runAITurn(
      body.messages,
      bankingService,
      body.confirmTransfer ?? null,
    );

    res.status(200).json(result);
  } catch (err) {
    console.error('[chat route error]', err);
    const error = err as Error;
    if (error.message === 'TIMEOUT' || error.message === 'MAX_ITERATIONS_EXCEEDED') {
      res.status(504).json({
        error: 'TIMEOUT',
        message: "I'm sorry, I couldn't complete your request in time. Please try again.",
      });
      return;
    }
    next(err);
  }
});
