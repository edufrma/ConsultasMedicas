// Modal com o formulário usado para adicionar novas consultas.

import { useState } from "react";

// mostrar define se a modal deve aparecer ou não
// nomeUsuario é o nome do usuário usando o sistema
// ehMedico indica se o usuário é um médico ou não
// fecharModal é a função que faz com que a modal deixe de ser exibida
// salvarDados é a função que armazena os dados do formulário no banco de dados
function ModalAdicionar({mostrar, nomeUsuario, ehMedico, fecharModal, salvarDados}) {
    const [erro, setErro] = useState(''); // Indica se há algum erro.
    const [cliente, setCliente] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');

    if (!mostrar) return null;

    function handleSubmit(e) {
        e.preventDefault();

        // Verifica se todos os campos foram preenchidos
        if ( !cliente.trim() || !data || !hora) {
            setErro('Por favor, preencha todos os campos');
            return;
        };

        setErro(''); // Apaga erros anteriores

        const nome_medico = ehMedico ? nomeUsuario : cliente;
        const nome_paciente = ehMedico ? cliente : nomeUsuario;

        fetch(`http://${process.env.REACT_APP_DB_HOST || 'localhost'}:${process.env.REACT_APP_SERVER_PORT || 5000}/api/consultas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome_paciente, nome_medico, data, hora, ehMedico }),
        }).then(res => {
            if (!res.ok) throw new Error('Erro ao se comunicar com o banco de dados. A consulta não foi salva.');
            return res.json();
        }).then(novaConsulta => {
            setCliente('');
            setData('');
            setHora('');
            salvarDados(novaConsulta);
            return;
        }).catch(err => {
            console.error(err);
            setErro('Não foi possível salvar a consulta. Tente novamente.');
        });
    };

    return (<div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Nova consulta</h5>
                    <button type="button" className="btn-close" onClick={fecharModal}></button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">{ehMedico ? 'Paciente' : 'Médico'}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={cliente}
                                onChange={e => setCliente(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Data</label>
                            <input
                                type="date"
                                className="form-control"
                                value={data}
                                onChange={e => setData(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Hora</label>
                            <input
                                type="time"
                                className="form-control"
                                value={hora}
                                onChange={e => setHora(e.target.value)}
                            />
                        </div>

                        {erro && <div className="alert alert-danger">{erro}</div>}

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
};

export default ModalAdicionar;