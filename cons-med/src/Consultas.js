import { Link, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ModalAdicionar from './ModalAdicionar';
import ModalCancelar from './ModalCancelar';
import ModalEditar from './ModalEditar';

function formatarData(stringData) {
    const dt = new Date(stringData);
    return dt.toLocaleDateString('pt-BR');
}

function Consultas() {

    const location = useLocation();
    const { nomeUsuario, ehMedico } = location.state || {};
    const [consultas, setConsultas] = useState([]); // Guarda a lista de consultas
    const [adicionar, setAdicionar] = useState(false); // Indica se a modal de adicionar consulta deve ser exibida
    const [cancelar, setCancelar] = useState(null); // Indica se a modal de cancelamento deve aparecer
    const [editar, setEditar] = useState(null); // Indica se a modal de edição de data e hora deve aparecer

    // Preenche o array de consultas.
    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_DB_HOST || 'localhost'}:${process.env.REACT_APP_SERVER_PORT || 5000}/api/consultas?nomeUsuario=${nomeUsuario}&ehMedicoStr=${ehMedico}`)
            .then(res => res.json())
            .then(dados => setConsultas(dados))
            .catch(err => console.error(err));
    }, []);

    // Atualiza a lista apos um cancelamento
    function posCancelamento(codigo) {
        setConsultas(consultas.filter(c => c.codigo !== codigo));
    };

    // Atualiza a lista após uma edição
    function posEdicao(editada) {
        setConsultas(consultas.map(c => c.codigo === editada.codigo ? editada : c));
    };

    // Redireciona para a página inicial se não houve login bem sucedido.
    if (location.state === null) {
        console.log('Redirecionando para a página inicial');
        return (
            <>
                <Navigate to="/"/>
            </>
        );
    };

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg cabecalho">
                <div className="container-fluid d-flex justify-content-center align-items-center">
                    <Link to="/" type="button" className="btn-acesso btn btn-secondary btn-voltar">
                        Voltar
                    </Link>
                    <h1 className="titulo">{ehMedico ? 'Pacientes ' : 'Consultas '} de {nomeUsuario}</h1>
                    <button type='button'
                        className='btn-acesso btn btn-adicionar'
                        title='Adicionar consulta'
                        onClick={() => setAdicionar(true)}
                    >
                        <img className="icones" src="/images/adicionar.svg" alt='Adicionar consulta' />
                    </button>
                </div>
            </nav>

            <div className='plano-fundo'>
                <table className='table table-info table-striped'>
                    <thead className='table-dark'>
                        <tr>
                            <th scope='col'>Código</th>
                            <th scope='col'>{ehMedico ? "Paciente" : 'Médico'}</th>
                            <th scope='col'>Data</th>
                            <th scope='col'>Hora</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultas.map(c => (<tr key={c.codigo}>
                            <th scope='row'>{c.codigo}</th>
                            {ehMedico ? <td>{c.nome_paciente}</td> : <td>{c.nome_medico}</td>}
                            <td>{formatarData(c.data)}</td>
                            <td>{c.hora.slice(0, 5)}</td>
                            <td>
                                <div className='d-flex flex-row justify-content-start'>
                                    <button type="button" className='btn btn-outline-secondary btn-icone' title='Excluir' onClick={() => setCancelar(c)}>
                                        <img src="/images/lixo.svg" alt="Excluir" className='icones' />
                                    </button>
                                    <button type="button" className='btn btn-outline-secondary btn-icone'
                                    title="Editar" onClick={() => setEditar(c)}>
                                        <img src="/images/editar.svg" alt="Editar" className='icones' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div>
                <ModalAdicionar
                    mostrar={adicionar}
                    nomeUsuario={nomeUsuario}
                    ehMedico={ehMedico}
                    fecharModal={() => setAdicionar(false)}
                    salvarDados={(dados) => {
                        setConsultas([...consultas, dados]);
                        setAdicionar(false);
                    }}
                />
            </div>
            <div>
                <ModalCancelar
                    mostrar={cancelar !== null}
                    consulta={cancelar}
                    fecharModal={() => setCancelar(null)}
                    aoCancelar={() => posCancelamento(cancelar.codigo)}
                />
            </div>
            <div>
                <ModalEditar 
                    mostrar={editar !== null}
                    consulta={editar}
                    fecharModal={() => setEditar(null)}
                    aoEditar={posEdicao}
                />
            </div>

        </div>

    );
}

export default Consultas;