import { Filter } from "../Models/Filter";
import { Sort } from "../Models/Sort";
import { FilterSort } from "../Models/FilterSort";

const filter: Filter = {
    text: ""
}

const sort: Sort = {
    by: "",
    descending: true
}

const DEFAULT_FILTER_SORT: FilterSort = {
    filter: filter,
    sort: sort
}

export default DEFAULT_FILTER_SORT;