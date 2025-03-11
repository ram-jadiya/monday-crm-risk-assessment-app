import { gql } from "graphql-request";

export const getItemTimeline = gql`
  query GetItemTimeline($itemId: ID!) {
    timeline(id: $itemId) {
      timeline_items_page {
        timeline_items {
          id
          custom_activity_id
          content
        }
        cursor
      }
    }
  }
`;
