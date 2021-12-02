import React, { Component } from "react";
import Form from "../../Common/Form";
class AddOrganization extends Form {
  render() {
    return (
      <article>
        <article className="card-signup doc-form addservice">
          <header>
            <h1 className="sign-up-header-text doc-header animate__animated animate__zoomIn">
              Add A Service
            </h1>
          </header>
          <article>
            {this.renderLabel("Organization Name", "organizationName")}
          </article>
          <article>
            {this.renderInput(
              "text",
              "organizationName",
              "organizationName",
              "organizationName"
            )}
          </article>
        </article>
      </article>
    );
  }
}

export default AddOrganization;
