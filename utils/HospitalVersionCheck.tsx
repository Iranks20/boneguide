import axios from 'axios'; // Import axios or your preferred HTTP client library
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sqlite_new.db');


export interface Hospital {
  id: number;
  name: string;
}

export const getHospitalsFromAPI = async (): Promise<Hospital[]> => {
  try {
    // Implement logic to fetch hospitals from the API
    const response = await axios.get('https://boneguide.herokuapp.com/hospitals');
    console.log('background hospitals fetched :', response.data)
    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching hospitals from API: ');
  }
};

export const fetchHospitalVersionFromAPI = async (hospitalId: number): Promise<string> => {
  try {
    const response = await axios.get(`https://boneguide.herokuapp.com/flow/version/${hospitalId}`);

    if (response.data && response.data.data && response.data.data.currentVersion && response.data.data.currentVersion.name) {
      return response.data.data.currentVersion.name;
    } else {
      console.error('Invalid API response for hospital version:', response.data);
      throw new Error('Invalid API response for hospital version');
    }
  } catch (error: any) {
    console.error(`Error fetching hospital version from API for hospital ${hospitalId}: `, error);
    throw new Error(`Error fetching hospital version from API for hospital ${hospitalId}: ` + error.message);
  }
};

export const fetchHospitalVersionFromSQLite = async (hospitalId: number): Promise<string> => {
  return new Promise<string>((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT name FROM hospital_version WHERE hoospitalId = ?',
        [hospitalId],
        (_, results) => {
          if (results.rows.length > 0) {
            const version = results.rows.item(0).name;
            resolve(version);
            console.log('hospital version from sqlite:', hospitalId, version);
          } else {
            console.error('Hospital version data not found in SQLite for hospital:', hospitalId);
            resolve("");
          }
        },
        (_, error) => {
          // Catch SQLite errors and handle them here
          console.error('SQLite error while fetching hospital version:', error);
          resolve(""); // Return a default value or handle it as needed
          return false;
        }
      );
    });
  });
};

// export const checkHospitalExistsInUpdatedTable = async (hospitalId: number): Promise<boolean> => {
//   return new Promise<boolean>((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT * FROM updated_hospitals WHERE id = ? LIMIT 1;',
//         [hospitalId],
//         (tx, results) => {
//           const len = results.rows.length;
//           resolve(len > 0);
//         },
//         (tx, error) => {
//           reject(error);
//           return false;
//         }
//       );
//     });
//   });
// };

export const checkHospitalExistsInUpdatedTable = async (hospitalId: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
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
        () => {
          // After table creation, proceed with the SELECT query
          tx.executeSql(
            'SELECT * FROM updated_hospitals WHERE id = ? LIMIT 1;',
            [hospitalId],
            (tx, results) => {
              const len = results.rows.length;
              resolve(len > 0);
            },
            (tx, error) => {
              reject(error);
              return false;
            }
          );
        },
        (tx, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};



// background equal version check
export const getHospitalscheckFromAPI = async (): Promise<Hospital[]> => {
  try {
    // Fetch hospitals (ids and names) from the first API endpoint
    const response = await axios.get('https://boneguide.herokuapp.com/hospitals');
    const hospitals: Hospital[] = response.data.data;

    // Fetch versions for each hospital
    const hospitalsWithVersions: Hospital[] = await Promise.all(
      hospitals.map(async (hospital) => {
        try {
          const versionResponse = await axios.get(`https://boneguide.herokuapp.com/flow/version/${hospital.id}`);
          const versionData = versionResponse.data;

          // Add the version information to the hospital object
          return {
            ...hospital,
            version: versionData?.data?.currentVersion?.name || 'Version not found',
          };
        } catch (error) {
          console.error(`Error fetching version for hospital ${hospital.id}: `, error);
          // If there's an error fetching the version, return the hospital without the version
          return hospital;
        }
      })
    );

    console.log('Hospitals with versions:', hospitalsWithVersions);
    return hospitalsWithVersions;
  } catch (error) {
    throw new Error('Error fetching hospitals with versions from API: ');
  }
};

export const fetchHospitalscheckFromSQLite = async (): Promise<Hospital[]> => {
  return new Promise<Hospital[]>((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT hoospitalId, name FROM hospital_version',
        [],
        (_, results) => {
          const hospitals: Hospital[] = [];
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              hospitals.push({
                id: row.hoospitalId,
                name: row.name,
              });
            }
          }
          resolve(hospitals);
        },
        (_, error) => {
          console.error('SQLite error while fetching hospitals:', error);
          resolve([]); // Return an empty array or handle it as needed
          return false;
        }
      );
    });
  });
};


