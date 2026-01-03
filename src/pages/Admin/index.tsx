import { useEffect, useState } from "react";
import { Admin } from "../../interfaces/Admin.interface";
import Pagination from "../../components/Pagination";
import LoadingSpinner from "../../components/Loading";
import Modal from "../../components/Modal";
import SearchAndLimit from "../../components/SearchInput";
import axiosInstance from "../../configs/axiosConfigs";
import AdminRow from "../../components/Admin/AdminRow";
import AddAdminForm from "../../components/Admin/AddAdminForm";
import UpdatePermissionForm from "../../components/Admin/UpdatePermissionForm";
import { PlusIcon } from "@heroicons/react/solid";

export default function Page() {
  // --- LOGIC GIỮ NGUYÊN ---
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const handleAddAdmin = () => {
    setModalTitle("Thêm Quản trị viên");
    setModalContent(<AddAdminForm />);
    setIsModalOpen(true);
  };

  const handleUpdatePermission = (admin: Admin) => {
    setModalTitle("Sửa quyền hạn Quản trị viên");
    setModalContent(<UpdatePermissionForm admin={admin} />);
    setIsModalOpen(true);
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/list", {
        params: {
          limit,
          page,
          key_name: search,
        },
      });
      setAdmins(response.data.data.admins);
      setTotalAdmins(response.data.data.count);
      let ttPage = Math.ceil(response.data.data.count / limit);
      setTotalPages(ttPage);
    } catch (error) {
      console.error("Error fetching Admins:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // --- GIAO DIỆN STYLE MỚI (FULL WIDTH) ---
  return (
    // Bỏ max-w-7xl mx-auto, giữ p-6 để có khoảng cách lề nhưng vẫn full màn hình
    <div className="min-h-screen bg-gray-50 p-6 font-sans flex flex-col w-full">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Danh sách Quản trị viên
          </h1>
          <p className="mt-1 text-base text-gray-500">
            Quản lý tài khoản và phân quyền truy cập hệ thống.
          </p>
        </div>

        <button
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
          onClick={handleAddAdmin}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Quản trị viên
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 w-full">
        <SearchAndLimit
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col w-full flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Total Count Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-base font-medium text-gray-600">
                Tổng số tài khoản: <span className="font-bold text-blue-600">{totalAdmins}</span>
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              {/* Scrollable Area - Tăng chiều cao lên để tận dụng màn hình rộng */}
              <div className="max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20 border-b border-gray-200">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Họ Tên
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-40">
                        Vai trò
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-32">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.length > 0 ? (
                      admins.map((Admin) => (
                        <AdminRow
                          key={Admin.id}
                          admin={Admin}
                          onUpdate={handleUpdatePermission}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                          Không tìm thấy quản trị viên nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Footer */}
            {admins.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 mt-auto">
                <Pagination
                  currentPage={page}
                  onPageChange={handlePageChange}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}