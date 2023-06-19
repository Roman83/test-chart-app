import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home'
import Details from './pages/Details'

let routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/details/:factoryId/:monthId",
    element: <Details />,
  },
]);

function App() {
  return (
    <RouterProvider router={routes} />
  );
}

export default App;
