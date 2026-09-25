import { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalLogin from './ModalLogin';

function HomePage() {
    const [acessoMedico, setAcessoMedico] = useState(false);
    const [acessoPaciente, setAcessoPaciente] = useState(false);

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg cabecalho">
                <div className="container-fluid d-flex justify-content-center align-items-center">
                    <h1 className="titulo">Sistema de gerenciamento de consultas</h1>
                </div>
            </nav>

            <div className='plano-fundo'>
                <div className="d-flex justify-content-around align-items-center">
                    <img src="/images/medico.svg" className="img-acesso" alt="Acesso médico" />
                    <img src="/images/paciente.svg" className="img-acesso" alt="Acesso paciente" />
                </div>
                <div className="d-flex justify-content-around align-items-center">
                    <button type="button"
                        className="btn-acesso btn btn-secondary btn-lg"
                        onClick={() => setAcessoMedico(true)}
                    >
                        Acessar como médico
                    </button>
                    <button type="button"
                        className="btn-acesso btn btn-secondary btn-lg"
                        onClick={() => setAcessoPaciente(true)}
                    >
                        Acessar como paciente
                    </button>
                </div>
            </div>

            <ModalLogin mostrar={acessoMedico} ehMedico={true} fecharModal={() => setAcessoMedico(false)}/>
            <ModalLogin mostrar={acessoPaciente} ehMedico={false} fecharModal={() => setAcessoPaciente(false)}/>
        </div>

    );
}

export default HomePage;