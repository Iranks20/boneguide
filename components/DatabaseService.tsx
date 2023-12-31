
import { useEffect, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import GlobalContext from '../contexts/GlobalContext';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('sqlite_new.db');


const DatabaseService = () => {

  interface Breadcrumb {
    id: number;
    title: string;
  }

  interface Childnode {
    id: number;
    title: string;
    content: string;
    parentNodeId: string;
  }

  interface grandChildNode {
    id: number;
    title: string;
    content: string;
    parentNodeId: string;
    breadcrumb: Breadcrumb[];
    childNodes: Childnode[]
  }

  interface SubBreadcrumb {
    id: number;
    title: string;
  }

  interface ChildNode {
    id: number;
    title: string;
    content: string;
    parentNodeId?: number | null;
    breadcrumb: Breadcrumb[];
    childNodes: Childnode[]

  }

  interface ProjectNode {
    id: number;
    title: string;
    content: string;
    parentNodeId?: number | null;
    projectVersionId: number;
    breadcrumb: Breadcrumb[];
    childNodes: ChildNode[];
  }

  interface Project {
    id: number;
    name: string;
    isPublished: boolean;
    nodes: {
      id: number;
      title: string;
      content: string;
      grandParentNodeId: number | null;
      parentNodeId: number;
      editable: boolean;
      expanded: boolean;
      projectVersionId: number;
      childNodes: any[];
    }[];
  }

  const { setDownloading, hospitalId } = useContext(GlobalContext);
  console.log('current hospital id: ', hospitalId)

  const createHospitalTable = async (): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS hospitals (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            maintenancemode INTEGER,
            maintenancedate TEXT
          );`,
            [],
            async () => {
              try {
                await updateHospitalTable();
                console.log('Hospital table updated successfully');
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            (tx, error) => {
              reject(error);
              return false;
            }
          );
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateHospitalTable = async () => {
    try {
      const response = await axios.get('https://boneguide.herokuapp.com/hospitals');
      const responseData = response.data;

      if (responseData && Array.isArray(responseData.data)) {
        const hospitals = responseData.data;

        await new Promise<void>((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM hospitals',
              [],
              () => {
                const promises = hospitals.map((hospital: any) => {
                  return new Promise<void>((innerResolve, innerReject) => {
                    tx.executeSql(
                      'INSERT INTO hospitals (id, name, maintenancemode, maintenancedate) VALUES (?, ?, ?, ?)',
                      [hospital.id, hospital.name, hospital.maintenanceMode, hospital.maintenanceDate],
                      () => {
                        console.log("hospitals updated successfully")
                        innerResolve();
                      },
                      (tx, error) => {
                        innerReject(error);
                        return false
                      }
                    );
                  });
                });

                Promise.all(promises)
                  .then(() => {
                    resolve();
                  })
                  .catch((error) => {
                    reject(error);
                  });
              },
              (tx, error) => {
                reject(error);
                return false
              }
            );
          });
        });
      }
    } catch (error) {
      console.error('Error updating hospital table:', error);
      throw error;
    }
  };

  const fetchAndInsertHospitalVersion = async () => {
    try {
      const hoospitalIds = await new Promise<number[]>((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT id FROM hospitals',
            [],
            (_, results) => {
              const ids: number[] = [];
              for (let i = 0; i < results.rows.length; i++) {
                const hoospitalId = results.rows.item(i).id;
                ids.push(hoospitalId);
              }
              resolve(ids);
            },
            (tx, error) => {
              reject(error);
              return false;
            }
          );
        });
      });

      // Fetch and insert hospital version for each hoospitalId
      for (const hoospitalId of hoospitalIds) {
        try {
          const response = await axios.get(`https://boneguide.herokuapp.com/flow/version/${hoospitalId}`);
          const responseData = response.data;

          if (responseData && responseData.messageType === 'success' && responseData.data && responseData.data.currentVersion) {
            const version = responseData.data.currentVersion;
            const versionId = version.id;
            const versionName = version.name;

            await new Promise<void>((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  `CREATE TABLE IF NOT EXISTS hospital_version (
                  id INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  hoospitalId INTEGER NOT NULL
                );`,
                  [],
                  () => {
                    tx.executeSql(
                      `DELETE FROM hospital_version WHERE hoospitalId = ?`,
                      [hoospitalId],
                      () => {
                        tx.executeSql(
                          'INSERT INTO hospital_version (id, name, hoospitalId) VALUES (?, ?, ?)',
                          [versionId, versionName, hoospitalId],
                          () => {
                            console.log('Hospital version data inserted successfully for hoospitalId:', hoospitalId);
                            resolve();
                          },
                          (tx, error) => {
                            console.error('Error inserting hospital version data:', error);
                            reject(error);
                            return false;
                          }
                        );
                      },
                      (tx, error) => {
                        console.error('Error deleting existing hospital version data:', error);
                        reject(error);
                        return false;
                      }
                    );
                  },
                  (tx, error) => {
                    console.error('Error creating hospital version table:', error);
                    reject(error);
                    return false;
                  }
                );
              });
            });
          }
        } catch (error) {
          console.error('Error fetching and inserting hospital version:', error);
        }
      }
    } catch (error) {
      console.error('Error executing transaction:', error);
    }
  };

  const createDefaultHospitalTable = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS default_hospital (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          maintenancemode INTEGER,
          maintenancedate TEXT
        );`,
          [],
          async () => {
            try {
              console.log('Success for default hospital');
              await updateDefaultHospitalTable();
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          (tx, error) => {
            reject(error);
            console.error('Error creating default hospital:', error);
            return false;
          }
        );
      });
    });
  };

  const updateDefaultHospitalTable = async () => {
    try {
      const response = await axios.get('https://boneguide.herokuapp.com/hospitals/default');
      const responseData = response.data;

      if (responseData && responseData.data && responseData.data.hospital) {
        const hospital = responseData.data.hospital;

        await new Promise<void>((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM default_hospital',
              [],
              () => {
                tx.executeSql(
                  'INSERT INTO default_hospital (id, name, maintenancemode, maintenancedate) VALUES (?, ?, ?, ?)',
                  [hospital.id, hospital.name, hospital.maintenanceMode, hospital.maintenanceDate],
                  () => {
                    console.log('Default hospital data inserted or exists alrea');
                    fetchAndInsertDefaultProject(resolve);
                  },
                  (tx, error) => {
                    console.error('Error updating default hospital', error);
                    reject(error);
                    return false;
                  }
                );
              },
              (tx, error) => {
                console.error('Error deleting from default_hospital', error);
                reject(error);
                return false;
              }
            );
          });
        });
      }
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      throw error;
    }
  };

  const fetchAndInsertDefaultProject = async (resolve: () => void) => {
    try {
      const results = await new Promise<any>((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT id FROM hospitals',
            [],
            (_, results) => {
              const hospitals = [];
              for (let i = 0; i < results.rows.length; i++) {
                hospitals.push(results.rows.item(i).id);
              }
              resolve(hospitals);
            },
            (tx, error) => {
              console.error('Error fetching data from hospitals:', error);
              reject(error);
              return false;
            }
          );
        });
      });

      for (let i = 0; i < results.length; i++) {
        const hoospitalId = results[i];
        try {
          const response = await axios.get(`https://boneguide.herokuapp.com/hospitals/${hoospitalId}/default-project`);
          const responseData = response.data;

          if (responseData && responseData.messageType === 'success' && responseData.data) {
            const project = responseData.data;

            await new Promise<void>((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  `CREATE TABLE IF NOT EXISTS default_projects (
                  id INTEGER PRIMARY KEY,
                  title TEXT NOT NULL,
                  hoospitalId INTEGER NOT NULL
                );`,
                  [],
                  () => {
                    tx.executeSql(
                      'DELETE FROM default_projects WHERE hoospitalId = ?',
                      [hoospitalId],
                      () => {
                        tx.executeSql(
                          'INSERT INTO default_projects (id, title, hoospitalId) VALUES (?, ?, ?)',
                          [project.id, project.title, hoospitalId],
                          () => {
                            console.log('Default project data inserted successfully for hoospitalId:', hoospitalId);
                            resolve();
                          },
                          (tx, error) => {
                            console.error('Error inserting default project data:', error);
                            reject(error);
                            return false;
                          }
                        );
                      },
                      (tx, error) => {
                        console.error('Error deleting existing data for hoospitalId:', hoospitalId, error);
                        reject(error);
                        return false;
                      }
                    );
                  },
                  (tx, error) => {
                    console.error('Error creating default_project table:', error);
                    reject(error);
                    return false;
                  }
                );
              });
            });
          }
        } catch (error) {
          console.error('Error fetching and inserting default projects:', error);
        }
      }

      resolve();
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  };

  const createUpdatedHospitalTable = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS updated_hospitals (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            maintenancemode INTEGER,
            maintenancedate TEXT,
            version_name INTEGER
          );`,
          [],
          async () => {
            console.log('updated_hospitals table created successfully');
            resolve();
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const createProjectsCategoryTable = async (hospitalId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const tableName = `project_category${hospitalId}`;

      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY,
            title TEXT
          );`,
          [],
          async () => {
            console.log(`${tableName} table created successfully`);
            resolve();
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });

    });
  };


  const createChildNodesTable = async (hospitalId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS nodes_table${hospitalId} (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            parentNodeId INTEGER
          );`,
          [],
          async () => {
            console.log(`nodes_table${hospitalId} created successfully`);
            resolve();
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  // const createBreadcrumbTable = async (hospitalId: number): Promise<void> => {
  //   return new Promise<void>((resolve, reject) => {
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         `CREATE TABLE IF NOT EXISTS breadcrumbs_tables${hospitalId} (
  //           id INTEGER,
  //           title TEXT,
  //           childNodeId INTEGER
  //         );`,
  //         [],
  //         async () => {
  //           console.log(`breadcrumb_table${hospitalId} created successfully`);
  //           resolve();
  //         },
  //         (tx, error) => {
  //           reject(error);
  //           return false;
  //         }
  //       );
  //     });
  //   });
  // };

  const createBreadcrumbTable = async (tableName: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER PRIMARY KEY,
            title TEXT,
            childNodeId INTEGER
          );`,
          [],
          async () => {
            console.log(`${tableName} created successfully`);
            resolve();
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };
  

  const createGrandChildNodesTable = async (hospitalId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS sub_nodes_table${hospitalId} (
            id INTEGER PRIMARY KEY,
            title TEXT,
            image TEXT,
            content TEXT,
            parentNodeId INTEGER
          );`,
          [],  
          async () => {
            console.log(`sub_nodes_table${hospitalId} table created successfully`);
            resolve();
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };  
  
  const fetchDataAndStoreInDatabase = async () => {
    try {
      setDownloading(true);
  
      console.log('hospital id being used to fetch:', hospitalId);
      const response = await axios.get(`https://boneguide.herokuapp.com/hospitals/all/${hospitalId}`);
      const { hospital, projects }: { hospital: any; projects: Project[] } = response.data;
  
      const publishedProjects = projects.filter((project) => project.isPublished);
  
      await deleteHospitalData(hospital.id);
      await storeHospitalData(hospital, publishedProjects[0].name);
      await deleteFromProjectsCategory()
      await deleteFromNodesData();
      // await deleteFromBreadcrumbs();
      await deleteFromSubNodeTables();
      console.log('finished clearing all tables')
  
      for (const project of publishedProjects) {
        await storeProjectData(project);
      }
  
      setDownloading(false);
    } catch (error) {
      console.error('Error fetching or storing data:', error);
      setDownloading(false);
    }
  };
  
  const deleteHospitalData = async (hospitalId: number) => {
    return txExecuteSql(`DELETE FROM updated_hospitals WHERE id = ?;`, [hospitalId]);
  };
  const deleteFromNodesData = async () => {
    return txExecuteSql(`DELETE FROM nodes_table${hospitalId}`);
  };

  const deleteFromProjectsCategory = async () => {
    return txExecuteSql(`DELETE FROM project_category${hospitalId}`);
  };
  // const deleteFromBreadcrumbs = async () => {
  //   return txExecuteSql(`DELETE FROM breadcrumbs_tables${hospitalId}`);
  // };
  const deleteFromSubNodeTables = async () => {
    return txExecuteSql(`DELETE FROM sub_nodes_table${hospitalId}`);
  };
  
  const storeHospitalData = async (hospital: any, versionName: string) => {
    console.log('this is the versin number :', versionName)
    return txExecuteSql(
      `INSERT INTO updated_hospitals (id, name, maintenancemode, maintenancedate, version_name) VALUES (?, ?, ?, ?, ?);`,
      [hospital.id, hospital.name, hospital.maintenanceMode ? 1 : 0, hospital.maintenanceDate, versionName]
    );
  };
  
  const storeProjectData = async (project: Project) => {
    const promises: Promise<void>[] = [];
  
    for (const node of project.nodes) {
      promises.push(txExecuteSql(`INSERT INTO project_category${hospitalId} (id, title) VALUES (?, ?);`, [node.id, node.title]));
  
      for (const childNode of node.childNodes) {
        promises.push(txExecuteSql(`INSERT INTO nodes_table${hospitalId} (id, title, parentNodeId) VALUES (?, ?, ?);`, [childNode.id, childNode.title, childNode.parentNodeId]));
  
        for (const crumb of childNode.breadcrumb) {
          const tableName = `breadcrumbs_tables${childNode.id}`;
          promises.push(createBreadcrumbTable(tableName));
          promises.push(txExecuteSql(`INSERT OR REPLACE INTO ${tableName} (id, title, childNodeId) VALUES (?, ?, ?);`, [crumb.id, crumb.title, childNode.id]));
  
          for (const grandChildNode of childNode.childNodes) {
            const { id, title, content, image, parentNodeId } = grandChildNode;
            let imageUrl = null;
            let contentValue: string | null = null;
  
            try {
              if (image !== null) {
                imageUrl = await downloadAndSaveImage(image);
              } 

              if (content && content.trim() !== '') {
                try {
                  const contentJSON = JSON.parse(content);
      
                  if (contentJSON.type === 'doc' && contentJSON.content) {
                    await processImages(contentJSON.content);
                  }
      
                  contentValue = JSON.stringify(contentJSON);
                } catch (error) {
                  console.error(`Error parsing content for Node ID ${hospitalId}:`, error);
                  console.error('Problematic content:',content);
                }
              }
  
              await txExecuteSql(
                `INSERT OR REPLACE INTO sub_nodes_table${hospitalId} (id, title, content, image, parentNodeId) VALUES (?, ?, ?, ?, ?);`,
                [id, title, content, image, parentNodeId]
              );
  
              console.log('Inserted sub_node with image URL:', image);
            } catch (error) {
              console.error('Error inserting sub_node data:', error);
            }
  
            // for (const grandChildCrumb of grandChildNode.breadcrumb) {
            //   promises.push(txExecuteSql(`INSERT INTO breadcrumbs_tables${hospitalId} (id, title, childNodeId) VALUES (?, ?, ?);`, [grandChildCrumb.id, grandChildCrumb.title, grandChildNode.id]));
            // }
            for (const grandChildCrumb of grandChildNode.breadcrumb) {
              const tableName = `breadcrumbs_tables${grandChildCrumb.id}`;
              promises.push(createBreadcrumbTable(tableName));
              promises.push(txExecuteSql(`INSERT OR REPLACE INTO ${tableName} (id, title, childNodeId) VALUES (?, ?, ?);`, [grandChildCrumb.id, grandChildCrumb.title, grandChildNode.id]));
            }

          }
        }
      }
    }
  
    return Promise.all(promises);
  };
  
  const txExecuteSql = (sql: string, params?: any[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // console.log('Executing SQL:', sql, 'with params:', params || []);
  
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            params || [],
            (_, result) => {
              console.log('SQL executed successfully:', sql);
              resolve();
            },
            (_, error) => {
              console.error('Error executing SQL:', sql, error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
          reject(error);
        }
      );
    });
  };

  const downloadAndSaveImage = async (imageUrl: string): Promise<string | null> => {
    try {
      
      if (!imageUrl || imageUrl.trim() === '') {
        console.error('Image URL is empty or null.');
        return null;
      }

      const directory = FileSystem.documentDirectory + 'images/';
      const fileName = `image_${Math.random().toString(36).substr(2, 9)}.png`;
      const fileUri = directory + fileName;

      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadedFile && downloadedFile.status === 200) {
        console.log(`Successfully downloaded images out: ${imageUrl}`);
        // console.log('this is the locallink for the image: ', downloadedFile.uri)
        return downloadedFile.uri;
      } else {
        throw new Error(`Failed to download image: ${imageUrl}`);
      }
    } catch (error) {
      console.error('Error downloading images:', error);
      return null;
    }
  };

  const processImages = async (content: any[]) => {
    for (const item of content) {
      if (item.type === 'image' && item.attrs && item.attrs.src) {
        const localImagePath = await downloadAndSaveContentImage(item.attrs.src);
        if (localImagePath) {
          item.attrs.src = localImagePath;
          console.log('Updated image source:', localImagePath);
        }
      }
    }
  };
  
  
  
  const downloadAndSaveContentImage = async (imageUrl: string): Promise<string | null> => {
    try {
      // Image download and save logic
      const directory = FileSystem.documentDirectory + 'images/';
      const fileName = `image_${Math.random().toString(36).substr(2, 9)}.png`; // Generate a random file name
      const fileUri = directory + fileName;
  
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }
  
      const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);
  
      if (downloadedFile && downloadedFile.status === 200) {
        console.log(`Successfully downloaded image: ${imageUrl}`);
        return downloadedFile.uri;
      } else {
        throw new Error(`Failed to download image: ${imageUrl}`);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('we accessbed you')
    const checkAndCreateTables = async () => {
      try {
        setDownloading(true);
        await createHospitalTable();
        await createDefaultHospitalTable();
        await fetchAndInsertHospitalVersion();
        await createUpdatedHospitalTable();
        if (hospitalId !== null) {
          await createProjectsCategoryTable(hospitalId);
          await createChildNodesTable(hospitalId);
          // await createBreadcrumbTable(hospitalId);
          await createGrandChildNodesTable(hospitalId);
        } else {
          throw new Error('Hospital ID is null');
        }
        await fetchDataAndStoreInDatabase();
        setDownloading(false);
      } catch (error) {
        console.error('Error creating tables:', error);
      }
    };

    checkAndCreateTables();
    const getAllBreadcrumbs = (callback: any) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM project_category${hospitalId}`,

          [],
          (_, results) => {
            const rows = results.rows;
            const breadcrumbs = [];
            for (let i = 0; i < rows.length; i++) {
              breadcrumbs.push(rows.item(i));
            }
            callback(breadcrumbs);
          },
          (_, error) => {
            console.error('Error fetching all projetcs:', error);
            callback([]);
            return false;
          }
        );
      });
    };

    getAllBreadcrumbs((breadcrumbs: any) => {
      console.log('All images:', breadcrumbs);
    });
  }, [hospitalId]);

  return null;
};

export default DatabaseService;