var superagent  = require('superagent');
var superagentQ = require('superagent-promises');

class CountryReportMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {
        
    	var res = await superagent.get('https://chm.cbd.int/api/v2013/index/select?fl=id,government_s,title_t,createdDate_dt,url_ss,updatedOn_dt&q=realm_ss:chm+AND+schema_s:nationalReport&rows=9999&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').use(superagentQ).end();

        return res.body.response.docs.map(document => new CountryReport({
                    
            protocolVersion:    1,
            id:                 document.id,
            treaty:             'cbd',
            country:            document.government_s.toUpperCase(),
            title:              [ { language: 'en', value: document.title_t } ],
            submission:         document.createdDate_dt,
        //  url:                document....,
            files:              (document.url_ss||[]).map(url => new File({
            //  id:
                url:            url
            //  content:
            //  mimeType:
            //  language:
            //  filename:
            })),
            updated:            document.updatedOn_dt
        }));
    }
}

export default new CountryReportMapper();
