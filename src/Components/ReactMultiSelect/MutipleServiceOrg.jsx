import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

const options = [
    { label: "MON", value: "MON" },
    { label: "TUE", value: "TUE" },
    { label: "WED", value: "WED" },
    { label: "THU", value: "THU" },
    { label: "FRI", value: "FRI" },
    { label: "SAT", value: "SAT" },
    { label: "SUN", value: "SUN" },
];

const ServicesMutiple = (props) => {
    console.log("props.services:", props.services)
    const [selected, setSelected] = useState([]);

    React.useEffect(() => {
        localStorage.setItem("servicesMultiOrg", JSON.stringify(selected))
    }, [selected])

    return (
        <div>
            {/* <h1>Select Fruits</h1>
      <pre>{JSON.stringify(selected)}</pre> */}
            <MultiSelect
                className="services-multi-org"
                options={props.services}
                value={selected}
                onChange={setSelected}
                labelledBy="Days"
            />

        </div>
    );
}
export default ServicesMutiple;