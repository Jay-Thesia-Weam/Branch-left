const OpenAI = require('openai');
const env = require('../config/env.config');

class ConflictResolver {
    constructor() {
        this.openai = new OpenAI({
            key: env.OPENAI_API_KEY,
        });
    }

    async analyzeConflict(conflict) {
        try {
            const prompt = `
                Analyze the following merge conflict and provide a detailed resolution strategy:
                ${JSON.stringify(conflict, null, 2)}
                
                Please provide:
                1. Conflict type identification
                2. Impact analysis
                3. Resolution steps
                4. Potential risks
                5. Testing recommendations
            `;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error analyzing conflict:', error);
            throw error;
        }
    }

    async suggestResolution(conflict) {
        try {
            const prompt = `
                Suggest a resolution for the following merge conflict:
                ${JSON.stringify(conflict, null, 2)}
                
                Provide:
                1. Step-by-step resolution guide
                2. Code changes needed
                3. Verification steps
                4. Rollback plan
            `;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error suggesting resolution:', error);
            throw error;
        }
    }

    async predictIssues(conflict) {
        try {
            const prompt = `
                Predict potential issues that might arise from resolving this conflict:
                ${JSON.stringify(conflict, null, 2)}
                
                Consider:
                1. Breaking changes
                2. Performance impacts
                3. Security implications
                4. Integration issues
                5. Testing requirements
            `;

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error predicting issues:', error);
            throw error;
        }
    }
}

module.exports = new ConflictResolver(); 