const generateContent = require("../services/ai.service");

const MAX_CODE_LENGTH = 20000;

module.exports.getReview = async (req, res) => {
    try {
        const code = req.body && req.body.code;

        if (typeof code !== "string" || !code.trim()) {
            return res.status(400).send("Code is required");
        }
        if (code.length > MAX_CODE_LENGTH) {
            return res
                .status(413)
                .send(`Code is too long (max ${MAX_CODE_LENGTH} characters)`);
        }

        const response = await generateContent(code);
        res.send(response);
    } catch (error) {
        console.error(error);
        const status = error.status === 429 ? 429 : 500;
        res
            .status(status)
            .send(
                status === 429
                    ? "Gemini quota/limit reached. Thodi der baad try karo."
                    : "Internal Server Error"
            );
    }
};
