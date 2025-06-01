import axios from 'axios';
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await axios.get(`http://localhost:3004/api/users/get-by-clerkId`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    console.log("📦 AUTH HEADER:", req.headers.authorization);

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("GET USER API ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Internal Server Error",
    });
  }
}