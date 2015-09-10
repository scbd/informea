var superagent = require('superagent-promise')(require('superagent'), Promise);

class ContactMapper {
    
    //============================================================
    //
    //
    //============================================================
    async query () {

    	var url = 'https://chm.cbd.int/api/v2013/index/select?fl=id,ctgList_ss,government_s,title_t,function_t,organization_t,department_t,email_ss,telephone_s,fax_ss,updatedDate_dt&q=schema_s:focalPoint+AND+(ctgList_ss:CBD-FP1+OR+ctgList_ss:CBD-FP2+OR+ctgList_ss:CPB-FP1+OR+ctgList_ss:ABS-FP)&rows=9999&start=0&wt=json';

    	var res = await superagent.get(url).end();

		return res.body.response.docs.map(document => {

            var treaties = [];
            var primary  = 1;

            if(document.ctgList_ss.indexOf('CBD-FP1')>=0) treaties.push('cbd');
            if(document.ctgList_ss.indexOf('CBD-FP2')>=0) treaties.push('cbd'); primary = 0;
            if(document.ctgList_ss.indexOf('CPB-FP1')>=0) treaties.push('cartagena');
            if(document.ctgList_ss.indexOf('ABS-FP' )>=0) treaties.push('nagoya');
            
            return new Contact({
            
                protocolVersion:    1,
                id:                 document.id,
                treaties:           treaties,
                country:            document.government_s.toUpperCase(),
                prefix:             document.salutation_s,
                firstName:          document.firstName_s,
                lastName:           document.lastName_s,
            //  type:               'N/A',
                position:           document.function_t,
                institution:        document.organization_t,
                department:         document.department_t,
                address:            document.address_t,
                email:              (document.email_ss && document.email_ss.length) ? document.email_ss[0] : null,
                phoneNumber:        document.telephone_s,
                fax:                (document.fax_ss && document.fax_ss.length) ? document.fax_ss[0] : null,
                primary:            primary,
                updated:            document.updatedDate_dt
            });
    	});
    }
}

export default new ContactMapper();
