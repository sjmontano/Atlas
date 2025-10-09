import CreditsContent from './CreditsContent';
import './Credits.css';
import { Navigate } from "react-router-dom";

const CreditsApp = ({acceso=false}) => {

  if(acceso==false){
    return <Navigate to="/"/>
  }
    return (
      <CreditsContent />
    );
  
  }


export default CreditsApp;