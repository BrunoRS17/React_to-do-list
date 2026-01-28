import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tarefa, setTarefa] = useState("");
  const [busca, setBusca] = useState("");
  const [dataPrazo, setDataPrazo] = useState("");

  //Lendo tarefas pendentes
  const [pendentes, setPendentes] = useState(() => {
    const dados = localStorage.getItem("tarefasPendentes");
    return dados ? JSON.parse(dados) : [];
  });

  //lendo tarefas concluídas
  const [concluidas, setConcluidas] = useState(() => {
    const dados = localStorage.getItem("tarefasConcluidas");
    return dados ? JSON.parse(dados) : [];
  });

  //salvar nova tarefa em pendentes
  useEffect(() => {
    localStorage.setItem("tarefasPendentes", JSON.stringify(pendentes));
  }, [pendentes]);

  //salvar nova tarefa em Concluídas
  useEffect(() => {
    localStorage.setItem("tarefasConcluidas", JSON.stringify(concluidas));
  }, [concluidas]);

  //Salvar uma tarefa
  const salvar = (evento) => {
    evento.preventDefault();

    setPendentes([
      ...pendentes,
      {
        id: crypto.randomUUID(),
        tarefa,
        prazo: dataPrazo,
      },
    ]);

    setTarefa("");
    setDataPrazo("");
  };

  //Para quando tarefa for concluída
  const concluirTarefa = (index) => {
    const tarefaConcluida = pendentes.find((item) => item.id == index);
    const novaPendentes = pendentes.filter((item) => item.id !== index);

    setPendentes(novaPendentes);
    setConcluidas([
      ...concluidas,
      {
        ...tarefaConcluida,
        data: new Date().toISOString(),
      },
    ]);
  };

  const concluidasFIltradas = concluidas.filter((item) =>
    item.tarefa.toLowerCase().includes(busca.toLocaleLowerCase()),
  );

  return (
    <div className="main">
      <div className="card-container">
        {/*Card de Pendentes */}
        <div className="card">
          <h2 className="titulo">Minhas Tarefas</h2>

          
          <form className="formulario" onSubmit={salvar}>
            <textarea
              className="input-tarefa" 
              value={tarefa}
              onChange={(e) => setTarefa(e.target.value)}
              placeholder="O que precisa ser feito?"
              required
              rows="2"
            />

            <div className="controles-form">
              <input
                type="date"
                value={dataPrazo}
                onChange={(e) => setDataPrazo(e.target.value)}
              />
              <button type="submit">Adicionar</button>
            </div>
          </form>
          <ul className="listaTarefas">


            {pendentes.map((item) => (
              <li
                key={item.id}
                className="tarefa-item"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    onChange={() => concluirTarefa(item.id)}
                    style={{ marginRight: "20px" }}
                  />
                  <span>{item.tarefa}</span>
                </div>



                {/* Exibição do prazo */}
                {item.prazo && (
                  <small className="tarefa-data" style={{ marginLeft: "10px" }}>
                    Prazo:{" "}
                    {new Date(item.prazo).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </small>
                )}
              </li>
            ))}
          </ul>
        </div>



        {/*Card de tarefas concluídas*/}
        <div className="card">
          <h2 className="titulo">Concluídas</h2>
          <div className="busca-container">
            <input
              type="text"
              placeholder="Buscar tarefa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="busca"
            />
          </div>

          <ul className="listaTarefas">
            {concluidasFIltradas.map((item) => (
              <li key={item.id} className="tarefa-concluida">
                <span className="tarefa-texto">{item.tarefa}</span>
                <small className="tarefa-data">
                  {new Date(item.data).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
