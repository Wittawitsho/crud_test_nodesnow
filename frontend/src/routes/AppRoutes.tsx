import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from "../pages/Sign_In/SignIn";
import SignUp from "../pages/Sign_Up/SignUp";
import Tasks from "../pages/Tasks/Tasks";

const AppRoutes = () => {

    const router = createBrowserRouter([
        { path: '/', element:<SignIn />},
        { path: 'signup', element:<SignUp />},
        { path: 'tasks', element:<Tasks />},
    ])
    
      return(
        <RouterProvider router = {router} />
      )
    }
    
    export default AppRoutes