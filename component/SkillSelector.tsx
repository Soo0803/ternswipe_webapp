import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb } from '../utils/platform';
import { getFontSize, getPadding, scale } from '../utils/responsive';

// Common skills based on algorithm taxonomy
const COMMON_SKILLS = [
  'python', 'pytorch', 'tensorflow', 'signal processing', 'machine learning',
  'data analysis', 'computer vision', 'nlp', 'graph neural networks', 'gnn',
  'matlab', 'c++', 'latex', 'keras', 'statistics', 'cv', 'sql', 'docker',
  'hadoop', 'spark', 'fastapi', 'flask', 'django', 'react', 'react native',
  'javascript', 'typescript', 'java', 'rust', 'go', 'cuda', 'opencv',
  'autocad', 'solidworks', 'ansys', 'ros', 'kubernetes', 'verilog', 'vhdl',
  'fpga', 'vlsi', 'stm32', 'quant', 'retrieval', 'llm prompting', 'timeseries',
  'forecasting', 'bayesian inference', 'causal inference', 'recsys',
  'lightgbm', 'xgboost', 'scikit-learn', 'edge ai', 'medical imaging',
  'proteomics', 'bioinformatics', 'control theory', 'kalman filter',
  'finite element analysis', 'cfd', '3d printing', 'mediapipe', 'ocr',
  'speech processing', 'computational finance', 'graph mining', 'etl',
  'airflow', 'cloud devops', 'reinforcement learning', 'rl',
];

type SkillSelectorProps = {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
  label?: string;
};

export default function SkillSelector({
  selectedSkills,
  onSkillsChange,
  placeholder = 'Type or select skills...',
  label = 'Skills',
}: SkillSelectorProps) {
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSkills = COMMON_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(searchText.toLowerCase()) &&
      !selectedSkills.includes(skill)
  ).slice(0, 10);

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && skill.trim()) {
      onSkillsChange([...selectedSkills, skill.trim()]);
      setSearchText('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setShowSuggestions(text.length > 0);
  };

  const handleSubmitEditing = () => {
    if (searchText.trim() && !selectedSkills.includes(searchText.trim())) {
      addSkill(searchText.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* Selected skills chips */}
      {selectedSkills.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedSkills.map((skill, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{skill}</Text>
              <TouchableOpacity
                onPress={() => removeSkill(skill)}
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
          placeholder={placeholder}
          value={searchText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmitEditing}
          onFocus={() => setShowSuggestions(searchText.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => addSkill(searchText)}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={24} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSkills.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {filteredSkills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => addSkill(skill)}
              >
                <Text style={styles.suggestionText}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
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
    backgroundColor: '#E3F2FD',
    paddingHorizontal: getPadding(12),
    paddingVertical: getPadding(6),
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: getFontSize(12),
    color: '#1976D2',
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
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: getPadding(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: getFontSize(14),
    color: '#333',
  },
});

