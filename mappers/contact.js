var superagent  = require('superagent');
var superagentQ = require('superagent-promises');

class ContactMapper {
    
    //============================================================
    //
    //
    //============================================================
    async query () {
        
    	var url = 'https://chm.cbd.int/api/v2013/index/select?fl=id,ctgList_ss,government_s,title_t,function_t,organization_t,department_t,email_ss,telephone_s,fax_ss,updatedDate_dt&q=schema_s:focalPoint&rows=99999&start=0&wt=json';

    	var res = await superagent.get(url).use(superagentQ).end();

		return res.body.response.docs.map(document => new Contact({
            
            protocolVersion:    1,                          
            id:                 document.id,      
            treaties:           document.ctgList_ss,                     
            country:            document.government_s,      
            prefix:             document.salutation_s,                         
            firstName:          document.firstName_s,                  
            lastName:           document.lastName_s,                   
        //  type:               'N/A',                  
            position:           document.function_t,        
            institution:        document.organization_t,    
            department:         document.department_t,      
        //  address:            'N/A',                  
        //  email:              (document.email_ss && document.email_ss.length) ? document.email_ss[0] : null,           
        //  phoneNumber:        document.telephone_s,       
        //  fax:                (document.fax_ss && document.fax_ss.length) ? document.fax_ss[0] : null,                           
        //  primary:            1,                          
            updated:            document.updatedDate_dt     
    	}));
    }
}

export default new ContactMapper();
