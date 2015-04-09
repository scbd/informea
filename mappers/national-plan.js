var superagent  = require('superagent');
var superagentQ = require('superagent-promises');

class NationalPlanMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {
        
    	var url = "https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,government_s,createdDate_dt,updatedDate_dt,url_ss,reportType_s&q=NOT+version_s:*+AND+realm_ss:chm+AND+schema_s:*+AND+(+schema_s:nationalReport+)+AND+(+reportType_s:B0EBAE91-9581-4BB2-9C02-52FCF9D82721+)&rows=99999&start=0&wt=json"

    	var res = await superagent.get(url).use(superagentQ).end();

    	return res.body.response.docs.map(document => new NationalPlan({
			protocolVersion: 1,
			id: document.id,
			treaty: 'cbd',
			country: document.government_s,
			type: 'nbsap',
			title: [{ language: 'en', value: document.title_t }],
			url: document.url_ss[0],
			submission: document.createdDate_dt,
			updated: document.updatedDate_dt
		
        }));
	}
}

export default new NationalPlanMapper();
