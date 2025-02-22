
import { Mastra } from '@mastra/core';
import { completion } from './agents/completion';

export const mastra = new Mastra({
    agents: {
        completion,
    }
});
