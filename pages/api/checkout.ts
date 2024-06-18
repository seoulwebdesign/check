import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { customer, product } = req.body;
    // Process checkout data here (e.g., save to database, send to payment gateway, etc.)
    res.status(200).json({ message: 'Checkout successful', customer, product });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
