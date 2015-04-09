var superagent  = require('superagent');
var superagentQ = require('superagent-promises');

class DecisionMapper {
 
    //============================================================
    //
    //
    //============================================================
    async query () {
        
    	var res = await superagent.get('https://chm.cbd.int/api/v2013/index/select?fl=id,title_t&q=realm_ss:chm+AND+schema_s:decision&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').use(superagentQ).end();

        return res.body.response.docs.map(document => new Decision({
            
            protocolVersion:        1,       
            id:                     document.id,
        //  link:                   required
            title:                  [ { language: 'en', value: document.title_t } ],
        //  longTitle:              
        //  summary:                
        //  type:                   required
        //  status:                 required
        //  number:                 required
            treaty:                 'cbd'
        //  published:              required
        //  updated:                
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
