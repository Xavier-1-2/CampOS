import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import ModuleDetails from "./pages/ModuleDetails";
import Timetable from "./pages/Timetable";
import Calendar from "./pages/Calendar";
import Budget from "./pages/Budget";
import Emergency from "./pages/Emergency";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="modules"
            element={<Modules />}
          />

          <Route
            path="modules/:id"
            element={<ModuleDetails />}
          />

          <Route path="tasks" element={<Tasks />} />

          <Route
            path="timetable"
            element={<Timetable />}
          />

          <Route
            path="calendar"
            element={<Calendar />}
          />

          <Route
            path="budget"
            element={<Budget />}
          />

          <Route
            path="emergency"
            element={<Emergency />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;