
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Breadcrumb from "../components/Breadcrumb";
import Loading from "../components/Loading";
import Screen from "../components/Screen";
import SearchBox from "../components/SearchBox";
import { callEndpoint } from "../utils/api";
import NodeView from "../components/NodeView";
import { StackNavigationProp } from "@react-navigation/stack";
import BackBtn from "../components/BackBtn";
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';
import GlobalContext from '../contexts/GlobalContext';


const db = SQLite.openDatabase('sqlite_new.db');


function toBreadCrumb(data: any[]): any[] {
  return data.map((item) => ({
    screen: "NodeScreen",
    text: item.title,
    parameters: { nodeId: item.id },
  }));
}

const NodeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const { hospitalId } = useContext(GlobalContext);

  const [loading, setLoading] = useState<boolean>(true);

  const nodeId = route.params.nodeId;

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [children, setChildren] = useState<string[]>([]);
  const [content, setContent] = useState();
  const [breadcrumb, setBreadcrumb] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  console.log(isConnected)

  useEffect(() => {

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

  const getSQLiteBreadcrumbData = async (): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT id, title FROM breadcrumbs_tables${nodeId}`,
          [],
          (tx, results) => {
            const len = results.rows.length;
            const breadcrumbData: any[] = [];
            for (let i = 0; i < len; i++) {
              breadcrumbData.push(results.rows.item(i));
            }
            resolve(breadcrumbData);
            console.log('your breadcrumbs:', breadcrumbData)
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const transformSQLiteDataToBreadcrumb = (data: any[]): any[] => {
    return data.map((item) => ({
      screen: "NodeScreen",
      text: item.title,
      parameters: { nodeId: item.id },
    }));
  };

  const getChildNodesFromSQLite = async (): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          // `SELECT * FROM nodes_details${nodeId}`,
          `SELECT id, title, image FROM sub_nodes_table${hospitalId} WHERE parentNodeId =?; `,
          [nodeId],
          (tx, results) => {
            const len = results.rows.length;
            const childNodesData: any[] = [];
            for (let i = 0; i < len; i++) {
              childNodesData.push(results.rows.item(i));
            }
            resolve(childNodesData);
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const getChildNodeContentFromSQLite = async (): Promise<any | null> => {
    return new Promise<any | null>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT content FROM sub_nodes_table${hospitalId} WHERE id =?; `,
          [nodeId],
          (tx, results) => {
            const len = results.rows.length;
            if (len > 0) {
              const content = results.rows.item(0).content;
              resolve(content ? JSON.parse(content) : null);
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

  const loadData = async () => {
    try {
      setLoading(true);

      if (isConnected) {
        const { data } = await callEndpoint({
          endpoint: `projects/node/${nodeId}`,
        });

        const { maintenanceMode, node, breadcrumb }: any = data;

        if (maintenanceMode) {
          setIsMaintenanceMode(true);
        } else {
          if (node.content) setContent(JSON.parse(`${node.content}`));
          setBreadcrumb(toBreadCrumb(breadcrumb));
          setChildren(node.childNodes);
        }
      } else {
        console.log('no 2')
        const offlineChildNodes = await getChildNodesFromSQLite();
        setChildren(offlineChildNodes);
        const offlineBreadcrumbData = await getSQLiteBreadcrumbData();
        const transformedBreadcrumb = transformSQLiteDataToBreadcrumb(offlineBreadcrumbData);
        setBreadcrumb(transformedBreadcrumb);
        const offlineContent = await getChildNodeContentFromSQLite();
        console.log('these are the contenfts fetched from offline :', offlineContent)
        if (offlineContent) {
          setContent(offlineContent);
        } else {
          console.log('no content')
        }
      }
    } catch (e) {
      navigation.navigate("LandingScreen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected !== null) {
      loadData();
    }
  }, [isConnected]);

  return (
    <Screen>
      {loading ? (
        <Loading />
      ) : (
        <>
          <BackBtn />

          <Breadcrumb links={breadcrumb} />

          <NodeView
            isMaintenanceMode={isMaintenanceMode}
            children={children}
            content={content}
          />
        </>
      )}
    </Screen>
  );
};

export default NodeScreen;
