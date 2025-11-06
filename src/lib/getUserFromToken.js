import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);

    return payload; // can use it to get the user info or role
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}