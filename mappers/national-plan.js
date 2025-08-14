
"use strict";
var superagent = require('superagent');
var mime = require('mime-types');

class NationalPlanMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {

    	// var url = "https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,government_s,createdDate_dt,updatedDate_dt,url_ss,reportType_s,documentLinks_s&q=NOT+version_s:*+AND+realm_ss:chm+AND+schema_s:*+AND+(+schema_s:nationalReport+)+AND+(+reportType_s:B0EBAE91-9581-4BB2-9C02-52FCF9D82721+)&rows=9999&start=0&wt=json"

    	// var res = await superagent.get(url);

		const url = new URL("https://chm.cbd.int/api/v2013/index/select");
		url.searchParams.set('fl', 'id,title_t,government_s,createdDate_dt,updatedDate_dt,url_ss,reportType_s,documentLinks_s');
		url.searchParams.set('q', 'NOT version_s:* AND realm_ss:(chm ort) AND schema_s:(nbsap)');
		url.searchParams.set('rows', '9999');
        url.searchParams.set('sort', 'updatedDate_dt desc');
		url.searchParams.set('start', '0');
		url.searchParams.set('wt', 'json');    

		var res = await superagent.get(url.toString())
			.set('Accept', 'application/json')
			.set('User-Agent', 'INFORMEA-CONNECTOR-API/1.0');
    	return res.body.response.docs.map(document => new NationalPlan({
			protocolVersion: 1,
			id: document.id,
			treaty: 'cbd',
			country: document.government_s,
			type: 'nbsap',
			title: [{ language: 'en', value: document.title_t }],
			url: document.url_ss[0],
            files: JSON.parse(document.documentLinks_s||'[]').map(link => new File({
                filename: link.url.substr(link.url.lastIndexOf("/")+1),
                url: link.url.charAt(0)=='/'? 'https://chm.cbd.int' + link.url:link.url,
                mimeType : link.url ? (mime.lookup(link.url) || 'application/octet-stream') : null,
                language: ((link.url||'').match(/-([a-z]{2,3})\.\w+($|\?)/)||[])[1]
            })),
			submission: document.createdDate_dt,
			updated: document.updatedDate_dt

        }));
	}
}

export default new NationalPlanMapper();
