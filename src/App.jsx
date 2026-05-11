import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ProductInsight from "./components/ProductInsight";
import EconomicInsight from "./components/EconomicInsight";
import DataExplorer from "./components/DataExplorer";
import Profile from "./components/Profile";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product-insight" element={<ProductInsight />} />
          <Route path="/data-explorer" element={<DataExplorer />} />
          <Route path="/economic-insight" element={<EconomicInsight />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}