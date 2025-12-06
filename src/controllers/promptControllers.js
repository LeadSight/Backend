const response = require('../helpers/response');
const { generateContentModel } = require('../models/insightModel');
const PromtValidator = require('../validator/prompt');


const promptController = {
    generateInsight: async (req, res) => {
        try{            
            PromtValidator.validatePromptPayload(req.body);

            const text = await generateContentModel(req.body)

            return response(res, 'Generate Content Successfully', 200, 'success', { text });
        }
        catch (err){
            return response(res, 'Failed to GenerateContent', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    }
}

module.exports = promptController;