import React, { useState, useRef } from 'react';
import { StyleSheet, Animated, View, TextInput, ScrollView as RNScrollView } from 'react-native';
import {
  ScrollView,
  VStack,
  Text,
  Box,
  Button,
  Icon,
  Pressable,
} from '@gluestack-ui/themed';
import { Plus, Palette } from 'lucide-react-native';
import { useJournal } from '../../contexts/journal';
import { useTheme } from '../../contexts/theme';
import { ColorPicker } from '../../components/ColorPicker';

// Theme tokens
const colors = {
  light: {
    primary: '$primary500',
    background: '$gray100',
    surface: '$white',
    text: '$gray800',
    textSecondary: '$gray500',
    border: '$gray300',
  },
  dark: {
    primary: '$primary600',
    background: '$gray800',
    surface: '$gray900',
    text: '$gray100',
    textSecondary: '$gray400',
    border: '$gray700',
  },
};

interface PointPopupProps {
  points: number;
  position: { x: number; y: number };
  onComplete: () => void;
}

const PointPopup = ({ points, position, onComplete }: PointPopupProps) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => onComplete());
  }, []);

  return (
    <Animated.View
      style={[
        styles.pointPopup,
        {
          transform: [{ translateY }],
          opacity,
          left: position.x,
          top: position.y,
        },
      ]}
    >
      <Text color="$success700" fontWeight="$bold">+{points}</Text>
    </Animated.View>
  );
};

export default function JournalScreen() {
  const [entries, setEntries] = useState<string[]>(['']);
  const [pointPopups, setPointPopups] = useState<Array<{ id: number; points: number; position: { x: number; y: number } }>>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { postJournal, calculatePoints } = useJournal();
  const { colors } = useTheme();
  const scrollViewRef = useRef<RNScrollView>(null);
  let popupId = 0;

  const showPointPopup = (points: number, position: { x: number; y: number }) => {
    const id = popupId++;
    setPointPopups(current => [...current, { id, points, position }]);
  };

  const removePointPopup = (id: number) => {
    setPointPopups(current => current.filter(popup => popup.id !== id));
  };

  const addEntry = () => {
    setEntries(current => [...current, '']);
    // Show +10 points animation for new entry
    showPointPopup(10, { x: 20, y: entries.length * 60 + 100 });
    
    // Scroll to the new entry
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const updateEntry = (text: string, index: number) => {
    const newEntries = [...entries];
    newEntries[index] = text;
    setEntries(newEntries);

    // Show quality points animation when entry is completed
    if (text.trim().length > 0) {
      const words = text.trim().split(/\s+/).length;
      const qualityPoints = Math.min(Math.floor(words / 3), 10);
      if (qualityPoints > 0) {
        showPointPopup(qualityPoints, { x: 20, y: index * 60 + 100 });
      }
    }
  };

  return (
    <Box flex={1} bg={colors.background}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {showColorPicker && <ColorPicker />}
        
        <VStack space="lg" width="$full">
          {entries.map((entry, index) => (
            <Box
              key={index}
              style={[
                styles.entryContainer,
                {
                  borderLeftColor: colors.primary,
                  marginLeft: 20,
                }
              ]}
            >
              <Box
                style={[
                  styles.dot,
                  {
                    backgroundColor: colors.primary,
                    left: -6,
                  }
                ]}
              />
              <Text
                color={colors.text}
                style={styles.dateText}
              >
                {index === 0 ? new Date().toLocaleDateString() : ''}
              </Text>
              <Box
                borderRadius="$md"
                borderWidth={1}
                borderColor={colors.border}
                p="$2"
                bg={colors.surface}
              >
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text }
                  ]}
                  multiline
                  placeholder="What are you grateful for?"
                  placeholderTextColor={colors.textSecondary}
                  value={entry}
                  onChangeText={(text) => updateEntry(text, index)}
                />
              </Box>
            </Box>
          ))}
        </VStack>

        {pointPopups.map(popup => (
          <PointPopup
            key={popup.id}
            points={popup.points}
            position={popup.position}
            onComplete={() => removePointPopup(popup.id)}
          />
        ))}
      </ScrollView>

      <Box position="absolute" bottom="$4" right="$4">
        <VStack space="sm">
          <Button
            size="lg"
            rounded="$full"
            width="$12"
            height="$12"
            onPress={() => setShowColorPicker(!showColorPicker)}
            bg={colors.primary}
            opacity={0.8}
          >
            <Icon as={Palette} color="$white" />
          </Button>

          <Button
            size="lg"
            rounded="$full"
            width="$12"
            height="$12"
            onPress={addEntry}
            bg={colors.primary}
          >
            <Icon as={Plus} color="$white" />
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  entryContainer: {
    borderLeftWidth: 2,
    paddingLeft: 20,
    paddingVertical: 10,
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 10,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  input: {
    fontSize: 16,
    padding: 0,
    minHeight: 40,
  },
  pointPopup: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 