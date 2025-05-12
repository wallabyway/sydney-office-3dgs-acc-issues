// index.js
import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { getToken } from './auth.mjs';

const app          = express();
const PORT         = process.env.PORT || 3000;

const ISSUES_URL   = 'https://developer.api.autodesk.com/construction/issues/v1'; // APS Issues API base URL
const PROJECT_ID   = '63a3e38e-ff78-46d4-97f3-3b8714da05f8';
const TARGET_GUID  = '533e0440-a166-d063-3ca7-83e0994ba481';

// Function to list issues from the Autodesk Issues API
async function listIssues(accessToken, projectId) {
  try {
    const response = await axios.get(
      `${ISSUES_URL}/projects/${projectId}/issues`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error listing issues:', error.response?.data || error.message);
    throw error;
  }
}

// /issues endpoint: fetch, filter, project, return JSON
app.get('/issues', async (req, res) => {
  try {
    const accessToken = await getToken();
    const data = await listIssues(accessToken, PROJECT_ID);

    const filtered = (data.results || [])
      // keep only issues that have a linkedDocument with the target GUID
      .filter(issue =>
        Array.isArray(issue.linkedDocuments) &&
        issue.linkedDocuments.some(doc =>
          doc.details?.viewable?.guid === TARGET_GUID
        )
      )
      // filter out headings title, id, issueTypeId 
      .map(issue => {
        const doc = issue.linkedDocuments.find(doc =>
          doc.details?.viewable?.guid === TARGET_GUID
        );
        return {
          title:       issue.title,
          id:          issue.id,
          issueTypeId: issue.issueSubtypeId,
          position:    doc.details.position
        };
      });

    res.json(filtered);
  } catch (err) {
    console.error('Failed to get filtered issues:', err);
    res.status(500).json({ error: err.message });
  }
});

// (Optional) serve any static files out of ./public
app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});