var superagent = require('superagent-promise')(require('superagent'), Promise);
var _ = require('underscore');

class ContactMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {

    	//var url = 'https://chm.cbd.int/api/v2013/index/select?fl=id,ctgList_ss,government_s,title_t,function_t,organization_t,department_t,email_ss,telephone_s,fax_ss,updatedDate_dt&q=schema_s:focalPoint+AND+(ctgList_ss:CBD-FP1+OR+ctgList_ss:CBD-FP2+OR+ctgList_ss:CPB-FP1+OR+ctgList_ss:ABS-FP)&rows=9999&start=0&wt=json';
        var url = 'https://chm.cbd.int/api/v2013/index/select?fl=id,ctgList_ss,government_s,title_t,function_t,organization_t,department_t,email_ss,telephone_s,fax_ss,updatedDate_dt&q=schema_s:focalPoint+AND+(ctgList_ss:CBD-FP1+OR+ctgList_ss:CBD-FP2+OR+ctgList_ss:SBSTTA-FP+OR+ctgList_ss:CHM-FP+OR+ctgList_ss:CHM-IAC+OR+ctgList_ss:GSPC-FP+OR+ctgList_ss:GTI-FP+OR+ctgList_ss:PA-FP+OR+ctgList_ss:RM-FP+OR+ctgList_ss:TKBD-FP+OR+ctgList_ss:CPB-FP1+OR+ctgList_ss:CPB-FP2+OR+ctgList_ss:BCH-FP+OR+ctgList_ss:ABS-FP+OR+ctgList_ss:ABS-FP2+OR+ctgList_ss:ABSCH-IAC)&rows=9999&start=0&wt=json';
    	var res = await superagent.get(url).end();

		return res.body.response.docs.map(document => {

            var treaties = [];
            var primary  = 1;            
            var roles = [];
            var cbdRoles=[];
            var cpbRoles=[];
            var absRoles=[];
            var cbdOrder;
            var cpbOrder;
            var absOrder;
            if(_.contains(document.ctgList_ss, 'CBD-FP1')){
                treaties.push('cbd');
                cbdRoles.push('CBD Primary NFP');
                cbdOrder=1;
            }
            if(_.contains(document.ctgList_ss, 'CBD-FP2')){
                cbdRoles.push('CBD Secondary NFP');
                if (cbdOrder== null){
                    cbdOrder=2;
                    treaties.push('cbd');
                }
            }
            if(_.contains(document.ctgList_ss, 'SBSTTA-FP')){
                cbdRoles.push('SBSTTA NFP');
                if (cbdOrder== null){
                    cbdOrder=3;
                    treaties.push('cbd');
                }
            }
            if(_.contains(document.ctgList_ss, 'CHM-FP')){
                cbdRoles.push('CHM NFP');
                if (cbdOrder== null){
                    treaties.push('cbd');
                    cbdOrder=4;
                }
            }
            if(_.contains(document.ctgList_ss, 'CHM-IAC')){
                cbdRoles.push('CHM Informal Advisory Committee Member');
                if (cbdOrder== null){
                    treaties.push('cbd');
                    cbdOrder=5;
                }
            }
            if(_.contains(document.ctgList_ss, 'GSPC-FP')){
                cbdRoles.push('GSPC NFP');
                if (cbdOrder== null){
                    treaties.push('cbd');
                    cbdOrder=6;
                }
            }
            if(_.contains(document.ctgList_ss, 'GTI-FP')){
                cbdRoles.push('GTI NFP');
                if (cbdOrder== null){
                    treaties.push('cbd');
                    cbdOrder=7;
                }
            }
            if(_.contains(document.ctgList_ss, 'PA-FP')){
                cbdRoles.push('Protected Areas NFP');
                if (cbdOrder== null)
                    cbdOrder=8;
            }
            if(_.contains(document.ctgList_ss, 'RM-FP')){
                cbdRoles.push('Resource Mobilization NFP');
                if (cbdOrder== null){
                    treaties.push('cbd');
                    cbdOrder=9;
                }
            }
            if(_.contains(document.ctgList_ss, 'TKBD-FP')){
                cbdRoles.push('Traditional Knowledge NFP');
                if (cbdOrder== null){
                    treaties.push('cbd');
                    cbdOrder=10;
                }
            }
            if(_.contains(document.ctgList_ss, 'CPB-FP1')){
                treaties.push('cpb');
                cpbRoles.push('Cartagena Protocol Primary NFP');
                cpbOrder=1;
            }
            if(_.contains(document.ctgList_ss, 'CPB-FP2')){
                cpbRoles.push('Cartagena Protocol Secondary NFP');
                if (cpbOrder== null){
                    treaties.push('cpb');
                    cpbOrder=2;
                }
            }
            if(_.contains(document.ctgList_ss, 'BCH-FP')){
                cpbRoles.push('BCH NFP');
                if (cpbOrder== null){
                    treaties.push('cpb');
                    cpbOrder=2;
                }
            }
            if(_.contains(document.ctgList_ss, 'ABS-FP')){
                treaties.push('abs');
                absRoles.push('Nagoya Protocol Primary NFP');
                absOrder=1;
            }
            if(_.contains(document.ctgList_ss, 'ABS-FP2')){
                absRoles.push('Nagoya Protocol Secondary NFP');
                if (absOrder== null){
                    treaties.push('abs');
                    absOrder=2;
                }
            }
            if(_.contains(document.ctgList_ss, 'ABSCH-IAC')){
                absRoles.push('ABSCH Informal Advisory Committee Member');
                if (absOrder== null){
                    treaties.push('abs');
                    absOrder=2;
                }
            }
            if(cbdOrder != null)
                roles.push({treaty:'cbd', roles:cbdRoles, order:cbdOrder});
            if(cpbOrder != null)
                roles.push({treaty:'cartagena', roles:cpbRoles, order:cpbOrder});
            if(absOrder != null)
                roles.push({treaty:'nagoya', roles:absRoles, order:absOrder});


            //if(document.ctgList_ss.indexOf('CBD-FP1')>=0) treaties.push('cbd');
            //if(document.ctgList_ss.indexOf('CBD-FP2')>=0) treaties.push('cbd'); primary = 0;
            //if(document.ctgList_ss.indexOf('CPB-FP1')>=0) treaties.push('cartagena');
            //if(document.ctgList_ss.indexOf('ABS-FP' )>=0) treaties.push('nagoya');

            return new Contact({

                protocolVersion:    1,
                id:                 document.id,
                treaties:           treaties,
                country:            document.government_s.toUpperCase(),
                prefix:             document.salutation_s,
                firstName:          document.firstName_s,
                lastName:           document.title_t,
            //  type:               'N/A',
                position:           document.function_t,
                institution:        document.organization_t,
                department:         document.department_t,
                address:            document.address_t,
                email:              (document.email_ss && document.email_ss.length) ? document.email_ss[0] : null,
                phoneNumber:        document.telephone_s,
                fax:                (document.fax_ss && document.fax_ss.length) ? document.fax_ss[0] : null,
                primary:            primary,
                updated:            document.updatedDate_dt,
                roles:              roles
            });
    	});
    }
}

export default new ContactMapper();
