import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Clock,
  Wallet,
  Siren,
  GraduationCap,
  ClipboardList
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    name: "Modules",
    path: "/modules",
    icon: BookOpen
  },
  
  {
  name: "Academic Tasks",
  path: "/tasks",
  icon: ClipboardList
},
  {
    name: "Timetable",
    path: "/timetable",
    icon: Clock
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: CalendarDays
  },
  {
    name: "Budget",
    path: "/budget",
    icon: Wallet
  }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={26} />
        </div>

        <div>
          <h2>CampOS</h2>
          <span>Student Operating System</span>
        </div>
      </div>

      <nav className="navigation">
        <p className="nav-label">WORKSPACE</p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <p className="nav-label">TOOLS</p>

        <NavLink
          to="/emergency"
          className={({ isActive }) =>
            `nav-link emergency-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <Siren size={20} />
          <span>Academic Emergency</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        CampOS v0.1 — Prototype
      </div>
    </aside>
  );
}

export default Sidebar;