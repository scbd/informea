var superagent = require('superagent-promise')(require('superagent'), Promise);

class CountryProfileMapper {
 
    //============================================================
    //
    //
    //============================================================
    async query () {
        
    	var res = await superagent.get('https://chm.cbd.int/api/v2013/countries').end();

    	return res.body.map(countryProfile => new CountryProfile({
        
            protocolVersion:        2,
            country:                countryProfile.code.toUpperCase(),
            treaty:                 'cbd',
            entryIntoForce:         countryProfile.treaties.XXVII8.party,
        //  updated:                
            entryIntoForceStatus:   countryProfile.treaties.XXVII8.instrument
        //  statusDate:             
        //  note:
		}));
    }
}

export default new CountryProfileMapper();
