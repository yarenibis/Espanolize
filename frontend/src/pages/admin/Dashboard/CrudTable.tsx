import React from "react";

interface CrudTableProps {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  extraActions?: (item: any) => React.ReactNode; // ✅ Ekledik
}

export default function CrudTable({ data, onEdit, onDelete, extraActions }: CrudTableProps) {
  return (
    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key} className="border p-2 text-left capitalize">
              {key}
            </th>
          ))}
          <th className="border p-2 text-left">İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {Object.keys(row).map((key) => (
              <td key={key} className="border p-2">{row[key]}</td>
            ))}
            <td className="border p-2 flex gap-2 flex-wrap">
              <button
                onClick={() => onEdit(row)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Düzenle
              </button>

              <button
                onClick={() => onDelete(row.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Sil
              </button>

              {/* ✅ HATA BURADAYDI → Artık ReactNode olduğundan sorun yok */}
              {extraActions && <>{extraActions(row)}</>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
