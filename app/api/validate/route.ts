import { GoogleSheetsConfig } from '@/app/config';
import { parseUrlForDocId } from '@/app/helpers/urlParse';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { NextRequest, NextResponse } from 'next/server';
 
type RequestData = {
  url: string
}

/**
 * Validates the given sheets url
 * @param request 
 * @returns 
 */
export async function POST (request: NextRequest) {
  const res: RequestData | null = await request.json()
  .then((e) => e)
  .catch(() => null);

  if(res == null) {
    return NextResponse.json({error: "Json was naughty"}, {status: 400});
  }

  
  let docId: string;
  try {
    docId = parseUrlForDocId(res.url);
  } catch(e:any) {
    return NextResponse.json({error: e.message}, {status: 400});
  }

  // create a new google auth jwt token
  let token = new JWT({
    email: GoogleSheetsConfig.client_email,
    key: GoogleSheetsConfig.private_key,
    scopes: GoogleSheetsConfig.SCOPES,
  });

  let sheet = new GoogleSpreadsheet(docId, token);
  
  try {
    await sheet.loadInfo();
  } catch(e: any) {
    return NextResponse.json({error: "Looks like you haven't shared the sheet with the job-saver email"}, {status: 400});
  }
  

  await sheet.addSheet({
    title: 'Application Tracker',
    headerRowIndex: 0,
    headerValues: ["Company", "Role", "Url", "Applied", "Status", "Notes"],
    index: 0,
  }).catch((e) => {
    return NextResponse.json(
      { error: "Failed to add application tracking sheet" },
      { status: 400}
    );
  });

  return NextResponse.json({
    message: "Connected to sheet: " + sheet.title,
    sheetId: docId
  });

}
