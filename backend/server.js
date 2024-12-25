import express from "express";
import cors from "cors";
import { config } from "dotenv";
import axios from "axios";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/convert', async (req, res) => {
    const { base_currency, currencies } = req.query;
    console.log(base_currency, currencies)
  
    try {
      const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY}&base_currency=${base_currency}&currencies=${currencies}`;
      
      // Fetch data from the currency API
      const response = await axios.get(url);
      
      // Send the response back to the client
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message, error.response?.data);
      res.status(500).json({
        message: "Error fetching data",
        error: error.response?.data || {},
      });
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));