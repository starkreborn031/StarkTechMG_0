// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import AgendamentoForm from './components/AgendamentoForm';
import ListaAgendamentos from './components/ListaAgendamentos';
import './App.css';  // Adicione esta linha para importar o arquivo de estilo
// frontend/src/App.js

function App() {
  const [agendamentos, setAgendamentos] = useState([]);

  const atualizarAgendamentos = async () => {
    try {
      // Buscar agendamentos do backend
      const response = await fetch('http://localhost:5000/api/agendamentos');
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos do backend:', error);
    }
  };

  useEffect(() => {
    // Atualizar a lista de agendamentos ao iniciar o aplicativo
    atualizarAgendamentos();
  }, []);

  return (
    <div>
      <header>
        <h1>STARK TECH MG - Soluções em Informática</h1>
      </header>
      <main>
        {/* Passar a função de atualização para os componentes */}
        <AgendamentoForm atualizarAgendamentos={atualizarAgendamentos} />
        <ListaAgendamentos agendamentos={agendamentos} atualizarAgendamentos={atualizarAgendamentos} />
      </main>
      <footer>
        <p>&copy; 2024 STARK TECH MG</p>
      </footer>
    </div>
  );
}

export default App;

// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const agendamentoSchema = new mongoose.Schema({
  nomeCliente: String,
  data: String,
  servico: String,
});

const Agendamento = mongoose.model('Agendamento', agendamentoSchema);

mongoose.connect('mongodb://localhost:27017/starktechmg', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/agendamentos', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/agendamentos', async (req, res) => {
  const agendamento = new Agendamento({
    nomeCliente: req.body.nomeCliente,
    data: req.body.data,
    servico: req.body.servico,
  });

  try {
    const novoAgendamento = await agendamento.save();
    res.status(201).json(novoAgendamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/agendamentos/:id', async (req, res) => {
  const idAgendamento = req.params.id;

  try {
    await Agendamento.findByIdAndRemove(idAgendamento);
    res.json({ message: 'Agendamento excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/agendamentos/:id', async (req, res) => {
  const idAgendamento = req.params.id;

  try {
    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(idAgendamento, {
      nomeCliente: req.body.nomeCliente,
      data: req.body.data,
      servico: req.body.servico,
    }, { new: true });

    res.json(agendamentoAtualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
