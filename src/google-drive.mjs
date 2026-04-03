import { google } from "googleapis";

function createJwtClient(config) {
  if (!config.clientEmail || !config.privateKey || !config.folderId) {
    throw new Error(
      "Google Drive export is enabled but GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_DRIVE_FOLDER_ID is missing.",
    );
  }

  return new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
    ],
  });
}

export async function exportProfilesToGoogleDrive(profiles, config) {
  if (profiles.length === 0) {
    return [];
  }

  const auth = createJwtClient(config);
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });
  const exported = [];

  for (const profile of profiles) {
    const docTitle = `${profile.name} - freelancer profile`;
    const createDocResponse = await docs.documents.create({
      requestBody: { title: docTitle },
    });

    const documentId = createDocResponse.data.documentId;

    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: profile.documentText,
            },
          },
        ],
      },
    });

    await drive.files.update({
      fileId: documentId,
      addParents: config.folderId,
      fields: "id, parents, webViewLink",
    });

    const jsonResponse = await drive.files.create({
      requestBody: {
        name: `${profile.name} - freelancer profile.json`,
        parents: [config.folderId],
      },
      media: {
        mimeType: "application/json",
        body: JSON.stringify(profile.json, null, 2),
      },
      fields: "id, webViewLink",
    });

    exported.push({
      name: profile.name,
      documentId,
      documentLink: `https://docs.google.com/document/d/${documentId}/edit`,
      jsonFileId: jsonResponse.data.id,
      jsonFileLink: jsonResponse.data.webViewLink || "",
    });
  }

  return exported;
}
