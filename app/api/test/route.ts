import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
 
type ResponseData = {
  message: string
}

export async function POST (request: NextRequest) {
  const res: ResponseData | null = await request.json()
  .then((e) => e)
  .catch(() => null);

  if(res == null) {
    return NextResponse.json({was: null});  
  }

  return NextResponse.json({message: "your message: " + res.message});

}

export async function GET (request: NextRequest){
  const greeting = "Hello World!!"
  const json = {
    greeting
  };
  
  return NextResponse.json(json);
}