// export const fetchAndInsertHospitalsVersions = async () => {
//   try {
//     const response = await axios.get('https://boneguide.herokuapp.com/hospitals');
//     const hoospitalIds: number[] = response.data.map((hospital: any) => hospital.id);

//     // Fetch and insert hospital version for each hoospitalId
//     for (const hoospitalId of hoospitalIds) {
//       try {
//         const response = await axios.get(`https://boneguide.herokuapp.com/flow/version/${hoospitalId}`);
//         const responseData = response.data;

//         if (responseData && responseData.messageType === 'success' && responseData.data && responseData.data.currentVersion) {
//           const version = responseData.data.currentVersion;
//           const versionId = version.id;
//           const versionName = version.name;

//           await new Promise<void>((resolve, reject) => {
//             db.transaction((tx) => {
//               tx.executeSql(
//                 `CREATE TABLE IF NOT EXISTS hospitals_versions (
//                 id INTEGER PRIMARY KEY,
//                 name TEXT NOT NULL,
//                 hoospitalId INTEGER NOT NULL
//               );`,
//                 [],
//                 () => {
//                   tx.executeSql(
//                     `DELETE FROM hospitals_versions WHERE hoospitalId = ?`,
//                     [hoospitalId],
//                     () => {
//                       tx.executeSql(
//                         'INSERT INTO hospitals_versions (id, name, hoospitalId) VALUES (?, ?, ?)',
//                         [versionId, versionName, hoospitalId],
//                         () => {
//                           console.log('Hospital version data inserted succenssfully for hoospitalId:', hoospitalId);
//                           resolve();
//                         },
//                         (tx, error) => {
//                           console.error('Error inserting hospital version data:', error);
//                           reject(error);
//                           return false;
//                         }
//                       );
//                     },
//                     (tx, error) => {
//                       console.error('Error deleting existing hospital version data:', error);
//                       reject(error);
//                       return false;
//                     }
//                   );
//                 },
//                 (tx, error) => {
//                   console.error('Error creating hospital version table:', error);
//                   reject(error);
//                   return false;
//                 }
//               );
//             });
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching and inserting hospital version:', error);
//       }
//     }
//   } catch (error) {
//     console.error('Error executing transaction:', error);
//   }
// };

