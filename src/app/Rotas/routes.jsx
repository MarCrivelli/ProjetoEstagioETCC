//Importações para as rotas funcionarem
import { BrowserRouter, Route, Routes} from 'react-router-dom';
//Importações para as páginas de visitantes
import Main from '../componentes/MainVisitantes/app';
import Autenticacao from '../componentes/Autenticacao/app';
import QueroAdotar from '../componentes/QueroAdotar/app';
import Denuncie from '../componentes/Denuncie/app';
import SaudeUnica from '../componentes/SaudeUnica/app';
//Importações para as páginas de administradores
import MainAdms from '../componentes/MainAdms/app';

export default function Rotas() {
  return(
    <BrowserRouter>
        <Routes>
            {/*O "path" é do que uma indicação do que vai aparecer na URL do navegador*/}
            <Route path='/' element={<Main/>}/>
            <Route path='/autenticar' element={<Autenticacao/>}/>
            <Route path='/quero_adotar' element={<QueroAdotar/>}/>
            <Route path='/como_doar' element={<QueroAdotar/>}/>
            <Route path='/denuncie' element={<Denuncie/>}/>
            <Route path='/saude_unica' element={<SaudeUnica/>}/>
            <Route path='/administracao' element={<MainAdms/>}/>
        </Routes>
    </BrowserRouter>
  );
}

