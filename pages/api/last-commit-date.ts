import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try to read the build meta file
    const buildMetaPath = path.join(process.cwd(), 'public', 'build-meta.json');
    const buildMeta = JSON.parse(fs.readFileSync(buildMetaPath, 'utf8'));
    res.status(200).json({ date: buildMeta.buildDate });
  } catch (error) {
    console.error('Error getting build date:', error);
    res.status(500).json({ date: 'Unknown date' });
  }
} 