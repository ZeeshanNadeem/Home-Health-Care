import React from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const EditService = () => {
  return (
    <article className="editService-container">
      <article className="editService-container">
        <article className="table-container">
          <div className="doc-table-container">
            <table className="table doc-table">
              <thead className="table-th assign-duty-th">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Service Name</th>

                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>

                  <td className="td">Nursing Care</td>

                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Edit
                    </Button>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2</th>

                  <td>Doctor Care</td>

                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Edit
                    </Button>
                  </td>
                </tr>
                <tr>
                  <th scope="row">3</th>

                  <td>physiotherapy</td>

                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Edit
                    </Button>
                  </td>
                </tr>
                <tr>
                  <th scope="row">4</th>

                  <td>Urine Sample</td>

                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button variant="contained">
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ marginRight: "0.6rem" }}
                      />
                      Edit
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </article>
    </article>
  );
};

export default EditService;
