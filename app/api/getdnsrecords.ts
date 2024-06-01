import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { apiKey, zoneId } = req.query;

  if (!apiKey || !zoneId) {
    return res.status(400).json({ error: 'Missing apiKey or zoneId' });
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, { headers });
    if (response.data && response.data.result) {
      return res.status(200).json({ dnsRecords: response.data.result });
    } else {
      return res.status(404).json({ error: 'No DNS records found' });
    }
  } catch (error) {
    console.error('Error fetching DNS records:', error);
    return res.status(500).json({ error: 'Error fetching DNS records' });
  }
}
