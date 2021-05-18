import React, { ReactNode } from "react";

export type FieldTableEntry = {
  label: string;
  value: ReactNode;
};

export type FieldTableProps = {
  entries: FieldTableEntry[];
};

export const FieldTable: React.FC<FieldTableProps> = ({ entries }) => {
  const tableRows = entries.map(({ label, value }) => (
    <tr key={label} className="text-lg">
      <th className="pr-8">{label}</th>
      <td className="pr-8 tracking-wider">{value}</td>
    </tr>
  ));

  return (
    <table className="mt-4">
      <tbody>{tableRows}</tbody>
    </table>
  );
};
