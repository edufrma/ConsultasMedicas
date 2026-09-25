function ModalCancelar({ mostrar, consulta, fecharModal, aoCancelar }) {
  if (!mostrar) return null;

  function handleConfirmar() {
    fetch(`http://${process.env.REACT_APP_DB_HOST || 'localhost'}:${process.env.REACT_APP_SERVER_PORT || 5000}/api/consultas/${consulta.codigo}/cancelar`, {
      method: 'PATCH',
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao cancelar consulta');
        return res.json();
      })
      .then(() => {
        aoCancelar(consulta.codigo);
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
            <h5 className="modal-title">Cancelar consulta</h5>
            <button type="button" className="btn-close" onClick={fecharModal}></button>
          </div>

          <div className="modal-body">
            <p>Tem certeza que deseja cancelar esta consulta?</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={fecharModal}>
              Não
            </button>
            <button type="button" className="btn btn-danger" onClick={handleConfirmar}>
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCancelar;