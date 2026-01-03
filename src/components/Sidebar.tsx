import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../hooks/UserContext";

const Sidebar = () => {
  const { user } = useUser() as any;
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // State quản lý menu nào đang mở
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleSidebar = () => setIsOpen(!isOpen);

  // --- LOGIC MỚI: ACCORDION ---
  const handleParentClick = (path: string, hasChildren: boolean) => {
    // 1. Xử lý mobile
    if (window.innerWidth <= 768) setIsOpen(false);

    // 2. Xử lý đóng mở
    if (hasChildren) {
      // Nếu là menu có con (VD: Khóa học, Bài thi)
      // Kiểm tra xem nó có đang mở không
      const isCurrentlyOpen = expandedMenus[path];

      // Set lại state: Chỉ giữ key của cái vừa click
      // Nếu đang mở -> đóng (false). Nếu đang đóng -> mở (true).
      // Các key khác sẽ bị mất (đồng nghĩa với việc đóng lại)
      setExpandedMenus({
        [path]: !isCurrentlyOpen
      });
    } else {
      // Nếu click vào menu thường (Dashboard, Topic...)
      // Đóng tất cả các menu con đang mở cho gọn
      setExpandedMenus({});
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/", roles: ["super_admin"] },
    { name: "Học viên", path: "/student", roles: ["super_admin"] },
    {
      name: "Khóa học",
      path: "/course",
      roles: ["normal_admin", "super_admin"],
      children: [
        { name: "Kho bài học", path: "/lessons", roles: ["normal_admin", "super_admin"] },
      ],
    },
    {
      name: "Bài thi",
      path: "/exam",
      roles: ["normal_admin", "super_admin"],
      children: [
        { name: "Kho câu hỏi", path: "/questions", roles: ["normal_admin", "super_admin"] },
      ],
    },
    {
      name: "Khảo sát",
      path: "/survey",
      roles: ["normal_admin", "super_admin"],
      children: [
        { name: "Kho câu hỏi", path: "/survey_question", roles: ["normal_admin", "super_admin"] },
      ],
    },
    { name: "Chủ đề", path: "/topic", roles: ["normal_admin", "super_admin"] },
    { name: "Quản trị viên", path: "/admin", roles: ["super_admin"] },
  ];

  const settingsItems = [{ name: "Hồ sơ cá nhân", path: "/profile" }];

  const hasPermission = (item: any) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    if (item.roles && item.roles.includes(user.role)) return true;
    if (item.permission && user[item.permission]) return true;
    return false;
  };

  // useEffect giữ nguyên để tự mở đúng menu khi F5 hoặc vào thẳng link con
  useEffect(() => {
    // Tìm xem path hiện tại thuộc về cha nào
    const activeParent = menuItems.find(item =>
      item.children?.some(child => child.path === location.pathname) ||
      item.path === location.pathname
    );

    if (activeParent && activeParent.children) {
      // Nếu tìm thấy cha và cha đó có con -> Mở duy nhất cha đó
      setExpandedMenus({ [activeParent.path]: true });
    }
    // Không cần else để đóng, vì nếu người dùng tự đóng thì cứ để họ đóng
  }, [location.pathname]);

  const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const renderMenuItem = (item: any) => {
    if (!hasPermission(item)) return null;

    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.path]; // Check trạng thái mở

    const linkBaseClass = `flex items-center justify-between px-5 py-4 my-1 rounded-lg text-base font-bold uppercase tracking-wide transition-colors duration-200`;
    const activeClass = "bg-blue-600 text-white shadow-md";
    const inactiveClass = "text-gray-700 hover:bg-gray-200 hover:text-black";

    return (
      <li key={item.path}>
        <Link
          to={item.path}
          // --- TRUYỀN THAM SỐ hasChildren VÀO ĐÂY ---
          onClick={() => handleParentClick(item.path, !!hasChildren)}
          className={`${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
        >
          <span>{item.name}</span>
          {hasChildren && <ChevronIcon expanded={!!isExpanded} />}
        </Link>

        {hasChildren && (
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <ul className="mt-1 space-y-1 bg-gray-50 rounded-lg">
              {item.children.map((child: any) => {
                if (!hasPermission(child)) return null;
                const isChildActive = location.pathname === child.path;
                return (
                  <li key={child.path}>
                    <Link
                      to={child.path}
                      onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
                      className={`block pl-12 pr-4 py-3 rounded-md text-sm font-bold uppercase tracking-wider transition-colors border-l-4 ${isChildActive
                          ? "border-blue-600 text-blue-700 bg-blue-100"
                          : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                        }`}
                    >
                      {child.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-md bg-white shadow-lg border border-gray-200 text-black"
        onClick={toggleSidebar}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={toggleSidebar} />
      )}

      <div
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r-2 border-gray-200 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex flex-col items-center justify-center border-b-2 border-gray-200 py-6 px-4 text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            XIN CHÀO
          </span>
          <h1 className="text-xl font-black text-blue-700 uppercase tracking-wide break-words w-full">
            {user?.name || user?.fullName || user?.username || "ADMIN"}
          </h1>
        </div>

        {/* Menu List */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map(renderMenuItem)}
          </ul>

          <div className="my-6 border-t-2 border-gray-200 mx-2"></div>

          <p className="px-5 text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Tài khoản</p>
          <ul className="space-y-2">
            {settingsItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => handleParentClick(item.path, false)} // Coi settings như item không có con để đóng các menu khác
                  className={`flex items-center px-5 py-4 rounded-lg text-base font-bold uppercase tracking-wide transition-colors ${location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-200 hover:text-black"
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;