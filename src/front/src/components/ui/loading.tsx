import FadeLoader from 'react-spinners/FadeLoader';

const Loading = () => {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FadeLoader color="#5376b5" />
    </div>
  );
};

export default Loading;