import { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { colors } from "./utils/colors";
import DrawerNavigator from "./navigation/DrawerNavigator";
import GlobalContext from "./contexts/GlobalContext";
import LoadingScreen from "./screens/LoadingScreen";
import NetInfo from '@react-native-community/netinfo';
import { getHospitalsFromAPI, fetchHospitalVersionFromAPI, fetchHospitalVersionFromSQLite, checkHospitalExistsInUpdatedTable, compareHospitalVersions, fetchAndInsertHospitalsVersions, getLatestVersionNameByHospitalId, getInititalVersionNameFromUpdatedHospitals } from "./utils/HospitalVersionCheck";
import DatabaseService  from "./components/DatabaseService";



export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const [hospitalId, setHospitalId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checkingUpdates, setCheckingUpdates] = useState(true);
  const [offlineUpdate, setOfflineUpdate] = useState(false);
  console.log('offline update check', offlineUpdate)
  const [downloading, setDownloading] = useState(false);
  const [isCheckingLatestUpdated, setIsCheckingLatestUpdated] = useState(false);
  console.log('checking  online status', isConnected)


  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (isConnected !== null) {
    if (isConnected) {
      console.log('we are online number 1')
      setOfflineUpdate(false)
      checkUpdates();
    } else {
      console.log('we are using offline number 2')
      performUpdatesCheck();
    }
  }
  }, [hospitalId, isConnected]);
  

  const performUpdatesCheck = async () => {
    setCheckingUpdates(true);
    try {
      if (hospitalId) {
        const hospitalExists = await checkHospitalExistsInUpdatedTable(hospitalId);
        console.log('this is the check if hospital exists:', hospitalExists);
        if (hospitalExists) {
          console.log('hospital exists in updated hospitals table');
          setOfflineUpdate(false);
          checkLatestVersionUpdated();
        } else {
          console.log('hospital does not exist in updated hospitals table');
          setOfflineUpdate(true);
        }
      } else {
        console.log('Hospital ID is not available yet.');
      }
    } catch (error) {
      console.error('Error checking hospital in updated_hospital table:', error);
    }
    setCheckingUpdates(false);
  };
  

  const checkUpdates = async () => {
    try {
      setCheckingUpdates(true);     
      if (hospitalId !== null) {
        try {
          await fetchAndInsertHospitalsVersions();
          const latestVersion = await fetchHospitalVersionFromAPI(hospitalId);
          console.log('version from api', latestVersion);
          const localVersion = await fetchHospitalVersionFromSQLite(hospitalId);
          console.log('localversion ', localVersion)

          if (latestVersion !== undefined && localVersion !== undefined) {
            if (latestVersion !== localVersion) {
              console.log(`New version available for hospital ${hospitalId}`);
              setDownloading(true);
            } else {
              // try {
                if (hospitalId) {
                const hospitalExists = await checkHospitalExistsInUpdatedTable(hospitalId);
          
                if (hospitalExists) {
                  setOfflineUpdate(false)
                  setDownloading(true);
                  console.log(`no new updates available for hospital id ${hospitalId}`)
                } else {
                  setOfflineUpdate(false)
                  setDownloading(true);
                  console.log(`hospital id ${hospitalId} was updated half way`)
                }

              } else {
                console.log('Hospital ID is not available yet.');
              }
            }
          } else {
            console.error(`Hospital version data undefined for hospital ${hospitalId}`);
          }
        } catch (error) {
          console.error('Error checking updates for hospital:', hospitalId, error);
        }
      } else {
        console.error('Hospital ID not available in the GlobalContext');
      }

      setCheckingUpdates(false);
    } catch (error) {
      console.error('Error checking updates:', error);
    }
  };

  const checkLatestVersionUpdated = async () => {
    try {
      setCheckingUpdates(true);
      
      if (hospitalId !== null) {
        try {
          const latestUpdatedVersion = await getLatestVersionNameByHospitalId(hospitalId);
          console.log('latest updated version from sqlite api', latestUpdatedVersion);
          const initialVersion = await getInititalVersionNameFromUpdatedHospitals(hospitalId);
          console.log('initial version of hospital from updated hospitals ', initialVersion)

          if (latestUpdatedVersion !== undefined && initialVersion !== undefined) {
            if (latestUpdatedVersion == initialVersion) {
              console.log(`you have latest version for hospital ${hospitalId}`);
              setIsCheckingLatestUpdated(false);
              setOfflineUpdate(false)
            } else {
              setIsCheckingLatestUpdated(true);
              console.log(`your currently viewing  an old version for hospital ${hospitalId}`);
            }
          } else {
            console.error(`latest latHospital version data undefined for hospital ${hospitalId}`);
          }
        } catch (error) {
          console.error('Error checking latest updates for hospital:', hospitalId, error);
        }
      } else {
        console.error('Hospital ID not available in the GlobalContext yet to be used in setIsCheckingLatestUpdated');
      }

      setCheckingUpdates(false);
    } catch (error) {
      console.error('Error checking setIsCheckingLatestUpdated:', error);
    }
  };


  return (
    <>    
    <GlobalContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        hospitalId,
        setHospitalId,
        projectId,
        setProjectId,
        downloading,
        setDownloading,
        offlineUpdate,
        setOfflineUpdate,
        isCheckingLatestUpdated,
        setIsCheckingLatestUpdated
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.WHITE} />
      <LoadingScreen checkingUpdates={checkingUpdates} downloading={downloading} offlineUpdate={offlineUpdate} isCheckingLatestUpdated={isCheckingLatestUpdated} />
      {!checkingUpdates && !downloading && !offlineUpdate && !isCheckingLatestUpdated && (
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
      )}
      {downloading && <DatabaseService />}
    </GlobalContext.Provider>

    </>
  );
}


