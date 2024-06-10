namespace app.interactions;

using { Country } from '@sap/cds/common';
type BusinessKey : String(10);
type SDate : DateTime;
type LText : String(1024);


entity Interactions_Header {
  key ID : Integer;
  ITEMS  : Composition of many Interactions_Items on ITEMS.INTHeader = $self;
  PARTNER  : BusinessKey;
  LOG_DATE  : SDate;
  BPCOUNTRY : Country;

};
entity Interactions_Items {

    key INTHeader : association to Interactions_Header;
    key TEXT_ID : BusinessKey;
        LANGU   : String(2);
        LOGTEXT : LText;
};


entity SBP_Testing{
    key ID: Integer;
        NAME : String;
}

entity nodes {
    key node_id : Integer;
        name    : String(32);
        field1  : String(32);
        field2  : String(32);
        field3  : String(32);
}


entity edges {
    key edge_id    : Integer;
        length     : Integer;
        difficulty : String(16);
        start      : Association to one nodes  not null;
        end        : Association to one nodes not null;
        mode       : String(8);
        status     : String(16)
}

entity edge{
    
}