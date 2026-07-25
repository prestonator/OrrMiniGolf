import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGLTF } from "@react-three/drei";
import { router } from "./routes";

// Preload 3D asset at module scope
useGLTF.preload("/homestead-final-transformed.glb");

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
