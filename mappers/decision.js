var superagent  = require('superagent');
var superagentQ = require('superagent-promises');

class DecisionMapper {
 
    //============================================================
    //
    //
    //============================================================
    async query () {
        
    	var res = await superagent.get('https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,code_s,createdDate_dt,updatedDate_dt&q=realm_ss:chm+AND+schema_s:decision&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').use(superagentQ).end();

        return res.body.response.docs.map(document => new Decision({
            
            protocolVersion:        1,       
            id:                     document.id,
            link:                   'http://www.cbd.int/decision/cop/default.shtml?id=' + parseInt(document.id.substring(16), 16),
            title:                  [ { language: 'en', value: document.title_t } ],
        //  longTitle:              
        //  summary:                
            type:                   'decision',
            status:                 'active',
            number:                 document.code_s,
            treaty:                 'cbd',
            published:              document.createdDate_dt,
            updated:                document.updatedDate_dt
        //  meetingId:
        //  meetingTitle:           
        //  meetingUrl:             
        //  content:                
        //  keywords:               
        //  files:                  
        }));
    }
}

export default new DecisionMapper();
