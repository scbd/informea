var superagent = require('superagent');
var mime = require('mime-types');

class CountryReportMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {

        const url = new URL("https://chm.cbd.int/api/v2013/index/select");
        url.searchParams.set('fl', 'id,title_t,government_s,createdDate_dt,updatedDate_dt,url_ss,reportType_s,documentLinks_s');
        url.searchParams.set('q', 'NOT version_s:* AND ((realm_ss:chm AND schema_s:(nationalReport nationalReport6)) OR (realm_ss:ort AND schema_s:nationalReport7))');
        url.searchParams.set('rows', '9999');
        url.searchParams.set('sort', 'updatedDate_dt desc');
        url.searchParams.set('start', '0');
        url.searchParams.set('wt', 'json');     
    	var res = await superagent.get(url.toString())
            .set('Accept', 'application/json')
            .set('User-Agent', 'INFORMEA-CONNECTOR-API/1.0');

        return res.body.response.docs.map(document => new CountryReport({

            protocolVersion:    1,
            id:                 document.id,
            treaty:             'cbd',
            country:            document.government_s.toUpperCase(),
            title:              [ { language: 'en', value: document.title_t } ],
            submission:         document.createdDate_dt,
            url:                document.url_ss[0],
            files:              JSON.parse(document.documentLinks_s||'[]').map(link => new File({
                filename: link.url.substr(link.url.lastIndexOf("/")+1),
                mimeType : mime.lookup(link.url.substr(link.url.lastIndexOf("/")+1)) || 'application/octet-stream',
                url: link.url,
                language: ((link.url||'').match(/-([a-z]{2,3})\.\w+($|\?)/)||[])[1]
            })),
            updated:            document.updatedOn_dt
        }));
    }
}

export default new CountryReportMapper();
