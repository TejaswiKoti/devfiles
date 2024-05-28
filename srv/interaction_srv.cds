using app.interactions from '../db/interactions';
service CatalogService {
   entity Interactions_Header
      as projection on interactions.Interactions_Header;

      entity Interactions_Items
         as projection on interactions.Interactions_Items;

         entity SBP_Testing as projection on interactions.SBP_Testing;

         entity nodes 
            as projection on interactions.nodes;

            entity edges
             as projection on interactions.edges;
}