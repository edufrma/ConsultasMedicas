import { useState } from "react";

function ModalEditar({ mostrar, consulta, fecharModal, aoEditar }) {

  const [nova_data, setData] = useState('');
  const [nova_hora, setHora] = useState('');
  const [erro, setErro] = useState('');

  if (!mostrar) return null;

  function handleSubmit(e) {
    e.preventDefault();

    // Verifica se todos os campos foram preenchidos
    if (!nova_data || !nova_hora) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setErro('');

    fetch(`http://${process.env.REACT_APP_DB_HOST || 'localhost'}:${process.env.REACT_APP_SERVER_PORT || 5000}/api/consultas/${consulta.codigo}/editar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nova_data, nova_hora }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao editar consulta');
        return res.json();
      })
      .then((novaConsulta) => {
        aoEditar(novaConsulta);
        fecharModal();
      })
      .catch(err => {
        console.error(err);
        fecharModal();
      });
  }

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modificar data e hora</h5>
            <button type="button" className="btn-close" onClick={fecharModal}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={nova_data}
                  onChange={e => setData(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  value={nova_hora}
                  onChange={e => setHora(e.target.value)}
                />
              </div>
            </form>
          </div>

          {erro && <div className="alert alert-danger">{erro}</div>}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={fecharModal}>
              Voltar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleSubmit}>
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEditar;