import LoginForm from "./ui";

export default function LoginPage() {
  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Login</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Sign in to access the intake form or admin dashboard.
      </p>
      <LoginForm />
    </main>
  );
}
