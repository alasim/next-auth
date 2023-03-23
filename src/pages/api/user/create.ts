import client from "../../../lib/client";
import { hash } from "bcryptjs";
import { logger } from "../../../lib/logger";
export default async (req: any, res: any) => {
  if (req.method != "POST") {
    return res.status(500).json({ message: "Invalid request" });
  }
  const { name, email, password } = req.body;

  try {
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(500).json({ message: "This email already being used" });
    }
    const newRes = await client.user.create({
      data: { ...req.body, password: await hash(password, 12) },
    });
    console.log(newRes);

    return res.status(200).json({ message: "Successful." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
