//Importações para as rotas funcionarem
import { BrowserRouter, Route, Routes} from 'react-router-dom';
//Importações para as páginas de visitantes
import HomeVisitantes from '../componentes/Visitantes/Home/app';
import Autenticacao from '../componentes/Autenticacao/app';
import QueroAdotar from '../componentes/Visitantes/PaginaDeAdocoes/app';
import Denuncie from '../componentes/Visitantes/PaginaDeDenuncias/app';
import SaudeUnica from '../componentes/Visitantes/PaginaDeSaudeUnica/app';
//Importações para as páginas de administradores
import HomeAdms from '../componentes/Administradores/Home/app';
import FichasDeAnimais from '../componentes/Administradores/PaginaDeAnimais/PaginaPrincipal/app';
import Configuracoes from '../componentes/Administradores/PaginaDeConfiguracoes/PaginaPrincipal/app'
import ProgramarPostagem from '../componentes/Administradores/PaginaDePostagem/app';
import VerMais from '../componentes/Administradores/PaginaDeVerMais/app';

export default function Rotas() {
  return(
    <BrowserRouter>
        <Routes>
            {/*O "path" é uma indicação do que vai aparecer na URL do navegador*/}
            <Route path='/' element={<HomeVisitantes/>}/>
            <Route path='/autenticar' element={<Autenticacao/>}/>
            <Route path='/quero_adotar' element={<QueroAdotar/>}/>
            <Route path='/como_doar' element={<QueroAdotar/>}/>
            <Route path='/denuncie' element={<Denuncie/>}/>
            <Route path='/saude_unica' element={<SaudeUnica/>}/>
            <Route path='/administracao' element={<HomeAdms/>}/>
            <Route path='/fichas_de_animais' element={<FichasDeAnimais/>}/>
            <Route path='/configuracoes' element={<Configuracoes/>}/>
            <Route path='/programar_postagem' element={<ProgramarPostagem/>}/>
            <Route path='/ver_mais/:id' element={<VerMais/>}/>
        </Routes>
    </BrowserRouter>
  );
}

