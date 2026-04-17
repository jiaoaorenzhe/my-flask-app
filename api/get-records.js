export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const response = await fetch(
      'https://api.github.com/repos/jiaooren/你的仓库名/contents/data/records.json',
      { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
    );
    if (!response.ok) {
      if (response.status === 404) return res.status(200).json([]);
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
    res.status(200).json(JSON.parse(content));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
}