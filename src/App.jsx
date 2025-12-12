import "./App.css";
import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Bot from "./components/chat-bot/Bot.jsx";
import LanguagePopup from './components/common/LanguagePopup.jsx';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <LanguagePopup />
      <Bot />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#74C7F2",
              secondary: "#fff",
            },
          },
          error: {
            duration: 3000,
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
