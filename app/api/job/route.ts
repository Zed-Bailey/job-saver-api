import { GoogleSheetsConfig } from '@/app/config';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
 
type RequestData = {
  url: string,
  role: string,
  company: string
}

export async function POST (request: NextRequest) {
  const res: RequestData | null = await request.json()
  .then((e) => e)
  .catch(() => null);

  if(res == null) {
    return NextResponse.json({was: null});  
  }
  let url: URL;
  let docId: string;
  try {
    url = new URL(res.url);
    
    if(url.hostname !== "docs.google.com") {
        throw new Error("Only google sheets are supported");
    }

    let sections = url.pathname.split('/');
    if(sections.length >= 4) {
        docId = sections[3];
    } else {
        throw new Error("Could not parse document id from url");
    }

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

  await sheet.sheetsByIndex[0].addRow(res);

}
