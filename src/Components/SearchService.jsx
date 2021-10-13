import React from "react";
import Form from "./Common/Form";

class SearchService extends Form {
  state = {
    searchByOrganizations: ["All", "Shifa", "Nescom", "KRL"],
    services: [
      "All",
      "Nursing Care",
      "Doctor Care",
      "Physical Therapy",
      "Vaccination",
      "Home Health Aides",
      "Urine Sample",
    ],
  };
  render() {
    const { searchByOrganizations, services } = this.state;
    return (
      <React.Fragment>
        <header>
          <p className="search-by-label">Search By</p>
        </header>
        <article className="search-Container">
          <article>
            {this.SmallDropDown(searchByOrganizations)}
            {this.SmallDropDown(services)}
          </article>
        </article>
        <article className="search-btn-container">
          <article>{this.renderSmallButton("Search")}</article>
        </article>
      </React.Fragment>
    );
  }
}

export default SearchService;
