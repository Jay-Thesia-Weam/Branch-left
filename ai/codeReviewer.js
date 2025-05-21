const OpenAI = require('openai');
const env = require('../config/env.config');

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});

async function analyzeCodeChanges(changes) {
    try {
        const prompt = `
            Analyze the following code changes and provide a comprehensive review:
            ${JSON.stringify(changes.files.map(file => file.patch).join('\n'), null, 2)}
            
            Please provide feedback on:
            1. Code quality
            2. Potential bugs
            3. Security concerns
            4. Performance implications
            5. Improvement suggestions
            6. Best practices compliance
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error in code analysis:', error);
        return 'Error analyzing code changes. Please try again.';
    }
}

async function suggestImprovements(code) {
    try {
        const prompt = `
            Review the following code and suggest specific improvements:
            ${code}
            
            Focus on:
            1. Code optimization
            2. Readability
            3. Maintainability
            4. Performance
            5. Security
            
            Provide concrete examples of how to improve the code.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error in suggesting improvements:', error);
        return 'Error suggesting improvements. Please try again.';
    }
}

async function checkCodingStandards(code) {
    try {
        const prompt = `
            Validate the following code against coding standards:
            ${code}
            
            Check for:
            1. Naming conventions
            2. Code organization
            3. Documentation
            4. Error handling
            5. Testing coverage
            
            Provide specific feedback and suggestions for improvement.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error in checking coding standards:', error);
        return 'Error checking coding standards. Please try again.';
    }
}

module.exports = {
    analyzeCodeChanges,
    suggestImprovements,
    checkCodingStandards
}; 