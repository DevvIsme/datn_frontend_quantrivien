import { Document } from "../../interfaces/Document.interface";
import axiosInstance from "../../configs/axiosConfigs";

// @ts-ignore
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { api_url } from "../../configs/environments";

export default function DocRow({
  doc,
  handleEdit, 
}: {
  doc: Document;
  handleEdit: (doc: Document) => void;
}) {
  const handleDelete = async (id: string) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      const isConfirm = confirm("Bạn chắc chắn muốn xóa tài liệu này");
      if (!isConfirm) {
        return;
      }
      const response = await axiosInstance.delete(
        `/material/delete-document/${id}`
      );
      alert(response.data.data);
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };
  return (
    <tr key={doc.id} className=" overflow-hidden">
      <td className="px-4 py-1 border text-center  h-7">{doc.id}</td>
      <td className="px-4 py-1 border h-7">{doc.name}</td>
      <td className="px-4 py-1 border h-7">
        <a
          href={`${api_url}/files/${doc.context}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {doc.name}
        </a>
      </td>
      <td className="px-4 py-2 border text-center  h-7">
        <div className="flex justify-center space-x-2">
          <button
            className="text-green-500 hover:text-green-700"
            onClick={() => {
              handleEdit(doc);
            }}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              handleDelete(doc.id);
            }}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
