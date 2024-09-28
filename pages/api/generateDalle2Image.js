import OpenAI from "openai";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      try {
        const { name, description } = JSON.parse(req.body);
        try {
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });
          const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: description,
            n: 1,
            size: "1024x1024",
          });
          console.log(response);
          const image_url = response.data[0].url;
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
