import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ModalLogin({ mostrar, ehMedico, fecharModal }) {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  if (!mostrar) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim() || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setErro('');

    const rota = modoRegistro ? 'registrar' : 'login';

    fetch(`http://${process.env.REACT_APP_DB_HOST || 'localhost'}:${process.env.REACT_APP_SERVER_PORT || 5000}/api/${rota}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, senha, ehMedico }),
    })
      .then(async res => {
        const dados = await res.json();
        if (!res.ok) throw new Error(dados.error || 'Erro desconhecido');
        return dados;
      })
      .then(usuario => {
        fecharModal();
        // Transfere o usuário para a página de consultas, passando o nome do usuário e se ele é médico ou não.
        navigate('/consultas', { state: { nomeUsuario: usuario.nome, ehMedico: ehMedico } });
      })
      .catch(err => {
        setErro(err.message);
      });
  }

  return (
    <div className="modal show d-block" tabIndex="-1" >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modoRegistro ? 'Criar conta' : 'Entrar'}</h5>
            <button type="button" className="btn-close" onClick={fecharModal}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                />
              </div>

              {erro && <div className="alert alert-danger">{erro}</div>}

              <div className="modal-footer d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setModoRegistro(!modoRegistro)}
                >
                  {modoRegistro ? 'Já tenho conta' : 'Criar novo usuário'}
                </button>
                <button type="submit" className="btn btn-primary">
                  {modoRegistro ? 'Registrar' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalLogin;