import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Symptoms from "./pages/Symptoms";
import Timeline from "./pages/Timeline";
import Medications from "./pages/Medications";
import Family from "./pages/Family";
import Export from "./pages/Export";
import BloodPressure from "./pages/BloodPressure";
import Vitals from "./pages/Vitals";
import Layout from "./components/Layout";

const App = () => (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Index />
          </Layout>
        }
      />
      <Route
        path="/symptoms"
        element={
          <Layout>
            <Symptoms />
          </Layout>
        }
      />
      <Route
        path="/timeline"
        element={
          <Layout>
            <Timeline />
          </Layout>
        }
      />
      <Route
        path="/medications"
        element={
          <Layout>
            <Medications />
          </Layout>
        }
      />
      <Route
        path="/family"
        element={
          <Layout>
            <Family />
          </Layout>
        }
      />
      <Route
        path="/export"
        element={
          <Layout>
            <Export />
          </Layout>
        }
      />
      <Route
        path="/blood-pressure"
        element={
          <Layout>
            <BloodPressure />
          </Layout>
        }
      />
      <Route
        path="/vitals"
        element={
          <Layout>
            <Vitals />
          </Layout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
);

export default App;