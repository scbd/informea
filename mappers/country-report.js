var _            = require('underscore');
var superagent   = require('superagent');
var superagentQ  = require('superagent-promises');
var when         = require('when');
var guard        = require('when/guard');
                   require('when/es6-shim/Promise');

//============================================================
// ctor
//
//============================================================
function CountryReportMapper () {
    
}
 
//============================================================
//
//
//============================================================
CountryReportMapper.prototype.query = function (aaa, bbb) {
    
	var response = superagent.get('https://chm.cbd.int/api/v2013/index/select?fl=id,government_s,title_t,createdDate_dt,url_ss,updatedOn_dt&q=realm_ss:chm+AND+schema_s:nationalReport&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').use(superagentQ).end();

	return when(response, function(res) {

        return _(res.body.response.docs).map(function (document) {
			
            return new CountryProfile({
                
                protocolVersion:    1,
                id:                 document.id,
                treaty:             'cbd',
                country:            document.government_s,
                title:              document.title_t,
                submission:         document.createdDate_dt,
            //  url:                document....,
                files:              _(document.url_ss||[]).map(function (url) {
                    return new File({
                    //  id:
                        url:            url
                    //  content:
                    //  mimeType:
                    //  language:
                    //  filename:
                    }); 
                }),
                updated:            document.updatedOn_dt
	        });
	    });
    });
}

module.exports = exports = new CountryReportMapper();
