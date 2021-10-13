import React from "react";
import Form from "./Common/Form";

class AddService extends Form {
  render() {
    return (
      <article className="doc-container">
        <article className="card-signup doc-form addservice">
          <header>
            <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
              Add A Service
            </h1>
          </header>
          <article>{this.renderLabel("SERVICE NAME", "fname")}</article>
          <article>
            {this.renderInput(
              "text",
              "service_name",
              "service_name",
              "Service Name"
            )}
          </article>
          <article>
            {this.renderLabel("Organization", "service_organization")}
          </article>
          <article>
            {this.renderInput(
              "Service Organization",
              "service_orgranization",
              "service_orgranization",
              "Service Organization"
            )}
          </article>
          <article>{this.renderLabel("Price", "service_price")}</article>
          <article>
            {this.renderInput(
              "Price",
              "service_orgranization",
              "service_orgranization",
              "Service Price"
            )}
          </article>
          {this.renderBtn("Add Service")}
        </article>
      </article>
    );
  }
}

export default AddService;
