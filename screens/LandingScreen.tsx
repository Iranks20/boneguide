import React, { useEffect, useState, useContext } from "react";
import { View } from "react-native";
import AppList from "../components/AppList";
import Screen from "../components/Screen";
import TopicComponent from "../components/TopicComponent";
import { callEndpoint } from "../utils/api";
import ChangeHospitalAlert, {
  hospitalToOption,
} from "../components/ChangeHospitalAlert";
import Switcher from "../components/Switcher";
import SkeletonsPanel from "../components/skeleton/SkeletonsPanel";
import GlobalContext from "../contexts/GlobalContext";
import AppText from "../components/AppText";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sqlite_new.db');

interface Hospital {
  id: number;
  name: string;
  maintenancemode: boolean;
  maintenancedate: string | null;
}


const _colors = [
  "#FF7E87",
  "#A8008D",
  "#6BF0D8",
  "#F1C232",
  "#FF9781",
  "#00E3FF",
];

const getHospitalsFromSQLite = async (): Promise<Hospital[]> => {
  return new Promise<Hospital[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM hospitals',
        [],
        (tx, results) => {
          const len = results.rows.length;
          const hospitals: Hospital[] = [];
          for (let i = 0; i < len; i++) {
            hospitals.push(results.rows.item(i) as Hospital);
          }
          resolve(hospitals);
        },
        (tx, error) => {
          return false;
        }
      );

    });
  });
};

// Assuming you have already opened the SQLite database and stored it in the 'db' variable

const fetchUpdatedHospitalsData = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM updated_hospitals',
        [],
        (_, results) => {
          const len = results.rows.length;
          const updatedHospitalsData = [];
          for (let i = 0; i < len; i++) {
            updatedHospitalsData.push(results.rows.item(i));
          }
          console.log('this is the updated hospitals data:::::::::::::::::::::::', updatedHospitalsData)
          resolve(updatedHospitalsData);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};


