require('odata-server');

// Based on InforMEA API Specifications - Version 1.5.6

// COMPLEX TYPES

$data.Entity.extend('DecisionDocument', {
    id:                     { type: String, key: true,  required: true  },  // Document ID. Unique identification for the document inside the MEA database. This could be something like filename etc.
    url:                    { type: String,             required: false },  // URL to the document if available online
    content:                { type: $data.Binary,       required: true  },  // String, binary content of the file encoded in base64
    size:                   { type: $data.Int64,        required: false },  // Size of the document in bytes
    mimeType:               { type: String,             required: true  },  // Mime type of the document. Use one of the predefined values from the MimeType enumeration
    language:               { type: String,             required: true  },  // Language of the document. Use ISO 2-letter code of the language (en, fr etc.)
    filename:               { type: String,             required: false }   // Name of the original file of the document
});

$data.Entity.extend('File', {
    id:                     { type: String, key: true,  required: true  },  //  Entity ID. Unique identification for this file across the database. This could be something like absolute path, filename, ID etc.
    url:                    { type: String,             required: false },  //  URL to the online version of the file. URL where we can download the file. If not empty, must be a valid link (accessible from the Internet) Either url or content (or both) must be nonempty and valid!
    content:                { type: String, /*REPEAT,*/ required: true  },  //  String, binary content of the file encoded in base64 Either url or content (or both) must be nonempty and valid!
    mimeType:               { type: String,             required: true  },  //  Mime type of the document. Use one of the predefined values from the MimeType enumeration
    language:               { type: String,             required: true  },  //  Language of the document. Use ISO 2-letter code of the language (en, fr etc.)
    filename:               { type: String,             required: false }   //  Name of the original file of the document
});

$data.Entity.extend('LocalizableString', {
    language:               { type: String,             required: true  },  // Language of the document. Use ISO 2-letter code of the language (en, fr etc.)
    value:                  { type: String,             required: true  },  // Value of the string in the specified language
});

$data.Entity.extend('VocabularyTerm', {
    term:                   { type: String,             required: true  },  // Vocabulary term
    namespace:              { type: String,             required: true  },  // Namespace used to uniquely identify this term in InforMEA portal as a source of the data. 
});

$data.Entity.extend('EndorsementDetails', {
    date:                   { type: Date,               required: true  },  // At least one is mandatory
    dateQualifier:          { type: String,             required: true  },  // Specify the status of an endorsement date, for instance: signature, ratification, acceptance, entry into force, approval etc. See dateQualifier enumeration above.
    declarations:           { type: String,             required: false },  // A formal declaration made by the country which specifies particular aspects or options chosen
    reservations:           { type: String,             required: false },  // Reservation stated by the country  Example: http://treaties.un.org/Pages/ViewDetails.aspx?mtds g_no=XVIII12a&chapter=18&lang=en
    notes:                  { type: String,             required: false },  // An additional note that accompanies the ratifications status. Usually used to specify territorial scope of the legal agreement.
});

$data.Entity.extend('Treaty', {
    url:                    { type: String,             required: false },  // URL to the membership page on the MEA website
});

$data.Entity.extend('PersonRoles', {
    treaty:                 { type: String,             required: false },  // cbd//cartagena//nagoya
    roles:                  { type: Array, elementType: String ,             required: false },  // focal point roles of the same person for a specific treaty
    order:                  { type: String,             required: false },  // use to list the focal points in a defined order in a specific treaty
});

// COLLECTIONS

