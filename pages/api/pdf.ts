// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as pdfImgConvert from 'pdf-img-convert';
import PdfPage from '../page';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const searchParams = req.query;
    const query = searchParams['url']?.toString();

    if (query == undefined) { res.status(400).send('parser error'); }

    pdfImgConvert.convert(query as string).then((value) => {

        const body = PdfPage(value.map(v => `<img src="data:image/png;base64,${toBase64(v)}" />`).join(`<br/><br/><br/>`)).toString()
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'text/html',
          })
          .end(body);
    })


}

function toBase64(value: String | Uint8Array) {
    if (value instanceof String) {
        return value;
    }
    return btoa((value as Uint8Array).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
