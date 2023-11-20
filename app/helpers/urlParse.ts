

/**
 * parses a google sheets doc url and extracts sheet id.
 * 
 * Will throw on invalid host name or if doc id does not exist in path
 * 
 * @param urlstring the url string to parse
 * @returns the doc id
 */
export function parseUrlForDocId(urlstring: string): string {
    
    let docId: string;
    
    let url = new URL(urlstring);
    
    if(url.hostname !== "docs.google.com") {
        throw new Error("Only google sheets are supported");
    }

    let sections = url.pathname.split('/');

    if(sections.length >= 4) {
        docId = sections[3];
    } else {
        throw new Error("Sheets document id does not exist in url");
    }
  
    

    return docId;
}