import { useState } from "react";
import HomePage from "./pages/HomePage";
import SatelliteDetailPage from "./pages/SatelliteDetailPage";
import SatelliteListPage from "./pages/SatelliteListPage";
import "./styles/global.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedSatelliteId, setSelectedSatelliteId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedOrbit, setSelectedOrbit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedSortBy, setSelectedSortBy] = useState(null);
  const [listFilterType, setListFilterType] = useState(null); // "type", "orbit", "status", or "sort"

  const navigateToDetail = (id) => {
    setSelectedSatelliteId(id);
    setCurrentPage("detail");
  };

  const navigateToList = (type) => {
    setSelectedType(type);
    setSelectedOrbit(null);
    setSelectedStatus(null);
    setSelectedSortBy(null);
    setListFilterType("type");
    setCurrentPage("list");
  };

  const navigateToOrbitList = (orbit) => {
    setSelectedOrbit(orbit);
    setSelectedType(null);
    setSelectedStatus(null);
    setSelectedSortBy(null);
    setListFilterType("orbit");
    setCurrentPage("list");
  };

  const navigateToStatusList = (status) => {
    setSelectedStatus(status);
    setSelectedType(null);
    setSelectedOrbit(null);
    setSelectedSortBy(null);
    setListFilterType("status");
    setCurrentPage("list");
  };

  const navigateToSortList = (sortBy) => {
    setSelectedSortBy(sortBy);
    setSelectedType(null);
    setSelectedOrbit(null);
    setSelectedStatus(null);
    setListFilterType("sort");
    setCurrentPage("list");
  };

  const navigateHome = () => {
    setCurrentPage("home");
    setSelectedSatelliteId(null);
    setSelectedType(null);
    setSelectedOrbit(null);
    setSelectedStatus(null);
    setSelectedSortBy(null);
    setListFilterType(null);
  };

  return (
    <div className="app">
      {currentPage === "home" && (
        <HomePage onSelectSatellite={navigateToDetail} onSelectType={navigateToList} onSelectOrbit={navigateToOrbitList} onSelectStatus={navigateToStatusList} onSelectSort={navigateToSortList} />
      )}
      {currentPage === "list" && (
        <SatelliteListPage
          filterType={listFilterType}
          filterValue={
            listFilterType === "type" ? selectedType :
            listFilterType === "orbit" ? selectedOrbit :
            listFilterType === "sort" ? selectedSortBy :
            selectedStatus
          }
          onSelectSatellite={navigateToDetail}
          onBack={navigateHome}
        />
      )}
      {currentPage === "detail" && (
        <SatelliteDetailPage
          satelliteId={selectedSatelliteId}
          onBack={navigateHome}
        />
      )}
    </div>
  );
}