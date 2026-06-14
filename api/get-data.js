export default async function handler(req, res) {
  const googleUrl = process.env.GOOGLE_SCRIPT_URL;

  // Verify that it is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // Forward the form body payload to Google Apps Script
    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    // Google Apps Script usually returns plain text or a redirect. 
    // We grab the text data safely.
    const textData = await response.text();
    
    return res.status(200).json({ success: true, message: textData });
  } catch (error) {
    console.error("Backend error proxying to Google:", error);
    return res.status(500).json({ error: "Failed to forward data to Google pipeline." });
  }
}
