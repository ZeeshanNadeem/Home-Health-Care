import axios from "axios";

async function getTotalDocuments(apiString) {
  const { data: totalDocuments } = await axios.get(`${apiString}`);
  return totalDocuments;
}

//Populate Table on the basis of searchedValue on textfield
//Or Without any searched Value.
export default async function PopulateTable(
  searchedValue,
  apiString,
  pageSelected,
  apiWithoutPagination,
  pageSize
) {
  let page = "";
  const returnObj = {};
  if (searchedValue) {
    console.log(`abcd:${apiWithoutPagination}`);
    const { data } = await axios.get(apiWithoutPagination);

    const searchedResults = data.results.filter((v) =>
      v.fullName.toUpperCase().startsWith(searchedValue.toUpperCase())
    );

    if (searchedValue) {
      page = Math.ceil(searchedResults.length / pageSize);
    } else {
      page = Math.ceil(searchedResults.length / pageSize);
    }

    if (searchedResults.length === 0 && searchedValue) {
      returnObj.toastError = "No Results Found!";
    }
    returnObj.pageNo = page;
    returnObj.searchedResultsFound = searchedResults;
    return returnObj;
  }
  const { data } = await axios.get(`${apiString}`);

  const totalDocuments = await getTotalDocuments(`${apiWithoutPagination}`);

  if (data.results.length > 0) {
    if (searchedValue) {
      page = Math.ceil(totalDocuments.results.length / pageSize);
    } else {
      page = Math.ceil(totalDocuments.results.length / pageSize);
    }

    returnObj.pageNo = page;
    returnObj.results = data.results;
    return returnObj;
  }
}
