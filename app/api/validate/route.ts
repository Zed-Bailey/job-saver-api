import { GoogleSheetsConfig } from '@/app/config';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { Url } from 'url';
 
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
  

  await sheet.addSheet({
    title: 'Application Tracker',
    headerRowIndex: 0,
    headerValues: ["Company", "Role", "Url", "Applied", "Status", "Notes"],
    index: 0,
  }).catch((e) => {
    console.log(e);
  });

  return NextResponse.json({message: "Connected to sheet: " + sheet.title});

}



export async function GET (req: NextRequest) {
  console.log(GoogleSheetsConfig);

  return NextResponse.json(GoogleSheetsConfig);
}