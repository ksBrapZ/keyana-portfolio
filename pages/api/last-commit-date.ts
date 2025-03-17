import { NextApiRequest, NextApiResponse } from 'next';
import { execSync } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const date = execSync('git log -1 --format=%cd --date=format:"%m/%d/%Y"').toString().trim();
    res.status(200).json({ date });
  } catch (error) {
    console.error('Error getting last commit date:', error);
    res.status(500).json({ date: 'Unknown date' });
  }
} 