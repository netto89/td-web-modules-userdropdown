import _ from "lodash/fp";
import {
  clearConcepts,
  clearConceptQueryFilters,
  fetchConcepts,
  updateConceptPath,
  selectConceptPage
} from "../routines";

const initialState = { filters: {}, query: "", path: "", page: 1, size: 20 };

const conceptQuery = (state = initialState, { type, payload }) => {
  switch (type) {
    case updateConceptPath.TRIGGER:
      return {
        ...state,
        path: payload.path
      };
    case clearConceptQueryFilters.TRIGGER:
      return { ...state, filters: {} };
    case fetchConcepts.TRIGGER: {
      const { filter, value, query } = payload;
      if (!_.isUndefined(query)) {
        return { ...state, query };
      } else if (_.isUndefined(value)) {
        return { ...state, filters: _.omit(filter)(state.filters) };
      } else if (_.isUndefined(filter)) {
        return initialState;
      } else {
        const values = _.propOr([], filter)(state.filters);
        const nextValues = _.includes(value)(values)
          ? _.without([value])(values)
          : _.union(value instanceof Array ? value : [value])(values);
        const nextFilters = _.isEmpty(nextValues)
          ? _.omit(filter)(state.filters)
          : { ...state.filters, [filter]: nextValues };
        return { ...state, filters: nextFilters };
      }
    }
    case selectConceptPage.TRIGGER: {
      const { activePage } = payload;
      return { ...state, page: activePage };
    }
    default:
      return state;
  }
};

export { conceptQuery };
