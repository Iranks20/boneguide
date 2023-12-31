import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { callEndpoint } from "../utils/api";
import useDebounce from "../utils/useDebounce";
import AppList from "./AppList";
import AppTextInput from "./AppTextInput";
import BackBtn from "./BackBtn";
import NodeElement from "../models/NodeElement";
import MenuItem from "./MenuItem";
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('sqlite_new.db');

interface SearchBoxProps {
  currentHospital: any;
  hideSearch?: boolean;
}

const SearchBox = ({ currentHospital, hideSearch = false }: SearchBoxProps) => {
  const [v, setV] = useState("");

  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<NodeElement[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const getHospitalsFromSQLite = async (query: string = ''): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM hospitals WHERE your_search_column LIKE ?`, // Modify this query based on your SQLite table schema
          [`%${query}%`], // Adjust this query to match your table structure and search column
          (tx, results) => {
            const len = results.rows.length;
            const hospitals: any[] = [];
            for (let i = 0; i < len; i++) {
              hospitals.push(results.rows.item(i));
            }
            resolve(hospitals);
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const loadHospitalsFromSQLite = async (query: string) => {
    try {
      setLoading(true);
      const hospitals = await getHospitalsFromSQLite(query);
      setSearchData(hospitals);
    } catch (error) {
      console.error('Error loading hospitals from SQLite:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHospitalsFromAPI = async (query: string) => {
    try {
      setLoading(true);
      const { data } = await callEndpoint({
        endpoint: `projects/hospital/${currentHospital.id}?q=${query}`,
      });
      setSearchData(data);
    } catch (error) {
      console.error('Error loading hospitals from API:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (query: string) => {
    if (!currentHospital) return;

    if (!query) {
      setSearching(false);
      setSearchData([]);
      return;
    }

    setSearching(true);

    if (isConnected) {
      loadHospitalsFromAPI(query);
    } else {
      loadHospitalsFromSQLite(query);
    }
  };

  useDebounce(
    () => {
      loadData(v);
    },
    [v],
    300
  );

  return (
    <>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={searching}
        onRequestClose={() => {}}
      >
        <ScrollView>
          <View style={styles.container}>
            <View style={{ padding: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <AppTextInput
                  placeholder="Search"
                  icon="search-line"
                  value={v}
                  onChangeText={(text: string) => setV(text)}
                  autoFocus
                />

                <TouchableOpacity
                  style={{ marginLeft: 10, marginBottom: 18 }}
                  onPress={() => setSearching(false)}
                >
                  <RemixIcon name="close-line" />
                </TouchableOpacity>
              </View>
            </View>

            <AppList
              data={searchData}
              renderItem={(item: NodeElement) => {
                return <MenuItem nodeElement={item} />;
              }}
              noDataContent={`Sorry, the keyword you entered cannot be found, please check again or search with another keyword.`}
              loading={loading}
            />
          </View>
        </ScrollView>
      </Modal>

      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BackBtn />

          {!hideSearch && (
            <AppTextInput
              placeholder="Search"
              icon="search-line"
              value={v}
              onChangeText={(text: string) => setV(text)}
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SearchBox;
