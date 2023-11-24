import { GoogleSheetsConfig } from '@/app/config';
import { parseUrlForDocId } from '@/app/helpers/urlParse';
import { SheetRow } from '@/app/models/sheetRow';
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
  const res : RequestData| null = await request.json().catch(() => null);

  console.log(res);
  if(res == null) {
    return NextResponse.json({error: "json was null"}, {status: 400});  
  }

  try {
    
    await AddRow(res);

  } catch(e: any) {
    console.error(e.message);
    return NextResponse.json({error: "Looks like you haven't shared the sheet with the job-saver email"}, {status: 400});
  }


  return NextResponse.json({message: "Saved Job"});
}


export async function GET (request: NextRequest) {
  const url = new URL(request.url);
  const base64Body: string = url.searchParams.get("d") ?? "";
  const res: RequestData = JSON.parse(atob(base64Body));

  console.log(res);
  if(base64Body == null || base64Body == "" || res == null) {
    return NextResponse.json({error: "json was null"}, {status: 400});  
  }

  try {
    
    await AddRow(res);

  } catch(e: any) {
    return NextResponse.json({error: "Looks like you haven't shared the sheet with the job-saver email"}, {status: 400});
  }


  return NextResponse.json({message: "Saved Job"});
}

async function AddRow(data: RequestData) {
  
  // create a new google auth jwt token
  let token = new JWT({
    email: GoogleSheetsConfig.client_email,
    key: GoogleSheetsConfig.private_key,
    scopes: GoogleSheetsConfig.SCOPES,
  });

  let sheet = new GoogleSpreadsheet(data.sheetId, token);
  
  let row: SheetRow = {
    Company: data.company,
    Role: data.role,
    Url: data.url
  };

  
  await sheet.loadInfo();
  await sheet.sheetsByIndex[0].addRow(row);
    
}
