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
function DecisionMapper () {
    
}
 
//============================================================
//
//
//============================================================
DecisionMapper.prototype.query = function (aaa, bbb) {
    
	var response = superagent.get('https://chm.cbd.int/api/v2013/index/select?fl=id,title_t&q=realm_ss:chm+AND+schema_s:decision&rows=25&sort=createdDate_dt+desc,+title_t+asc&start=0&wt=json').use(superagentQ).end();

	return when(response, function(res) {

        return _(res.body.response.docs).map(function (document) {
			
            return new Decision({
                
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
	        });
	    });
    });
}

module.exports = exports = new DecisionMapper();
