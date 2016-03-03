var superagent = require('superagent-promise')(require('superagent'), Promise);

class DecisionMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {

    	var res = await superagent.get('https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,title_AR_t,title_ES_t,title_FR_t,title_RU_t,title_ZH_t,code_s,eventId_s,eventTitle_s,treaty_s,createdDate_dt,updatedDate_dt,position_i&q=realm_ss:chm+AND+schema_s:decision&rows=9999&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').end();

        return res.body.response.docs.map(document => new Decision({

            protocolVersion:        1,
            id:                     document.id,
            link:                   'http://www.cbd.int/decision/cop/default.shtml?id=' + parseInt(document.id.substring(16), 16),
            title:                  [ { language: 'en', value: document.title_t }, { language: 'ar', value: document.title_AR_t }, { language: 'es', value: document.title_ES_t }, { language: 'fr', value: document.title_FR_t }, { language: 'ru', value: document.title_RU_t }, { language: 'zh', value: document.title_ZH_t } ],
        //  longTitle:
        //  summary:
            type:                   'decision',
            status:                 'active',
            number:                 document.code_s,
            treaty:                 document.treaty_s==='XXVII8'?'cbd': document.treaty_s==='XXVII8a'?'cartagena':'nagoya',
            published:              document.createdDate_dt,
            updated:                document.updatedDate_dt,
            meetingId:              "52000000cbd0050000000000".substr(0, 24 - Number(document.eventId_s).toString(16).length) + Number(document.eventId_s).toString(16),
            meetingTitle:           document.eventTitle_s,
            meetingUrl:             'https://www.cbd.int/doc/?meeting=' + document.eventId_s,
        //  content:
        //  keywords:
            displayOrder:           document.position_i
        //  files:
        }));
    }
};

export default new DecisionMapper();
