import Container from '@icapitalnetwork/supernova-core/Container';
import Dashboard from './modules/Dashboard';

const App = () => {

  return (
    <Container sx={{ paddingTop: 2 }}>
      <Dashboard />
    </Container>
  );
};

export default App;
