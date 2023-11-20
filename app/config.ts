
interface Config {
    type: string,
    project_id: string,
    private_key_id: string,
    private_key: string,
    client_email: string,
    client_id: string,
    auth_uri: string,
    token_uri: string,
    auth_provider_x509_cert_url: string,
    client_x509_cert_url: string,
    universe_domain: string,

    // these are not part of the config
    SCOPES: string[]
}

export const GoogleSheetsConfig: Config = require("../config.json");
GoogleSheetsConfig.SCOPES =  [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];