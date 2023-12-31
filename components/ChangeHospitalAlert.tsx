import React, { useState, useContext, useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

import AppText from "./AppText";
import RemixIcon from "react-native-remix-icon";
import { colors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { callEndpoint } from "../utils/api";
import AsyncSearchInput from "./AsyncSearchInput";
import GlobalContext from "../contexts/GlobalContext";
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sqlite_new.db');

interface Hospital {
  id: number;
  name: string;
}

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
          // console.error('SQL execution error:', error);
          return false;
        }
      );
      
    });
  });
};

const fetchHospitalVersionFromSQLite = async (hospitalId: number) => {
  return new Promise<string>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT name FROM hospital_version WHERE hoospitalId = ?',
        [hospitalId],
        (_, results) => {
          if (results.rows.length > 0) {
            const version = results.rows.item(0).name;
            resolve(version);
          } else {
            resolve("");
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export function hospitalToOption({ id, name }: any) {
  return {
    label: name,
    value: id,
  };
}

function hospitalsToOptions(items: any) {
  return items.map((item: any) => hospitalToOption(item));
}

const ChangeHospitalAlert = ({ currentHospital }: any) => {
  const [showModal, setShowModal] = useState(false);
  const navigation: any = useNavigation();

  const { setHospitalId, setProjectId } = useContext(GlobalContext);
  const [offlineHospitals, setOfflineHospitals] = useState<Hospital[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [hospitalVersion, setHospitalVersion] = useState<string>("");

  useEffect(() => {
    fetchVersion();
  }, [currentHospital, isConnected]);

  
  useEffect(() => {
    getHospitalsFromSQLite()
      .then((hospitals) => {
        setOfflineHospitals(hospitals);
      })
      .catch((error) => {
        // console.error('Error fetching hospitals from SQLite:', error);
      });

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

  const fetchVersion = async () => {
    if (currentHospital && currentHospital.value) {
      if (!isConnected) {
        try {
          const version = await fetchHospitalVersionFromSQLite(currentHospital.value);
          setHospitalVersion(version);
        } catch (error) {
          console.error('Error fetching hospital version from SQLite:', error);
        }
      } else {
        try {
          const { data } = await callEndpoint({
            endpoint: `flow/version/${currentHospital.value}`,
          });

          if (data && data.currentVersion) {
            const version = data.currentVersion.name;
            setHospitalVersion(version);
          }
        } catch (error) {
          console.error('Error fetching hospital version:', error);
        }
      }
    }
  };

  const loadOptions = async (inputValue: any, callback: any) => {
    try {
      if (isConnected) {
        const { data } = await callEndpoint({
          endpoint: `hospitals?q=${inputValue}`,
        });

        if (data) {
          callback(hospitalsToOptions(data));
        }
      } else {
        // callback(hospitalsToOptions(offlineHospitals));
        const filteredOfflineHospitals = offlineHospitals.filter(
          (hospital) =>
            hospital.name.toLowerCase().includes(inputValue.toLowerCase())
        );
  
        callback(hospitalsToOptions(filteredOfflineHospitals));
      }
    } catch (e) {
      // console.error('Error loading hospitals:', e);
    }
  };

  return (
    <>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}
      >
        <View style={{ padding: 15 }}>
          <AsyncSearchInput
            placeholder="Search for a hospital..."
            loadOptions={loadOptions}
            onChange={(hospital: any) => {
              setHospitalId(hospital.value);
              setProjectId(null);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowModal(true)}
      >
        <AppText style={styles.buttonText}>
          {currentHospital ? (
            <>
              {currentHospital.label}{" "}
              <AppText style={styles.boldVersion}>
                {hospitalVersion ? `V${hospitalVersion}` : ""}
              </AppText>
            </>
          ) : (
            "Choose a hospital"
          )}
        </AppText>

        <View style={styles.buttonChange}>
          <AppText style={styles.buttonChangeText}>Change</AppText>
          <RemixIcon name="arrow-right-line" color={colors.MAIN} size={15} />
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF4FF",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingLeft: 10,
    paddingVertical: 4,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.MAIN,
    flex: 0.7,
  },
  boldVersion: {
    fontWeight: "bold",
  },
  buttonChange: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  buttonChangeText: {
    color: colors.MAIN,
    fontSize: 12,
    fontWeight: "500",
    marginRight: 5,
  },

  item: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eeeeee",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },

  modal: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default ChangeHospitalAlert;
