import { sql } from "@vercel/postgres";

export async function getAvatars() {
  try {
    const { rows: getRows } = await sql`SELECT * FROM techno_avatars;`;
    const sortedRows = getRows.reverse();
    return sortedRows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createAvatar({ name, description, image_url }) {
  const current_date = new Date().toISOString();
  try {
    await sql`INSERT INTO techno_avatars (name, image, date, description) VALUES (${name}, ${image_url}, ${current_date}, ${description});`;
    return { name, image_url, description };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
