import { RoutesComponent } from "./routes";
import { Toaster } from "./components/ui/sonner";

export function App() {
  return (
    <>
      <RoutesComponent />
      <Toaster richColors />
    </>
  );
}

export default App;
