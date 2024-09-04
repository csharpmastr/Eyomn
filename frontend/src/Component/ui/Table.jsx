import React from "react";

const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Patient Name</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {data.map((patientData, index) => (
          <tr key={index}>
            <td>{patientData.first_name + " " + patientData.last_name}</td>
            <td>{patientData.address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
