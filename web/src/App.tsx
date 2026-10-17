import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ThemeProvider } from './theme';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  );
}
