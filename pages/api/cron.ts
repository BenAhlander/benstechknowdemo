import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  await sql`DELETE FROM techno_avatars WHERE date <= CURRENT_DATE - INTERVAL 7 DAY;`;
  res.status(200).end("old avatars deleted!");
}
