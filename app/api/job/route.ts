import { GoogleSheetsConfig } from '@/app/config';
import { parseUrlForDocId } from '@/app/helpers/urlParse';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
 
type RequestData = {
  url: string,
  role: string,
  company: string,
  sheetId: string
}

export async function POST (request: NextRequest) {
  const res: RequestData | null = await request.json()
  .then((e) => e)
  .catch(() => null);

  if(res == null) {
    return NextResponse.json({was: null});  
  }
  
  
  
  // create a new google auth jwt token
  let token = new JWT({
    email: GoogleSheetsConfig.client_email,
    key: GoogleSheetsConfig.private_key,
    scopes: GoogleSheetsConfig.SCOPES,
  });

  let sheet = new GoogleSpreadsheet(res.sheetId, token);
  
  try {
    await sheet.loadInfo();
  } catch(e: any) {
    return NextResponse.json({error: "Looks like you haven't shared the sheet with the job-saver email"}, {status: 400});
  }

  await sheet.sheetsByIndex[0].addRow(res);

  return NextResponse.json({message: "Saved Job"});

}