export const fetchAndInsertHospitalsVersions = async () => {
  try {
    const response = await axios.get('https://boneguide.herokuapp.com/hospitals');
    const hospitals = response.data?.data; // Assuming the hosdddpitals are nested under 'data'

    if (Array.isArray(hospitals)) {
      const hoospitalIds: number[] = hospitals.map((hospital: any) => hospital.id);

      for (const hoospitalId of hoospitalIds) {
        try {
          const versionResponse = await axios.get(`https://boneguide.herokuapp.com/flow/version/${hoospitalId}`);
          const responseData = versionResponse.data;

          if (responseData && responseData.messageType === 'success' && responseData.data && responseData.data.currentVersion) {
            const version = responseData.data.currentVersion;
            const versionId = version.id;
            const versionName = version.name;

            await new Promise<void>((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  `CREATE TABLE IF NOT EXISTS hospitals_versions (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    hoospitalId INTEGER NOT NULL
                  );`,
                  [],
                  () => {
                    tx.executeSql(
                      `DELETE FROM hospitals_versions WHERE hoospitalId = ?`,
                      [hoospitalId],
                      () => {
                        tx.executeSql(
                          'INSERT INTO hospitals_versions (id, name, hoospitalId) VALUES (?, ?, ?)',
                          [versionId, versionName, hoospitalId],
                          () => {
                            console.log('Hospital version data inserted successfully for hoospitalId:', hoospitalId);
                            resolve();
                          },
                          (tx, error) => {
                            console.error('Error inserting hospital version data:', error);
                            resolve();
                            return false;
                          }
                        );
                      },
                      (tx, error) => {
                        console.error('Error deleting existing hospital version data:', error);
                        resolve();
                        return false;
                      }
                    );
                  },
                  (tx, error) => {
                    console.error('Error creating hospital version table:', error);
                    resolve();
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
    } else {
      console.error('Hospitals data not found in the response');
    }
  } catch (error) {
    console.error('Error executing transaction:', error);
  }
};

export const getLatestVersionNameByHospitalId = async (hospitalId: number): Promise<string | undefined> => {
  return new Promise<string | undefined>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT name FROM hospitals_versions WHERE hoospitalId = ?`,
        [hospitalId],
        (_, results) => {
          if (results.rows.length > 0) {
            const versionName = results.rows.item(0).name;
            resolve(versionName);
          } else {
            resolve(undefined); // Return undefined if version name not found for the hospitalId
          }
        },
        (tx, error) => {
          console.error('Error fetching version name:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getInititalVersionNameFromUpdatedHospitals = async (hospitalId: number): Promise<string | undefined> => {
  return new Promise<string | undefined>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT version_name FROM updated_hospitals WHERE id = ?`,
        [hospitalId],
        (_, results) => {
          if (results.rows.length > 0) {
            const versionName = results.rows.item(0).version_name;
            resolve(versionName);
          } else {
            resolve(undefined); // Return undefined if version name not found for the hospitalId
          }
        },
        (tx, error) => {
          console.error('Error fetching version name from updated hospitals:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};





export interface HospitalWithStatus {
  id: number;
  name: string;
  updatedStatus: 'UPDATED' | 'NOT_UPDATED' | 'NOT_FOUND';
}

export const compareHospitalVersions = async (): Promise<HospitalWithStatus[]> => {
  try {
    const hospitalsFromAPI: Hospital[] = await getHospitalscheckFromAPI();
    const hospitalsFromSQLite: Hospital[] = await fetchHospitalscheckFromSQLite();

    const hospitalsWithStatus: HospitalWithStatus[] = hospitalsFromAPI.map((apiHospital) => {
      const correspondingSQLiteHospital = hospitalsFromSQLite.find(
        (sqliteHospital) => sqliteHospital.id === apiHospital.id
      );

      const correspondingVersion = correspondingSQLiteHospital?.name ?? '';

      const updatedStatus = apiHospital.name !== correspondingVersion
        ? 'UPDATED'
        : 'NOT_UPDATED';

      return {
        id: apiHospital.id,
        name: apiHospital.name,
        updatedStatus,
      };
    });

    console.log(hospitalsWithStatus); // Function to save status in SQLite

    return hospitalsWithStatus;
  } catch (error) {
    throw new Error('Error comparing hospital versions: ');
  }
};


export const saveHospitalStatusToSQLite = async (hospitalsWithStatus: HospitalWithStatus[]): Promise<void> => {
  try {
    // Open the SQLite database
    const db = SQLite.openDatabase('sqlitee.db');

    // Create the hospital_update_data table if it doesn't exist
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS hospital_update_data (
            id INTEGER PRIMARY KEY,
            hospital_id INTEGER,
            updated_status TEXT
          );`,
          [],
          (_, success) => {
            console.log('Hospital update data table created successfully');
            resolve();
          },
          (_, error) => {
            console.error('Error creating hospital update data table:', error);
            reject(error);
            return false;
          }
        );
      });
    });

    // Insert data into the hospital_update_data table
    await Promise.all(
      hospitalsWithStatus.map((hospital) => {
        return new Promise<void>((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO hospital_update_data (hospital_id, updated_status) VALUES (?, ?);',
              [hospital.id, hospital.updatedStatus],
              (_, success) => {
                console.log('Hospital status inserted successfully');
                resolve();
              },
              (_, error) => {
                console.error('Error inserting hospital status:', error);
                reject(error);
                return false;
              }
            );
          });
        });
      })
    );
  } catch (error) {
    throw new Error('Error saving hospital status to SQLite: ');
  }
};




