import { useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import { themePalette } from "./lib/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  const saveToDo = async (toSave) => {
    const todo = JSON.stringify(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, todo);
  };

  const loadToDo = async () => {
    const todo = await AsyncStorage.getItem(STORAGE_KEY);
    const parsedToDo = JSON.parse(todo);
    setToDos(parsedToDo || {});
  };

  const onDelete = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const deletedToDo = {
            ...toDos,
          };
          delete deletedToDo[key];
          setToDos(deletedToDo);
          await saveToDo(deletedToDo);
        },
      },
    ]);
  };

  const addToDo = async () => {
    if (text === "") return;

    // saveToDo
    const newToDo = {
      ...toDos,
      [Date.now()]: {
        text,
        working,
        completed: false,
      },
    };

    setToDos(newToDo);
    await saveToDo(newToDo);
    setText("");
  };

  useEffect(() => {
    loadToDo();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? themePalette.white : themePalette.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? themePalette.grey : themePalette.white,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          value={text}
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          placeholderTextColor={themePalette.lightgrey}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.input}
        />
      </View>
      <ScrollView style={styles.toDoList}>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableNativeFeedback onPress={() => onDelete(key)}>
                <Text>❌</Text>
              </TouchableNativeFeedback>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themePalette.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
    gap: 32,
  },
  btnText: {
    fontSize: 32,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
    fontSize: 18,
  },
  toDoList: {
    marginTop: 32,
  },
  toDo: {
    backgroundColor: themePalette.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText: {
    color: themePalette.white,
  },
});
