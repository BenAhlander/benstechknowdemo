import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  switch (req.method) {
    case "GET":
      const { rows: getRows } = await sql`SELECT * FROM avatars;`;
      const sortedRows = getRows.reverse();
      res.status(200).json(sortedRows);
      break;
    case "POST":
      try {
        const { name, description, image_url } = JSON.parse(req.body);
        try {
          await sql`INSERT INTO avatars (name, image, description) VALUES (${name}, ${image_url}, ${description});`;
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
