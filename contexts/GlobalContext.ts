import React from "react";

interface GlobalContextI {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  hospitalId: number | null;
  setHospitalId: React.Dispatch<React.SetStateAction<number | null>>;
  projectId: number | null;
  setProjectId: React.Dispatch<React.SetStateAction<number | null>>;

  downloading: boolean;
  setDownloading: React.Dispatch<React.SetStateAction<boolean>>;

  offlineUpdate: boolean;
  setOfflineUpdate: React.Dispatch<React.SetStateAction<boolean>>;

  isCheckingLatestUpdated: boolean;
  setIsCheckingLatestUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = React.createContext<GlobalContextI>({
  searchQuery: "",
  setSearchQuery: () => {},
  hospitalId: null,
  setHospitalId: () => {},
  projectId: null,
  setProjectId: () => {},
  downloading: false,
  setDownloading: () => {},
  offlineUpdate: false,
  setOfflineUpdate: () => {},
  isCheckingLatestUpdated: false,
  setIsCheckingLatestUpdated: () => {},
});

export default GlobalContext;
