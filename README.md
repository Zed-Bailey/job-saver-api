# Job Saver API

This is a Next.js api that is used by my job saver extension, this api allows anyone to add jobs without the need to create their own Googler cloud service account.


## Getting Started

Create a google cloud project and a service account, see: https://cloud.google.com/iam/docs/service-accounts-create

then rename `config.example.json` to `config.json` and paste in your service account JSON key, the fields in the key should be similar to the ones in the config.


Run the development server:

```bash
npm run dev
```
API is then served on `http://localhost:3000/api`


## Endpoints

##### `POST /validate`
post a json body of shape `{url:string}`. 

Will validate the url, extract doc id and create a new sheet with the required columns.

Will return the sheet id on successful validation.


##### `POST /job`
post a json body of shape
```json
{
    url: string,
    role: string,
    company: string,
    sheetId: string //returned from validation endpoint
}
```
will add a new row to the sheet.


##### `GET /job?d={base64 encoded json body}`
used by the quick save shortcut as the content script cant make post requests. 

Same functionality as the POST endpoint



    