$data.Entity.extend('Decision', {
    protocolVersion:        { type: $data.Int16,                            required: true  },   //
    id:                     { type: String, key: true,                      required: true  },   // Decision ID. Unique identification for the decision within the MEA node (cannot change)
    link:                   { type: String,                                 required: false },   // Link to the Convention website, where the decision text can be browsed
    title:                  { type: Array, elementType: LocalizableString,  required: true  },   // Title of the decision. This is a list of Localizable String complex type objects. This must not be empty, producers are required to provide at least English version of the title
    longTitle:              { type: Array, elementType: LocalizableString,  required: false },   // Long title of the decision. This is a list of Localizable String complex type objects
    summary:                { type: Array, elementType: LocalizableString,  required: false },   // Summary of the decision. This is a list of Localizable String complex type objects
    type:                   { type: String,                                 required: true  },   // Type of the decision. Use one of the predefined values from Decision Type enumeration
    status:                 { type: String,                                 required: true  },   // Status of the decision. Use one of the predefined values from Decision Status enumeration
    number:                 { type: String,                                 required: true  },   // Number of the decision. It is a combination of letters and numbers, such as “X/10 COP2”
    treaty:                 { type: String,                                 required: true  },   // The decision’s Treaty. Use one of the predefined values from the Treaty enumeration
    published:              { type: Date,                                   required: true  },   // Date when the decision was published
    updated:                { type: Date,                                   required: false },   // This record will be used by the synchronization process, to retrieve only the newest records from the database. It is not mandatory, but if not provided, the service will always harvest all records. If this information is not available, always return the current date
    meetingId:              { type: String,                                 required: false },   // ID of the meeting from original database. If this field is not available, the meetingTitle will be used to identify the meeting. One of meetingId or meetingTitle must return a nonnull result
    meetingTitle:           { type: String,                                 required: false },   // English title of the meeting where the decision was taken. If this field is not available, the meetingId will be used to identify the meeting. One of meetingId or meetingTitle must return a nonnull result
    meetingUrl:             { type: String,                                 required: false },   // URL of the meeting where the decision was taken. This may point to the MEA website where this meeting is described.
    content:                { type: Array, elementType: LocalizableString,  required: false },   // Content of the decision. This is a list of LocalizableString type objects. Conventions can store their decision in binary format such as PDF/Word, but also in database fields (text, blob). If the decision text is stored in a database, use this property to expose it. Deprecated since version 1.5.6  use ‘files’ property instead
    keywords:               { type: Array, elementType: LocalizableString,  required: false },   // The list of terms that are used to tag this decision. This is a list of Vocabulary Term complex type objects. The MEAs should keep a mapping between their local vocabulary terms and the InforMEA vocabulary terms.
    displayOrder:           { type: $data.Int32,                            required: false },   //
    files:                  { type: Array, elementType: File,               required: false }    // Decision document files. This is a list of File entities. Conventions can store their decision in binary format such as PDF/Word, but also in database fields (text, blob). If the decision text is stored in a database, use this property to expose it.});
});

$data.Entity.extend('Meeting', {
    protocolVersion:        { type: $data.Int16,                            required: true  },   //
    id:                     { type: String, key: true,                      required: true  },   // Meeting ID. Unique identification for the meeting inside the MEA database
    treaty:                 { type: String,                                 required: true  },   // The meeting’s Treaty. Use one of the predefined values from the Treaty enumeration
    url:                    { type: String,                                 required: false },   // Link where the meeting details are published.
    title:                  { type: Array, elementType: LocalizableString,  required: true  },   // Title of the meeting. This is a list of Localizable String complex type objects. This must not be empty, producers are required to provide at least the English version of the title
    description:            { type: Array, elementType: LocalizableString,  required: false },   // Short description of the meeting. This is a list of Localizable String complex type objects.
    start:                  { type: Date,                                   required: true  },   // Start day of the meeting. Mandatory unless its status is “nodate”.
    end:                    { type: Date,                                   required: false },   // End date for the meeting
    repetition:             { type: String,                                 required: false },   // Frequency of this meeting. Use one of the predefined values from MeetingRepetition enumeration
    kind:                   { type: String,                                 required: false },   // Kind of meeting (official, partner, interest etc.). Use one of the predefined values from MeetingKind enumeration
    type:                   { type: String,                                 required: false },   // Type of meeting. Use one of the predefined values from MeetingType enumeration
    access:                 { type: String,                                 required: false },   // Specifies if there is public access to the event. Use one of the predefined values from MeetingAccess enumeration
    status:                 { type: String,                                 required: false },   // Status of the event. Use one of the predefined values from MeetingStatus enumeration
    imageUrl:               { type: String,                                 required: false },   // URL of a small, representative image for the meeting, displayed by InforMEA to display a listing of the meetings.
    imageCopyright:         { type: String,                                 required: false },   // Copyright statement of the above image
    location:               { type: String,                                 required: false },   // Location of the event (ex. Nottingham Castle, grand ball room)
    city:                   { type: String,                                 required: true  },   // City where event is held (ex. London)
    country:                { type: String,                                 required: true  },   // Country where event is located. ISO 31661 3-letter code for the country (http://en.wikipedia.org/wiki/ISO_31661_alpha3) or ISO 31661 2-letter country code (http://en.wikipedia.org/wiki/ISO_31661_alpha2)
    latitude:               { type: Number,                                 required: false },   // Latitude of the event place in decimal degrees (ex. 23.456323). This value may be used to represent the event on a map using existing geographical applications such as Google Maps
    longitude:              { type: Number,                                 required: false },   // Longitude of the event place in decimal degrees (ex. 23.456323). This value may be used to represent the event on a map using existing geographical applications such as Google Maps
    updated:                { type: Date,                                   required: false }    // This record will be used by the synchronization process, to retrieve only the newest records from the database. It is not mandatory, but if not provided, the service will always harvest all records. If this information is not available, always return the current date
});

