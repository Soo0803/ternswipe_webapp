import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFontSize, getPadding } from '../utils/responsive';

type CourseInputProps = {
  courses: string[];
  onCoursesChange: (courses: string[]) => void;
  label?: string;
};

export default function CourseInput({
  courses,
  onCoursesChange,
  label = 'Courses',
}: CourseInputProps) {
  const [courseText, setCourseText] = useState('');

  const addCourse = () => {
    if (courseText.trim() && !courses.includes(courseText.trim())) {
      onCoursesChange([...courses, courseText.trim()]);
      setCourseText('');
    }
  };

  const removeCourse = (courseToRemove: string) => {
    onCoursesChange(courses.filter((course) => course !== courseToRemove));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* Course chips */}
      {courses.length > 0 && (
        <View style={styles.chipsContainer}>
          {courses.map((course, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{course}</Text>
              <TouchableOpacity
                onPress={() => removeCourse(course)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Input field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g., Linear Algebra, Machine Learning"
          value={courseText}
          onChangeText={setCourseText}
          onSubmitEditing={addCourse}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={addCourse}
          style={styles.addButton}
          disabled={!courseText.trim()}
        >
          <Ionicons
            name="add-circle"
            size={24}
            color={courseText.trim() ? '#4A90E2' : '#ccc'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: getPadding(16),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    marginBottom: getPadding(8),
    color: '#333',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: getPadding(8),
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: getPadding(12),
    paddingVertical: getPadding(6),
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: getFontSize(12),
    color: '#7B1FA2',
    marginRight: 4,
  },
  removeButton: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: getPadding(12),
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    fontSize: getFontSize(14),
    paddingVertical: getPadding(10),
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
});

