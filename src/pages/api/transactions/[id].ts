import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { id } = req.query; 

  if (req.method === "PUT") {
    const { description, amount, date } = req.body;

    const updated = await Transaction.findByIdAndUpdate(
      id,
      { description, amount, date },
      { new: true }
    );

    return res.status(201).json("updated");
  }

  if (req.method === "DELETE") {
    await Transaction.findByIdAndDelete(id as string); 
    return res.status(204).end();
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
