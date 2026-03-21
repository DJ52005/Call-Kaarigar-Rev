import React from "react";

export const Table = ({ children }) => (
  <table className="min-w-full border border-gray-200">{children}</table>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="border-b border-gray-200">{children}</tr>
);

export const TableHead = ({ children }) => (
  <th className="text-left p-3 font-semibold text-gray-700">{children}</th>
);

export const TableCell = ({ children }) => (
  <td className="p-3 text-gray-800">{children}</td>
);
