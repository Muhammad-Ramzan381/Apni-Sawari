import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn, signUp } from "../../src/services/auth";
import { getUser, createUser } from "../../src/services/users";
import { useAuthStore } from "../../src/stores/authStore";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setUser = useAuthStore((s) => s.setUser);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (isSignUp && !name) {
      setError("Please enter your name");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let firebaseUser;

      if (isSignUp) {
        firebaseUser = await signUp(email, password, name);

        // Create user in Firestore → go to role selection
        router.replace({
          pathname: "/(auth)/role-select",
          params: { uid: firebaseUser.uid, name, email },
        });
      } else {
        firebaseUser = await signIn(email, password);

        // Check if user exists in Firestore
        const appUser = await getUser(firebaseUser.uid).catch(() => null);

        if (appUser) {
          setUser(appUser);
          if (appUser.activeRole === "driver") {
            router.replace("/(driver)/home");
          } else {
            router.replace("/(rider)/home");
          }
        } else {
          // User exists in Auth but not Firestore, go to role selection
          router.replace({
            pathname: "/(auth)/role-select",
            params: {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "",
              email,
            },
          });
        }
      }
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      if (msg.includes("email-already-in-use")) {
        setError("This email is already registered. Try signing in.");
      } else if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Incorrect email or password.");
      } else if (msg.includes("user-not-found")) {
        setError("No account found. Try signing up.");
      } else if (msg.includes("weak-password")) {
        setError("Password should be at least 6 characters.");
      } else if (msg.includes("invalid-email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-8 pt-16">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>
          <Text className="text-base text-gray-500 mb-8">
            {isSignUp
              ? "Sign up to start riding"
              : "Sign in to continue"}
          </Text>

          {isSignUp ? (
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError("");
              }}
              autoCapitalize="words"
            />
          ) : null}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            secureTextEntry
          />

          {error ? (
            <Text className="text-danger text-sm mb-4">{error}</Text>
          ) : null}

          <View className="mt-2">
            <Button
              title={isSignUp ? "Sign Up" : "Sign In"}
              onPress={handleSubmit}
              loading={loading}
              disabled={!email || !password || (isSignUp && !name)}
              size="lg"
              fullWidth
            />
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
            </Text>
            <Text
              className="text-primary-600 font-semibold"
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
