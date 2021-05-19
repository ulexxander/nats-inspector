import React, { ReactNode } from "react";
import { cn } from "../../lib/classes";

export type FieldTableEntry = {
  label: string;
  value: ReactNode;
};

export type FieldTableProps = {
  entries: FieldTableEntry[];
  tableClass?: string;
  labelClass?: string;
  valueClass?: string;
};

export const FieldTable: React.FC<FieldTableProps> = ({
  entries,
  tableClass,
  labelClass,
  valueClass,
}) => {
  const tableRows = entries.map(({ label, value }) => (
    <tr key={label} className="text-lg">
      <th className={cn("pr-8", labelClass)}>{label}</th>
      <td className={cn("pr-8 tracking-wider", valueClass)}>{value}</td>
    </tr>
  ));

  return (
    <table className={cn("mt-4", tableClass)}>
      <tbody>{tableRows}</tbody>
    </table>
  );
};
