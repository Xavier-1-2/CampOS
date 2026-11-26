import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Timetable from "./pages/Timetable";
import Calendar from "./pages/Calendar";
import Budget from "./pages/Budget";
import Emergency from "./pages/Emergency";

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