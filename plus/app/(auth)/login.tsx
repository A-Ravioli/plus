import React, { useState } from 'react';
import { Link, router } from 'expo-router';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action="error" variant="solid">
              <ButtonText>{error.message || 'Failed to sign in'}</ButtonText>
            </Toast>
          );
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flex={1} padding="$4">
      <VStack space="md" width="$full" maxWidth="$96">
        <Heading size="2xl" marginBottom="$4">Welcome Back</Heading>
        
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Input>
        </FormControl>

        <Button
          onPress={handleLogin}
          size="lg"
          isDisabled={loading || !email || !password}
        >
          <ButtonText>{loading ? 'Signing in...' : 'Sign In'}</ButtonText>
        </Button>

        <Center>
          <Text>Don't have an account?</Text>
          <Link href="/signup">
            <Text color="$primary600">Sign Up</Text>
          </Link>
        </Center>
      </VStack>
    </Center>
  );
} 