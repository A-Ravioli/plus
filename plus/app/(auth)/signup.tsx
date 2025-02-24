import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  VStack,
  Text,
  Center,
  Heading,
  Toast,
  useToast,
} from '@gluestack-ui/themed';
import { useAuth } from '../../contexts/auth';
import debounce from 'lodash/debounce';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const { signUp, checkUsernameAvailable } = useAuth();
  const toast = useToast();

  // Debounced username availability check
  const checkUsername = debounce(async (username: string) => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      return;
    }

    try {
      const isAvailable = await checkUsernameAvailable(username);
      if (!isAvailable) {
        setUsernameError('Username is already taken');
      } else {
        setUsernameError('');
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  }, 500);

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    checkUsername(text);
  };

  const handleSignup = async () => {
    if (usernameError) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="solid">
            <ButtonText>Please fix the username errors before continuing</ButtonText>
          </Toast>
        ),
      });
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, username);
      // After successful signup, redirect to contact import
      router.replace('/contact-import');
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="solid">
            <ButtonText>{error.message || 'Failed to create account'}</ButtonText>
          </Toast>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flex={1} padding="$4">
      <VStack space="md" width="$full" maxWidth="$96">
        <Heading size="2xl" marginBottom="$4">Create Account</Heading>
        
        <FormControl isInvalid={!!usernameError}>
          <FormControlLabel>
            <FormControlLabelText>Username</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Choose a username"
              value={username}
              onChangeText={handleUsernameChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Input>
          {usernameError && (
            <FormControlError>
              <FormControlErrorText>{usernameError}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Input>
        </FormControl>

        <Button
          size="lg"
          onPress={handleSignup}
          isDisabled={loading || !username || !email || !password || !!usernameError}
        >
          <ButtonText>{loading ? 'Creating Account...' : 'Create Account'}</ButtonText>
        </Button>

        <Center>
          <Text>Already have an account?</Text>
          <Button
            variant="link"
            onPress={() => router.push('/login')}
          >
            <ButtonText>Sign In</ButtonText>
          </Button>
        </Center>
      </VStack>
    </Center>
  );
} 