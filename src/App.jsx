import Toaster from "./components/common/Toaster";
import { useCurrentUser } from "./hooks/useCurrentUser";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useCurrentUser();

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
