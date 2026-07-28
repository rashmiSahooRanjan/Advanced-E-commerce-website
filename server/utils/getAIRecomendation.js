export async function getAIRecomendation(req, res, userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // try {
  const geminiPrompt = `
            Here is a list of available products: ${JSON.stringify(products, null, 2)}
            
            Based on the following userRequest, filter and suggest the best matching products:
            
            userRequest: ${userPrompt}

            only return the matched products in JSON format.            
        `;

  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: geminiPrompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();

    console.log("Gemini Error:");
    console.log(errorData);

    throw new Error(`Gemini API failed: ${response.status}`);
  }

  const data = await response.json();
  const aiResponseText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "";

  // Clean up the response to ensure it's a valid JSON array
  const cleanedText = aiResponseText.replace(/```json|```|`/g, "").trim();

  // if(!cleanedText){
  //     return res.status(500).json({
  //         success: false,
  //         message: "No product matched the user's request",
  //     })
  // }

  let parsedProducts;
  // try {
  parsedProducts = JSON.parse(cleanedText);
  console.log(parsedProducts);
  return { success: true, products: parsedProducts };
}
