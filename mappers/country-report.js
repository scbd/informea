var superagent = require('superagent');
var mime = require('mime-types');

class CountryReportMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {

    	var res = await superagent.get("https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,government_s,createdDate_dt,updatedDate_dt,url_ss,reportType_s,documentLinks_s&q=NOT+version_s:*+AND+realm_ss:chm+AND+schema_s:*+AND+(+schema_s:nationalReport nationalReport6+)+AND+(*:*+NOT+reportType_s:B0EBAE91-9581-4BB2-9C02-52FCF9D82721+)&rows=9999&start=0&wt=json");

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
