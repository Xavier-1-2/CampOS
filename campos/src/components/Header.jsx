import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { UserRound } from "lucide-react";

const pageTitles = {
  "/": "Dashboard",
  "/modules": "Module Management",
  "/timetable": "Timetable",
  "/calendar": "Academic Calendar",
  "/budget": "Budget Tracking",
  "/emergency": "Academic Emergency"
};

function Header() {
  const location = useLocation();

  const title = location.pathname.startsWith("/modules/")
  ? "Module Workspace"
  : pageTitles[location.pathname] || "CampOS";

  return (
    <header className="header">
      <div>
        <h2>{title}</h2>
        <p>{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </div>

      <div className="profile">
        <div className="profile-avatar">
          <UserRound size={20} />
        </div>

        <div>
          <strong>Student</strong>
          <p>My Workspace</p>
        </div>
      </div>
    </header>
  );
}

export default Header;