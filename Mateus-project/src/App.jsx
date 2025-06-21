import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://jkjekqoxj6.execute-api.us-east-1.amazonaws.com/Mateus/items";

function App() {
  const [items, setItems] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editMode, setEditMode] = useState(false);

  // 🔄 Carregar os dados
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ➕ Adicionar
  const handleAdd = async () => {
    if (!nome) return alert("Nome é obrigatório!");

    const novoItem = {
      id: nome,
      telefone: telefone || "Não informado",
    };

    try {
      await axios.post(API_URL, novoItem);
      setNome("");
      setTelefone("");
      fetchItems();
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  };

  // ✏️ Atualizar
  const handleUpdate = async () => {
    if (!nome) return alert("Nome é obrigatório!");

    const itemAtualizado = {
      id: nome,
      telefone: telefone || "Não informado",
    };

    try {
      await axios.put(API_URL, itemAtualizado);
      setNome("");
      setTelefone("");
      setEditMode(false);
      fetchItems();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  // ❌ Deletar
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar. Verifique se a API está configurada corretamente.");
    }
  };

  // 🖊️ Preparar edição
  const startEdit = (item) => {
    setNome(item.id);
    setTelefone(item.telefone);
    setEditMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6">Avaliação de Sistemas Distribuídos</h1>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md mb-8">
        <h2 className="text-2xl mb-4 font-semibold">
          {editMode ? "Editar Pessoa" : "Adicionar Pessoa"}
        </h2>
        <input
          type="text"
          placeholder="Nome"
          className="border w-full mb-3 p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={editMode} // desabilita edição do nome no modo editar
        />
        <input
          type="text"
          placeholder="Telefone"
          className="border w-full mb-3 p-2 rounded"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        {editMode ? (
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
            >
              Atualizar
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setNome("");
                setTelefone("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Adicionar
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl mb-4 font-semibold">Lista de Pessoas</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">Nenhum registro encontrado.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-semibold">{item.id}</p>
                  <p className="text-sm text-gray-600">
                    Telefone: {item.telefone || "Não informado"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
