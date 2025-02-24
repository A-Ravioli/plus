import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Text, HStack, Pressable } from '@gluestack-ui/themed';
import { useTheme, themeColors } from '../contexts/theme';

export function ColorPicker() {
  const { setCustomColor, customColor } = useTheme();

  return (
    <Box p="$4">
      <Text mb="$2" color="$gray500">Theme Color</Text>
      <HStack space="sm" flexWrap="wrap">
        {Object.entries(themeColors).map(([name, color]) => (
          <Pressable
            key={name}
            onPress={() => setCustomColor(color)}
            mb="$2"
            mr="$2"
          >
            <Box
              width="$8"
              height="$8"
              borderRadius="$full"
              bg={color}
              style={[
                styles.colorOption,
                customColor === color && styles.selected
              ]}
            />
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  colorOption: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '$gray400',
  },
}); 