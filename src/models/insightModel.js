const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateContentModel(body) {
    const prompt = `You are an AI Insight Engine for an internal banking platform.
    Analyze the customer data below and generate sharp insights that highlight business potential and deliver aggressive yet relevant promotional recommendations.

    Predict insights based on the following customer data:

    Age: ${body.age}
    Job: ${body.job}
    Balance: ${body.balance}
    Previous Campaign Outcome: ${body.poutcome}
    Total Campaign Contacts: ${body.campaign}
    Total Previous Contacts: ${body.previous}
    Contact Duration: ${body.duration}
    Price Index: ${body.cons_price_idx ?? body["cons.price.idx"]}
    Confidence Index: ${body.cons_conf_idx ?? body["cons.conf.idx"]}

    The output must include:

    1. Key Insight 
    - Highlight financial behavior and deposit potential quickly and directly.

    2. Weak Points 
    - Use the format: “The customer is weak in …”

    3. Penetration Opportunities 
    - Focus on the opportunities with the highest and fastest conversion potential.

    4. Marketing Recommendations 
    - Provide aggressive, personalized, and conversion-driven strategies. 
    - End with “focused on…”`;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 3. Kirim prompt ke Gemini dan tunggu respon
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
}

module.exports = {
    generateContentModel
}