import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Home() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasks = await AsyncStorage.getItem("tasks");
        if (tasks) {
          console.log(`Saved Tasks:\n ${tasks}`);

          setTasks(JSON.parse(tasks));
        }
      } catch (error) {
        console.log(`Error Getting Tasks:\n ${error}`);
      }
    };
    getTasks();
  }, []);

  const addTask = async () => {
    if (task === "") return;

    const newTasks = [...tasks, task];
    setTasks(newTasks);
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
      setTask("");
    } catch (error) {
      console.log(`Error Adding New Tasks:\n ${error}`);
    }
  };

  const removeTask = async (idx) => {
    const newTasks = tasks.filter((_, i) => i !== idx);
    setTasks(newTasks);
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.log(`Error Removing Task:\n ${error}`);
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: 5,
        },
      ]}
    >
      <Text style={[styles.title, { textAlign: "center" }]}>
        TODO List With Async Storage
      </Text>
      <View style={styles.addTask}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Add New Task"
          value={task}
          onChangeText={setTask}
        />
        <Button title="Add Task" onPress={addTask} color="teal" />
      </View>
      <View style={styles.separator} />
      <FlatList
        data={tasks}
        keyExtractor={(_, idx) => `${idx}`}
        renderItem={({ item, index: idx }) => (
          <View style={styles.listItem}>
            <Text>{item}</Text>
            <Button
              title="Remove"
              onPress={() => removeTask(idx)}
              color="red"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#333",
    marginVertical: 10,
  },
  addTask: {
    marginTop: 10,
    flexDirection: "row",
    rowGap: 5,
    justifyContent: "space-between",
  },
  listItem: {
    flexDirection: "row",
    rowGap: 5,
    justifyContent: "space-between",
    marginVertical: 5,
  },
});
