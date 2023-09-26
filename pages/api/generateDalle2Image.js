import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  switch (req.method) {
    case "POST":
      try {
        const { name, description } = JSON.parse(req.body);
        try {
          const response = await openai.createImage({
            prompt: description,
            n: 1,
            size: "512x512",
          });
          const image_url = response.data.data[0].url;
          res.status(200).json({ name, image_url, description });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
      break;
    default:
      res.status(405).end(); //Method Not Allowed
  }
}
