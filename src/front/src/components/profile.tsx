import React from 'react';
import { Card } from './ui/card';

const ProfileComponent = () => {

  const cardContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    alignItems: 'stretch',
    padding: '20px'
  };

  const profilCardStyle: React.CSSProperties = {
    width: "20%",
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'LightSlateGrey ',
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '4px',
    maxHeight: '50vh'
  };

  const infosCardStyle: React.CSSProperties = {
    width: "50%",
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'LightSlateGrey ',
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '4px',
    maxHeight: '50vh'
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr', // Two columns with a 1:2 ratio
    gap: '10px', // Spacing between columns
    padding: '10px', // Add padding for spacing
  };
  
  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '1.2em',
  };
  
  const infoStyle: React.CSSProperties = {
    flex: 1,
  };

  const separatorStyle: React.CSSProperties = {
    borderBottom: '1px solid #ccc',
    margin: '20px 0',
  };

  const matchHistoryCardStyle: React.CSSProperties = {
    width: "80%",
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'LightSlateGrey ',
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '4px',
    maxHeight: '50vh',
  };

  const matchRowStyleWin: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr', // Two columns with a 1:2 ratio
    backgroundColor: 'DarkSeaGreen',
  };

  const matchRowStyleLoose: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr', // Two columns with a 1:2 ratio
    backgroundColor: 'LightCoral',
  };

  return (
    <div>
      <div className="h-full flex items-center justify-center rounded-lg" style={cardContainerStyle}>
          <Card style={profilCardStyle}>
            <img src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg" alt="Profile Image" style={{ maxWidth: "80%", borderRadius: '50%', marginTop: "20px", marginBottom:"10%",margin: '0 auto' }}/>
            <h3 style={{ margin: '0.5em 0', fontSize: '1.5em' }}>Pseudo</h3>
            <p style={{ margin: '0.5em 0', fontSize: '1.5em' }}>Titre 42</p>
            <p style={{ margin: '0.5em 0', fontSize: '1.5em', marginBottom:"10px" }}>Campus 42</p>
          </Card>
          <Card style={infosCardStyle}>
            <div style={infoRowStyle}>
              <div>
                <label style={labelStyle}>Full Name:</label>
              </div>
              <div>
                <span style={infoStyle}>Ellie copter</span>
              </div>
            </div>
            <hr style={separatorStyle} />
            <div style={infoRowStyle}>
              <div>
                <label style={labelStyle}>Email:</label>
              </div>
              <div>
                <span style={infoStyle}>example@example.com</span>
              </div>
            </div>
            <hr style={separatorStyle} />
            <div style={infoRowStyle}>
              <div>
                <label style={labelStyle}>Ranking:</label>
              </div>
              <div>
                <span style={infoStyle}>Top 1</span>
              </div>
            </div>
            <hr style={separatorStyle} />
            <div style={infoRowStyle}>
              <div>
                <label style={labelStyle}>Win ratio:</label>
              </div>
              <div>
                <span style={infoStyle}>90%</span>
              </div>
            </div>
            <hr style={separatorStyle} />
            <div style={infoRowStyle}>
              <div>
                <label style={labelStyle}>Total matches:</label>
              </div>
              <div>
                <span style={infoStyle}>2163</span>
              </div>
            </div>
          </Card>
      </div>
      <div className="h-full flex items-center justify-center rounded-lg" style={cardContainerStyle}>
      <Card style={matchHistoryCardStyle}>
            <div style={matchRowStyleWin}>
              <div>
                <label style={labelStyle}>Match N°175:</label>
              </div>
              <div>
                <span style={infoStyle}>Adversaire Random</span>
              </div>
              <div>
                <span style={infoStyle}>Win</span>
              </div>
            </div>
            <hr style={separatorStyle} />
            <div style={matchRowStyleLoose}>
              <div>
                <label style={labelStyle}>Match N°54:</label>
              </div>
              <div>
                <span style={infoStyle}>Adversaire Random</span>
              </div>
              <div>
                <span style={infoStyle}>Loose</span>
              </div>
            </div>
            <hr style={separatorStyle} />
            <div style={matchRowStyleWin}>
              <div>
                <label style={labelStyle}>Match N°3:</label>
              </div>
              <div>
                <span style={infoStyle}>Adversaire Random</span>
              </div>
              <div>
                <span style={infoStyle}>Win</span>
              </div>
            </div>
            <hr style={separatorStyle} />
            <div style={matchRowStyleWin}>
              <div>
                <label style={labelStyle}>Match N°1:</label>
              </div>
              <div>
                <span style={infoStyle}>Adversaire Random</span>
              </div>
              <div>
                <span style={infoStyle}>Win</span>
              </div>
            </div>
          </Card>
      </div>
    </div>
  );
};

export default ProfileComponent;