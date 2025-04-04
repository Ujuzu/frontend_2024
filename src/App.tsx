import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
