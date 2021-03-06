var superagent = require('superagent');
var mime = require('mime-types');

class DecisionMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {

    	var res = await superagent.get('https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,title_AR_t,title_ES_t,title_FR_t,title_RU_t,title_ZH_t,file_en_s, file_es_s, file_fr_s, file_ar_s,file_ru_s,file_zh_s,code_s,eventId_s,eventTitle_s,treaty_s,createdDate_dt,updatedDate_dt,position_i&q=realm_ss:chm+AND+schema_s:decision&rows=9999&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json');

        return res.body.response.docs.map(document => {
            var files = [];

            if(document.file_en_s)
                files.push({filename: document.file_en_s.substr(document.file_en_s.lastIndexOf("/")+1), url: document.file_en_s, language: 'en'});
            if(document.file_es_s)
                files.push({filename: document.file_es_s.substr(document.file_es_s.lastIndexOf("/")+1), url: document.file_es_s, language: 'es'});
            if(document.file_fr_s)
                files.push({filename: document.file_fr_s.substr(document.file_fr_s.lastIndexOf("/")+1), url: document.file_fr_s, language: 'fr'});
            if(document.file_ar_s)
                files.push({filename: document.file_ar_s.substr(document.file_ar_s.lastIndexOf("/")+1), url: document.file_ar_s, language: 'ar'});
            if(document.file_ru_s)
                files.push({filename: document.file_ru_s.substr(document.file_ru_s.lastIndexOf("/")+1), url: document.file_ru_s, language: 'ru'});
            if(document.file_zh_s)
                files.push({filename: document.file_zh_s.substr(document.file_zh_s.lastIndexOf("/")+1), url: document.file_zh_s, language: 'zh'});

            files.forEach(f => f.mimeType = (mime.lookup(f.filename) || 'application/octet-stream'));

            return new Decision({

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
                displayOrder:           document.position_i,
                //  files:
                files:                  files 
            })
        });
    }
};

export default new DecisionMapper();