const fetchDefaultHospitalData = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM default_hospital',
        [],
        (_, results) => {
          const len = results.rows.length;
          const hospitals = [];
          for (let i = 0; i < len; i++) {
            hospitals.push(results.rows.item(i));
          }
          resolve(hospitals);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const fetchDefaultProjectData = async (hospitalId: number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM default_projects WHERE hoospitalId = ?',
        [hospitalId],
        (_, results) => {
          const len = results.rows.length;
          const projects = [];
          for (let i = 0; i < len; i++) {
            projects.push(results.rows.item(i));
          }
          resolve(projects);
          console.log('default proects..............................................', projects)

        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};


// hospitals when there is hospitaId
const getHospitalsIdFromSQLite = async (hospitalId: number): Promise<Hospital | null> => {
  return new Promise<Hospital | null>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM hospitals WHERE id = ?',
        [hospitalId],
        (tx, results) => {
          if (results.rows.length > 0) {
            const hospital = results.rows.item(0) as Hospital;
            resolve(hospital);
          } else {
            resolve(null);
          }
        },
        (tx, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const LandingScreen = ({ route }: any) => {

  const [loading, setLoading] = useState(true);

  const {
    searchQuery: searchValue,
    hospitalId,
    setHospitalId,
    projectId,
    setProjectId,
  } = useContext(GlobalContext);
  const [currentHospital, setCurrentHospital] = useState<any>();
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any>();
  const [offlineHospitals, setOfflineHospitals] = useState<Hospital[]>([]);
  const [offlineProjects, setOfflineProjects] = useState<any[]>([]);
  const [offlineNodes, setOfflineNodes] = useState<any>();
  // console.log(offlineNodes)
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // const [nodes, setNodes] = useState([]);
  const [nodes, setNodes] = useState<Node[]>([]);



  const getNodesFromSQLite = async (projectId: number, searchQuery: string = ''): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM nodes_table${hospitalId} WHERE parentNodeId = ? AND title LIKE ?`,
          [projectId, `%${searchQuery}%`],
          (tx, results) => {
            const len = results.rows.length;
            const nodes: any[] = [];
            for (let i = 0; i < len; i++) {
              nodes.push(results.rows.item(i));
            }
            resolve(nodes);
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const getProjectsFromSQLite = async (currentHospitalId: number): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM project_category${hospitalId} `,
          [],
          (tx, results) => {
            const len = results.rows.length;
            const projects: any[] = [];
            for (let i = 0; i < len; i++) {
              projects.push(results.rows.item(i));
            }
            resolve(projects);
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  useEffect(() => {
    // getHospitalsFromSQLite()
    //   .then((hospitals) => {
    //     setOfflineHospitals(hospitals);
    //   })
    //   .catch((error) => {
    //     // console.error('Error fetching hospitals from SQLite:', error);
    //   });
    fetchUpdatedHospitalsData();

    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });


    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    })
    return () => {
      unsubscribe();
    };
  }, []);

  const loadHospital = async () => {
    try {
      if (!isConnected) {
        console.log('we are using offline mode sssssssss')
        if (!hospitalId) {
          const defaultHospitalData = await fetchDefaultHospitalData();
          const typedDefaultHospitalData = defaultHospitalData as Hospital[];

          if (typedDefaultHospitalData.length > 0) {
            const defaultHospital = typedDefaultHospitalData[0];
            setHospitalId(defaultHospital.id);

            const defaultProjectData = await fetchDefaultProjectData(defaultHospital.id);
            const typedDefaultProjectData = defaultProjectData as Hospital[];

            if (typedDefaultProjectData.length > 0) {
              const defaultProject = typedDefaultProjectData[0];
              setProjectId(defaultProject.id);
            }
          }
        } else if (!projectId) {
          const defaultProjectData = await fetchDefaultProjectData(hospitalId);
          const typedDefaultProjectData = defaultProjectData as Hospital[];

          if (typedDefaultProjectData.length > 0) {
            const defaultProject = typedDefaultProjectData[0];
            setProjectId(defaultProject.id);
          }
        } else {
          const hospitalData = await getHospitalsIdFromSQLite(hospitalId);
          if (hospitalData) {
            setCurrentHospital(hospitalToOption(hospitalData));
          }
        }
      } else {
        if (!hospitalId) {
          const { data } = await callEndpoint({
            endpoint: `hospitals/default`,
          });

          setHospitalId(data.hospital.id);
          setProjectId(data.project.id);
        } else if (!projectId) {
          const { data } = await callEndpoint({
            endpoint: `hospitals/${hospitalId}/default-project`,
          });

          setProjectId(data.id);
        } else {
          const { data: hospital } = await callEndpoint({
            endpoint: `hospitals/${hospitalId}`,
          });

          setCurrentHospital(hospitalToOption(hospital));
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (currentHospital && currentHospital.value) {
      getProjectsFromSQLite(currentHospital.value)
        .then((projects) => {
          setOfflineProjects(projects);
        })
        .catch((error) => {
          // console.error('Error fetching projects from SQLite:', error);
        });
    }
  }, [currentHospital]);

  // useEffect(() => {
  //   if (projectId) {
  //     getNodesFromSQLite(projectId)
  //       .then((nodes) => {
  //         setOfflineNodes(nodes);
  //       })
  //       .catch((error) => {
  //         // console.error('Error fetching nodes from SQLite:', error);
  //       });
  //   }
  // }, [projectId]);

  const loadProjects = async () => {
    if (!currentHospital) return;
    setLoading(true);
    try {
      if (!isConnected) {
        if (currentHospital && currentHospital.value) {
          const projectsFromSQLite = await getProjectsFromSQLite(currentHospital.value);
          console.log(projectsFromSQLite)
          setProjects(projectsFromSQLite);

          if (projectsFromSQLite.length > 0) {
            setCurrentProject(projectsFromSQLite.find((i: any) => i.id == projectId));
          }
        }
      } else if (currentHospital) {
        const { data: p } = await callEndpoint({
          endpoint: `projects/hospital/${currentHospital.value}`,
        });

        setProjects(p);
        if (p.length > 0) {
          setCurrentProject(
            p.find((i: any) => i.id == projectId)
          );
        }
      }
    } catch (e) {
      // console.error('Error loading projects:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadNodes = async () => {
    if (!projectId) return;
    setLoading(true);

    try {
      if (!isConnected && projectId) {
        // if (offlineNodes && offlineNodes.length > 0) {
        //   setNodes(offlineNodes);
        // } else {
        //   setNodes([]);
        // }
        const nodesFromSQLite = await getNodesFromSQLite(projectId, searchValue);
        setNodes(nodesFromSQLite || []);
      } else if (projectId) {
        const { data } = await callEndpoint({
          endpoint: `projects/${projectId}/root-nodes?q=${searchValue}`,
          requiresAuth: true,
        });

        setNodes(data.nodes);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentHospital, isConnected, hospitalId, projectId]);

  useEffect(() => {
    loadHospital();
  }, [hospitalId, projectId, isConnected]);

  useEffect(() => {
    loadNodes();
  }, [searchValue, isConnected, projectId, currentHospital]);


  // NEW
  // useEffect(() => {
  //   setHospitalId(hId);
  //   setProjectId(pId);
  // }, [hId, pId]);

  return (
    <Screen innerStyle={{ paddingBottom: 0 }} showFooter>
      <View style={{ flex: 1 }}>
        {/* choose hospital */}
        <View style={{ marginBottom: 10 }}>
          <ChangeHospitalAlert currentHospital={currentHospital} />
        </View>

        {/* choose project */}
        <View style={{ marginTop: 10 }}>
          <Switcher
            data={[
              ...projects.map((p: any) => ({
                id: p.id,
                text: p.title,
              })),
            ]}
            currentId={projectId}
            onSwitch={(id: any) => {
              setProjectId(id);
            }}
            disabled={loading}
          />
        </View>

        {/* nodes */}
        {loading ? (
          <Loading />
        ) : (
          <>
            {nodes.length > 0 ? (
              <>
                {searchValue ? (
                  nodes.map((node, index) => (
                    <TopicComponent
                      key={`node-${index}`}
                      nodeElement={node}
                      color={_colors[index % _colors.length]}
                    />
                  ))
                ) : (
                  <SkeletonsPanel
                    nodes={nodes}
                    currentProject={currentProject}
                  />
                )}
              </>
            ) : (
              <NoData
                title="Oops! No results found."
                content="Please try again with different keywords."
              />
            )}
          </>
        )}
      </View>
    </Screen>
  );
};

export default LandingScreen;
