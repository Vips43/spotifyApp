import fetch from "node-fetch";

export default async function handler(req, res) {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  const authOptions = {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  };

  const response = await fetch("https://accounts.spotify.com/api/token", authOptions);
  const data = await response.json();

  res.status(200).json({ access_token: data.access_token });
}
