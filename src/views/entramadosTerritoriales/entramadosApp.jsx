import EntramadosContent from './entramadosContent';
import Header from "../../components/Header/Header";
import { Navigate } from "react-router-dom";


const EntramadosApp =({acceso=false}) => {

  if(acceso==false){
    return <Navigate to="/"/>
  }
    return (
      <div className="App">
        <EntramadosContent />
      </div>
    );
  }


export default EntramadosApp;