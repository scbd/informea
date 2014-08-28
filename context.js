require('odata-server');

$data.Entity.extend('LocalizableString', {
    language:        { type: String,            required: true  },
    value:           { type: String,            required: true  },
});

$data.Entity.extend('NationalPlan', {

    protocolVersion: { type: $data.Int16,       required: true  },
    id:              { type: String, key: true, required: true  },
    treaty:          { type: String,            required: true  },
    country:         { type: String,            required: true  },
    type:            { type: String,            required: true  },
    title:           { type: LocalizableString, required: true  },
    url:             { type: String,            required: false },
//  files:
    submission:      { type: Date,              required: false },
    updated:         { type: Date,              required: false }
});


$data.Class.define('informea.Types.NationalPlanContext', $data.EntityContext, null, {
    NationalPlans: { dataType: $data.EntitySet, elementType: NationalPlan }
}, null);


$data.EntityContext.extend('informea', {
     NationalPlans: { type: $data.EntitySet, elementType: NationalPlan }
});

module.exports = exports = informea;
