import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // allow frontend to access token

const clientId = "ae099a85abfd490f942ad96cecc1e3fe";
const clientSecret = "08929370795044bb9726eccb1421c08c";

async function getAccessToken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  return data.access_token;
}

// API endpoint: GET /token
app.get("/token", async (req, res) => {
  const token = await getAccessToken();
  res.json({ access_token: token });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
