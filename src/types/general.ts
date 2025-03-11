import { GetBoardItemsQuery, GetItemTimelineQuery } from "../generated/graphql";

export type GetBoardItemsQueryResult = {
  data: GetBoardItemsQuery;
  loading: boolean;
  error: any;
};

export type GetItemTimelineQueryResult = {
  data: GetItemTimelineQuery;
  loading: boolean;
  error: any;
};
