var superagent = require('superagent-promise')(require('superagent'), Promise);
var _ = require('underscore');

class MeetingMapper {

    //============================================================
    //
    //
    //============================================================
    async query () {

    	var url = 'https://chm.cbd.int/api/v2013/index/select?fl=id,title_*,themes_ss,symbol_s,eventCountry_s,eventCity_t,eventVenue_t,startDate_dt,endDate_dt,updatedDate_dt,url_ss&q=NOT+version_s:*+AND+realm_ss:chm+AND+schema_s:meeting&rows=9999&start=0&wt=json';

    	var res = await superagent.get(url).end();

		return res.body.response.docs.map(document => new Meeting({

            protocolVersion:        1,
            id:                     document.id,
            treaty:                 _.contains(document.themes_ss, 'CBD-SUBJECT-ABS') && (Date.parse(document.startDate_dt) > Date.parse('2014-10-12'))?'nagoya': _.contains(document.themes_ss, 'CBD-SUBJECT-CPB') && (Date.parse(document.startDate_dt) > Date.parse('2003-09-11'))?'cartagena':'cbd',
            url:                    document.url_ss.length ? document.url_ss[0] : null,
            title:                  toLocalizableString(document, 'title'),
        //  description:            { type: Array, elementType: LocalizableString,  required: false },   // Short description of the meeting. This is a list of Localizable String complex type objects.
            start:                  document.startDate_dt,
            end:                    document.endDate_dt,
        //  repetition:             { type: String,                                 required: false },   // Frequency of this meeting. Use one of the predefined values from MeetingRepetition enumeration
        //  kind:                   { type: String,                                 required: false },   // Kind of meeting (official, partner, interest etc.). Use one of the predefined values from MeetingKind enumeration
            type:                   document.symbol_s.match(/^COP-\d+$/)?'COP': (document.symbol_s==='EXCOP-01')?'COP': '', //{ type: String,                                 required: false },   // Type of meeting. Use one of the predefined values from MeetingType enumeration
        //  access:                 { type: String,                                 required: false },   // Specifies if there is public access to the event. Use one of the predefined values from MeetingAccess enumeration
        //  status:                 { type: String,                                 required: false },   // Status of the event. Use one of the predefined values from MeetingStatus enumeration
        //  imageUrl:               { type: String,                                 required: false },   // URL of a small, representative image for the meeting, displayed by InforMEA to display a listing of the meetings.
        //  imageCopyright:         { type: String,                                 required: false },   // Copyright statement of the above image
            location:               document.eventVenue_t,
            city:                   document.eventCity_t,
            country:                (document.eventCountry_s||'').toUpperCase(),
        //  latitude:               { type: Number,                                 required: false },   // Latitude of the event place in decimal degrees (ex. 23.456323). This value may be used to represent the event on a map using existing geographical applications such as Google Maps
        //  longitude:              { type: Number,                                 required: false },   // Longitude of the event place in decimal degrees (ex. 23.456323). This value may be used to represent the event on a map using existing geographical applications such as Google Maps
        //    updated:                document.updatedDate_dt

        }));
    }
}

function toLocalizableString(document, field) {

    var texts = [{ language: 'en', value: document[field+'_t'] }];

    if(document[field+'_AR_t'] && document[field+'_AR_t']!=document[field+'_t']) texts.push({ language: 'ar', value: document[field+'_AR_t'] });
    if(document[field+'_ES_t'] && document[field+'_ES_t']!=document[field+'_t']) texts.push({ language: 'es', value: document[field+'_ES_t'] });
    if(document[field+'_FR_t'] && document[field+'_FR_t']!=document[field+'_t']) texts.push({ language: 'fr', value: document[field+'_FR_t'] });
    if(document[field+'_RU_t'] && document[field+'_RU_t']!=document[field+'_t']) texts.push({ language: 'ru', value: document[field+'_RU_t'] });
    if(document[field+'_ZH_t'] && document[field+'_ZH_t']!=document[field+'_t']) texts.push({ language: 'zh', value: document[field+'_ZH_t'] });

    return texts;
}

export default new MeetingMapper();