$data.Entity.extend('Contact', {
    protocolVersion:        { type: $data.Int16,                            required: true  },   //
    id:                     { type: String, key: true,                      required: true  },   // Unique identification for the contact inside the MEA database
    treaties:               { type: Array, elementType: String,             required: true  },   // The list of Treaties this person is relevant for. Use one of the predefined values from Treaty enumeration. At least one Treaty must be provided. See below.
    country:                { type: String,                                 required: true  },   // Country where this person is located. ISO 31661 3-letter code for the country (http://en.wikipedia.org/wiki/ISO_31661_alpha3) or ISO 31661 2-letter country code (http://en.wikipedia.org/wiki/ISO_31661_alpha2)
    prefix:                 { type: String,                                 required: false },   // Person prefix such as Mr., Dr., Ms. Etc.
    firstName:              { type: String,                                 required: false },   // First name
    lastName:               { type: String,                                 required: false },   // Last name
    type:                   { type: String,                                 required: false },   // Category of contact. This field was requested by Ozone convention to depict their two categories of contact points: “Licensed NFP” and “Nonlicensed NFP”. Free string that can be adde by MEAs.
    position:               { type: String,                                 required: false },   // Position within organization
    institution:            { type: String,                                 required: false },   // Organization
    department:             { type: String,                                 required: false },   // Work department
    address:                { type: String,                                 required: false },   // Person's (or institution's) postal address. We encourage to include the country in address field, as for some contacts, they may reside in different country than one which is assigned to
    email:                  { type: String,                                 required: false },   // Email address, only one email address possible
    phoneNumber:            { type: String,                                 required: false },   // Phone number
    fax:                    { type: String,                                 required: false },   // Fax number
    primary:                { type: $data.Int16,                            required: false },   // Possible values 1 or 0. If 1 this contact is primary national focal point.
    roles:                  { type: Array, elementType: PersonRoles,        required: false },   // List of PersonRole complex type. Person’s role related to a treaty. Background : Same person can have multiple roles for different treaties on a treaty (ie. CBD Focal point, Nagoya protocol body etc.)
    updated:                { type: Date,                                   required: false }    // This record will be used by the synchronization process, to retrieve only the newest records from the database. It is not mandatory, but if not provided, the service will always harvest all records. If this information is not available, always return the current date
});
    
$data.Entity.extend('CountryReport', {
    protocolVersion:        { type: $data.Int16,                            required: true  },   //
    id:                     { type: String, key: true,                      required: true  },   // Unique identification for the country report inside the MEA database
    treaty:                 { type: String,                                 required: true  },   // The Country report’s Treaty. Use one of the predefined values from the Treaty enumeration
    country:                { type: String,                                 required: true  },   // Country to which report belongs to. ISO 31661  3letter code for the country (http://en.wikipedia.org/wiki/ISO_31661_alpha 3) or ISO 31661  2letter country code (http://en.wikipedia.org/wiki/ISO_31661_alpha 2)
    title:                  { type: Array, elementType: LocalizableString,  required: true  },   // Navigable property. Title of the report. This is a list of Localizable String complex type objects. This must not be empty, producers are required to provide at least English version of the title
    submission:             { type: Date,                                   required: false },   // Date when the report was submitted
    url:                    { type: String,                                 required: false },   // Optional URL to a report profile page, if available
    files:                  { type: Array, elementType: File,               required: true  },   // Report files. This is a list of File complex type, described below.
    updated:                { type: Date,                                   required: false }    // This record will be used by the synchronization process, to retrieve only the newest records from the database. It is not mandatory, but if not provided, the service will always harvest all records. If this information is not available, always return the current date
});

