import { MockBankingService } from './banking/MockBankingService.js';

// Single shared instance — in-memory state persists for the session lifetime
export const bankingService = new MockBankingService();