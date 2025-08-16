import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// yaha apna CricHeroes API URL daalo (jo JSON deta hai)
const CRICHEROES_API = "https://cricheroes.in/api/match/12345";  

app.use(express.static(".")); // overlay.html serve karega

app.get("/score", async (req, res) => {
  try {
    const response = await fetch(CRICHEROES_API);
    const data = await response.json();

    // yaha se tumhe jo fields chahiye unko map karna hai
    const score = {
      teamA: data?.match?.teamA?.name || "N/A",
      teamB: data?.match?.teamB?.name || "N/A",
      runs: data?.match?.teamA?.score?.runs || 0,
      wickets: data?.match?.teamA?.score?.wickets || 0,
      overs: data?.match?.teamA?.score?.overs || "0.0",
      batsman: data?.live?.batsman || "N/A",
      bowler: data?.live?.bowler || "N/A"
    };

    res.json(score);
  } catch (err) {
    console.error("Error fetching CricHeroes API:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
