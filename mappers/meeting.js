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
function MeetingMapper () {
    
}
 
//============================================================
//
//
//============================================================
MeetingMapper.prototype.query = function (aaa, bbb) {
    
	var url = "https://chm.cbd.int/api/v2013/index/select?fl=id,title_t,updatedDate_dt,url_ss&q=NOT+version_s:*+AND+realm_ss:chm+AND+schema_s:meeting&rows=99999&start=0&wt=json"

	var response = superagent.get(url).use(superagentQ).end();

	return when(response, function(res) {

		var results = [];
			
		res.body.response.docs.forEach(function (document) {
			
			results.push(new Meeting({
                protocolVersion:        1,
                id:                     document.id,
                treaty:                 'cbd',
            //  url:                    { type: String,                                 required: false },   // Link where the meeting details are published.
                title:                  [ { language: 'en', value: document.title_t } ],
            //  description:            { type: Array, elementType: LocalizableString,  required: false },   // Short description of the meeting. This is a list of Localizable String complex type objects.
                start:                  document.startDate_dt,
            //  end:                    { type: Date,                                   required: false },   // End date for the meeting
            //  repetition:             { type: String,                                 required: false },   // Frequency of this meeting. Use one of the predefined values from MeetingRepetition enumeration
            //  kind:                   { type: String,                                 required: false },   // Kind of meeting (official, partner, interest etc.). Use one of the predefined values from MeetingKind enumeration
            //  type:                   { type: String,                                 required: false },   // Type of meeting. Use one of the predefined values from MeetingType enumeration
            //  access:                 { type: String,                                 required: false },   // Specifies if there is public access to the event. Use one of the predefined values from MeetingAccess enumeration
            //  status:                 { type: String,                                 required: false },   // Status of the event. Use one of the predefined values from MeetingStatus enumeration
            //  imageUrl:               { type: String,                                 required: false },   // URL of a small, representative image for the meeting, displayed by InforMEA to display a listing of the meetings.
            //  imageCopyright:         { type: String,                                 required: false },   // Copyright statement of the above image
            //  location:               { type: String,                                 required: false },   // Location of the event (ex. Nottingham Castle, grand ball room)
                city:                   document.eventCity_t,
                country:                document.eventCountry_s,
            //  latitude:               { type: Number,                                 required: false },   // Latitude of the event place in decimal degrees (ex. 23.456323). This value may be used to represent the event on a map using existing geographical applications such as Google Maps
            //  longitude:              { type: Number,                                 required: false },   // Longitude of the event place in decimal degrees (ex. 23.456323). This value may be used to represent the event on a map using existing geographical applications such as Google Maps
                updated:                document.updatedDate_dt
			}));
		});

		return results;
	});
}

module.exports = exports = new MeetingMapper();