var _ = require('underscore');
require('odata-server');
var informea = require('./context');
var request = require('superagent');
var countryCodes = require('./country-codes');
    countryCodes.push({"alpha-2":"EUR","alpha-3":"EUR"});

var databaseContext = new informea({ name: 'InMemory' });

databaseContext.onReady(function(db) {

    var query = "https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,government_s,createdDate_dt,updatedDate_dt,url_ss,reportType_s&q=NOT+version_s:*+AND+realm_ss:chm+AND+schema_s:*+AND+(+schema_s:nationalReport+)+AND+(+reportType_s:B0EBAE91-9581-4BB2-9C02-52FCF9D82721+)&rows=99999&start=0&wt=json"

    request.get(query).end(function(res) {

        if(res.body.response)
            res.body.response.docs.forEach(function (document) {

                var country = _.findWhere(countryCodes, { 'alpha-2': document.government_s.toUpperCase() });

                db.NationalPlans.add(new NationalPlan({
                    protocolVersion: 1,
                    id: document.id,
                    treaty: 'cbd',
                    country: country['alpha-3'],
                    type: 'nbsap',
                    title: { language: 'en', value: document.title_t },
                    url: document.url_ss[0],
                    submission: document.createdDate_dt,
                    updated: document.updatedDate_dt
                }));
            });

        db.saveChanges(function () { /* !!!!! */ });
    });
});

//==========

var serviceType = $data.Class.defineEx(informea.fullName + '.Service', [informea, $data.ServiceBase]);
serviceType.annotateFromVSDoc();

module.exports = exports = function(req, res, next) { 
    var self = this;
    $data.JayService.createAdapter(serviceType, function() { return databaseContext; }).call(self, req, res, function(err) {
        if (typeof err === 'string') err = new Error(err);
        errorHandlerFn(err, req, res, next);
    });
};