$data.Entity.extend('CountryProfile', {
    protocolVersion:        { type: $data.Int16,                            required: true  },  //
    country:                { type: String,                                 required: true  },  // Country code. ISO 31661  3letter code for the country (http://en.wikipedia.org/wiki/ISO_3166 1_alpha3) or ISO 31661  2letter country code (http://en.wikipedia.org/wiki/ISO_3166 1_alpha2)
    treaty:                 { type: String,                                 required: true  },  // This is the information source, not the subject of signature or ratification. Use one of the predefined values from the Treaty enumeration.
    entryIntoForce:         { type: Date,                                   required: true  },  // Date when the treaty/convention entered into force within this country.
    updated:                { type: Date,                                   required: false },  // This record will be used by the synchronization process, to retrieve only the newest records from the database. It is not mandatory, but if not provided, the service will always harvest all records. If this information is not available, always return the current date
    entryIntoForceStatus:   { type: String,                                 required: false },  // Current ratification status for this country. Its value is taken from a list of pre­defined values.
    statusDate:             { type: Date,                                   required: false },  // Date when the “status” value was achieved. Can be null.
    note:                   { type: String,                                 required: false }   // An additional note that accompanies the ratifications status. Providers may put here an observation, for example why the treaty was ratified, but did not entered into force.
});

$data.Entity.extend('Site', {
    protocolVersion:        { type: $data.Int16,                            required: true  },  //
    type:                   { type: String,                                 required: true  },  // Type of site. Use one of the predefined values from SiteType enumeration
    country:                { type: String,                                 required: true  },  // Country where site is located. ISO 31661 3-letter code for the country (http://en.wikipedia.org/wiki/ISO_31661_alpha3) or ISO 31661 2-letter country code (http://en.wikipedia.org/wiki/ISO_31661_alpha2)
    treaty:                 { type: String,                                 required: true  },  // Use one of the predefined values from Treaty enumeration
    name:                   { type: Array, elementType: String,             required: true  },  // Name of the site. This is a list of Localizable String complex type objects. This must not be empty, producers are required to provide at least English version of the title
    url:                    { type: String,                                 required: false },  // URL where the site information is presented online
    latitude:               { type: Number,                                 required: false },  // Geographical latitude of the site. Can be used to represent site on a map
    longitude:              { type: Number,                                 required: false },  // Geographical longitude of the site. Can be used to represent site on a map
    updated:                { type: Date,                                   required: false }   // This record will be used by the synchronization process, to retrieve only the newest records from the database. It is not mandatory, but if not provided, the service will always harvest all records. If this information is not available, always return the current date
});

$data.Entity.extend('NationalPlan', {
    protocolVersion:        { type: $data.Int16,                            required: true  }, // 
    id:                     { type: String, key: true,                      required: true  }, // National Plan ID. Unique identification for the plan inside the MEA database
    treaty:                 { type: String,                                 required: true  }, // Use one of the predefined values from Treaty enumeration
    country:                { type: String,                                 required: true  }, // Country where site is located. ISO 31661 3-letter code for the country (http://en.wikipedia.org/wiki/ISO_31661_alpha3 ) or ISO 31661 2-letter country code (http://en.wikipedia.org/wiki/ISO_31661_alpha2)
    type:                   { type: String,                                 required: true  }, // Type of plan. Use one of the predefined values from NationalPlanType enumeration
    title:                  { type: Array, elementType: LocalizableString,  required: true  }, // Title of the plan. This is a list of Localizable String complex type objects. This must not be empty, producers are required to provide at least English version of the title
    url:                    { type: String,                                 required: false }, // URL where the site information is presented online
    files:                  { type: Array, elementType: File,               required: false }, // Report files. This is a list of File complex type, described below.
    submission:             { type: Date,                                   required: false }, // Date when document was submitted
    updated:                { type: Date,                                   required: false }  // This record will be used by the synchronization process, to retrieve only the newest records from the database. It is not mandatory, but if not provided, the service will always harvest all records. If this information is not available, always return the current date.
});

// SERVICE

$data.EntityContext.extend('informea', {
    Decisions:          { type: $data.EntitySet, elementType: Decision },
    Meetings:           { type: $data.EntitySet, elementType: Meeting },
    Contacts:           { type: $data.EntitySet, elementType: Contact },
    CountryReports:     { type: $data.EntitySet, elementType: CountryReport },
    CountryProfiles:    { type: $data.EntitySet, elementType: CountryProfile },
    Sites:              { type: $data.EntitySet, elementType: Site },
    NationalPlans:      { type: $data.EntitySet, elementType: NationalPlan }
});

module.exports = exports = informea;
