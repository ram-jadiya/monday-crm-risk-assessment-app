import { gql } from "graphql-request";

export const getBoardItems = gql`
  query GetBoardItems($boardId: [ID!], $cursor: String) {
    complexity {
      before
      after
      query
      reset_in_x_seconds
    }
    boards(ids: $boardId) {
      id
      columns {
        id
        title
        type
      }
      items_page(limit: 200, cursor: $cursor) {
        items {
          id
          name
          column_values {
            id
            text
            value
            type
          }
          subitems {
            id
          }
        }
        cursor
      }
    }
  }
`;
