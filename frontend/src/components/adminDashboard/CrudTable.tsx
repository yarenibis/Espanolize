// src/components/CrudTable.tsx
import React from "react";

interface CrudTableProps {
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
}

export default function CrudTable({ data, onEdit, onDelete }: CrudTableProps) {
  if (!data || data.length === 0)
    return <p className="text-gray-500">Henüz kayıt yok.</p>;

  const headers = Object.keys(data[0]);

  return (
    <table className="table-auto border-collapse w-full mt-4 border">
      <thead>
        <tr className="bg-gray-200">
          {headers.map((h) => (
            <th key={h} className="border px-4 py-2">{h}</th>
          ))}
          <th className="border px-4 py-2">İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any) => (
          <tr key={item.id} className="border">
            {headers.map((h) => (
              <td key={h} className="border px-4 py-2">
                {item[h]}
              </td>
            ))}
            <td className="border px-4 py-2 flex gap-2">
              <button
                onClick={() => onEdit && onEdit(item)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Düzenle
              </button>
              <button
                onClick={() => onDelete && onDelete(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Sil
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}