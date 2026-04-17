export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { type, amount, unit, timestamp, note } = req.body;
  const newRecord = { id: Date.now() + '-' + Math.random().toString(36).substr(2, 9), type, amount, unit, timestamp, note };
  try {
    const GITHUB_API = 'https://api.github.com/repos/jiaooren/你的仓库名/contents/data/records.json';
    const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` };
    const getRes = await fetch(GITHUB_API, { headers });
    let records = [], sha = null;
    if (getRes.status === 200) {
      const fd = await getRes.json();
      sha = fd.sha;
      records = JSON.parse(Buffer.from(fd.content, 'base64').toString());
    }
    records.push(newRecord);
    const content = Buffer.from(JSON.stringify(records, null, 2)).toString('base64');
    await fetch(GITHUB_API, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: `Add record ${newRecord.type}`, content, sha })
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to add' });
  }
}