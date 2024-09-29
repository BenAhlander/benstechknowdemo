import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const { rows: getRows } = await sql`SELECT * FROM techno_avatars;`;
      const sortedRows = getRows.reverse();
      console.log("list of avatars", sortedRows);
      res.status(200).json(sortedRows);
      break;
    case "POST":
      try {
        const { name, description, image_url } = JSON.parse(req.body);
        const current_date = new Date().toISOString();
        try {
          await sql`INSERT INTO techno_avatars (name, image, date, description) VALUES (${name}, ${image_url}, ${current_date}, ${description});`;
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
