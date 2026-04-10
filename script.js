const sections = [...document.querySelectorAll('.screen')];

const numeroMostruario = document.getElementById('numeroMostruario');
const codigoVendedoraMostruario = document.getElementById('codigoVendedoraMostruario');
const nomeVendedoraMostruario = document.getElementById('nomeVendedoraMostruario');
const dataUltimoAcertoMostruario = document.getElementById('dataUltimoAcertoMostruario');
const dataProximoAcertoMostruario = document.getElementById('dataProximoAcertoMostruario');
const codigoProduto = document.getElementById('codigoProduto');
const descricaoProduto = document.getElementById('descricaoProduto');
const qtdProduto = document.getElementById('qtdProduto');

const btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
const btnSalvarMostruario = document.getElementById('btnSalvarMostruario');
const btnNovoMostruario = document.getElementById('btnNovoMostruario');

const listaProdutosContainer = document.getElementById('listaProdutosContainer');
const mostruarioTabelaBody = document.getElementById('mostruarioTabelaBody');

const filtroMostruario = document.getElementById('filtroMostruario');
const buscaMostruario = document.getElementById('buscaMostruario');
const btnPesquisarMostruario = document.getElementById('btnPesquisarMostruario');

const filtroVendedora = document.getElementById('filtroVendedora');
const buscaVendedora = document.getElementById('buscaVendedora');
const btnPesquisarVendedora = document.getElementById('btnPesquisarVendedora');
const vendedoraTabelaBody = document.getElementById('vendedoraTabelaBody');

const vendedoraCodigo = document.getElementById('vendedoraCodigo');
const vendedoraNome = document.getElementById('vendedoraNome');
const vendedoraCpf = document.getElementById('vendedoraCpf');
const vendedoraEndereco = document.getElementById('vendedoraEndereco');
const vendedoraNumero = document.getElementById('vendedoraNumero');
const vendedoraComplemento = document.getElementById('vendedoraComplemento');
const vendedoraBairro = document.getElementById('vendedoraBairro');
const vendedoraCelular = document.getElementById('vendedoraCelular');
const vendedoraUltimoAcerto = document.getElementById('vendedoraUltimoAcerto');
const vendedoraProximoAcerto = document.getElementById('vendedoraProximoAcerto');
const btnSalvarVendedora = document.getElementById('btnSalvarVendedora');
const btnNovaVendedora = document.getElementById('btnNovaVendedora');

const STORAGE_KEYS = {
  mostruarios: 'wn_mostruarios',
  vendedoras: 'wn_vendedoras'
};

function carregarStorage(chave, fallback = []) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : fallback;
  } catch {
    return fallback;
  }
}

function salvarStorage(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

const state = {
  cadastros: carregarStorage(STORAGE_KEYS.mostruarios, []),
  draft: {
    numero: '',
    codigoVendedora: '',
    vendedora: '',
    ultimoAcerto: '',
    proximoAcerto: '',
    produtos: []
  },
  editandoNumeroOriginal: null
};

const vendedorasState = {
  lista: carregarStorage(STORAGE_KEYS.vendedoras, [
    {
      codigo: '001',
      nome: 'Maria Silva',
      ultimo: '--/--/----',
      proximo: '--/--/----',
      cpf: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      celular: ''
    }
  ]),
  editandoCodigoOriginal: null
};

function persistirMostruarios() {
  salvarStorage(STORAGE_KEYS.mostruarios, state.cadastros);
}

function persistirVendedoras() {
  salvarStorage(STORAGE_KEYS.vendedoras, vendedorasState.lista);
}

function activate(targetId) {
  const screenExiste = document.getElementById(targetId);
  if (!screenExiste) return;

  sections.forEach(section => {
    section.classList.toggle('active', section.id === targetId);
  });

  if (history.replaceState) {
    history.replaceState(null, '', `#${targetId}`);
  }
}

document.addEventListener('click', (e) => {
  const nav = e.target.closest('.nav-btn');
  if (!nav) return;

  const targetId = nav.dataset.target;
  if (!targetId) return;

  e.preventDefault();
  activate(targetId);
});

const initial = location.hash.replace('#', '') || 'home';
activate(document.getElementById(initial) ? initial : 'home');

function aplicarMascaraData(input) {
  if (!input) return;

  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 8);

    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);

    e.target.value = value;
    sincronizarDraftCampos();
  });
}

function aplicarMascaraCpf(input) {
  if (!input) return;

  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 11);

    if (value.length > 3) value = value.slice(0, 3) + '.' + value.slice(3);
    if (value.length > 7) value = value.slice(0, 7) + '.' + value.slice(7);
    if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11);

    e.target.value = value.slice(0, 14);
  });
}

function aplicarMascaraCelular(input) {
  if (!input) return;

  input.addEventListener('input', (e) => {
    const digitos = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatado = '';

    if (digitos.length > 0) formatado = '(' + digitos.slice(0, 2);
    if (digitos.length >= 3) formatado += ') ' + digitos.slice(2, 7);
    if (digitos.length >= 8) formatado += '-' + digitos.slice(7, 11);

    e.target.value = formatado;
  });
}

aplicarMascaraData(dataUltimoAcertoMostruario);
aplicarMascaraData(dataProximoAcertoMostruario);
aplicarMascaraCpf(vendedoraCpf);
aplicarMascaraCelular(vendedoraCelular);

function buscarVendedoraPorCodigo(codigo) {
  return vendedorasState.lista.find(v => v.codigo.toLowerCase() === codigo.toLowerCase());
}

function preencherNomeVendedoraPorCodigo() {
  const codigo = codigoVendedoraMostruario.value.trim();
  const vendedora = buscarVendedoraPorCodigo(codigo);

  if (vendedora) {
    nomeVendedoraMostruario.value = vendedora.nome;
    state.draft.codigoVendedora = vendedora.codigo;
    state.draft.vendedora = vendedora.nome;

    if (!dataUltimoAcertoMostruario.value) {
      dataUltimoAcertoMostruario.value =
        vendedora.ultimo && vendedora.ultimo !== '--/--/----' ? vendedora.ultimo : '';
    }

    if (!dataProximoAcertoMostruario.value) {
      dataProximoAcertoMostruario.value =
        vendedora.proximo && vendedora.proximo !== '--/--/----' ? vendedora.proximo : '';
    }
  } else {
    nomeVendedoraMostruario.value = '';
    state.draft.codigoVendedora = codigo;
    state.draft.vendedora = '';
  }

  sincronizarDraftCampos();
}

function sincronizarDraftCampos() {
  state.draft.numero = numeroMostruario.value.trim();
  state.draft.codigoVendedora = codigoVendedoraMostruario.value.trim();
  state.draft.vendedora = nomeVendedoraMostruario.value.trim();
  state.draft.ultimoAcerto = dataUltimoAcertoMostruario.value.trim();
  state.draft.proximoAcerto = dataProximoAcertoMostruario.value.trim();
}

[numeroMostruario, codigoVendedoraMostruario].forEach(input => {
  input.addEventListener('input', preencherNomeVendedoraPorCodigo);
});

vendedoraCodigo.addEventListener('input', () => {
  const codigo = vendedoraCodigo.value.trim();
  const vendedora = buscarVendedoraPorCodigo(codigo);

  if (vendedora) {
    vendedoraUltimoAcerto.value = vendedora.ultimo || '--/--/----';
    vendedoraProximoAcerto.value = vendedora.proximo || '--/--/----';
  } else {
    vendedoraUltimoAcerto.value = '--/--/----';
    vendedoraProximoAcerto.value = '--/--/----';
  }
});

function limparCamposProduto() {
  codigoProduto.value = '';
  descricaoProduto.value = '';
  qtdProduto.value = '';
  codigoProduto.focus();
}

function adicionarProduto() {
  sincronizarDraftCampos();

  const codigo = codigoProduto.value.trim();
  const descricao = descricaoProduto.value.trim();
  const qtd = qtdProduto.value.trim();

  if (!state.draft.numero) {
    alert('Digite primeiro o número do mostruário.');
    numeroMostruario.focus();
    return;
  }

  if (!state.draft.codigoVendedora || !state.draft.vendedora) {
    alert('Digite um código de vendedora válido.');
    codigoVendedoraMostruario.focus();
    return;
  }

  if (!codigo || !descricao || !qtd) {
    alert('Preencha código, descrição e quantidade do produto.');
    return;
  }

  state.draft.produtos.push({ codigo, descricao, qtd });
  renderListaProdutos();
  limparCamposProduto();
}

qtdProduto.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    adicionarProduto();
  }
});

function renderListaProdutos() {
  if (!state.draft.produtos.length) {
    listaProdutosContainer.innerHTML = `<div class="lista-vazia">Nenhum produto adicionado.</div>`;
    return;
  }

  listaProdutosContainer.innerHTML = state.draft.produtos.map((produto, index) => `
    <div class="lista-item">
      <span class="produto-cod">${produto.codigo}</span>
      <span class="produto-desc">${produto.descricao}</span>
      <span class="produto-qtd">${produto.qtd}</span>
      <div class="produto-acoes">
        <button class="mini-btn" type="button" data-editar-produto="${index}">Editar qtd</button>
        <button class="mini-btn danger" type="button" data-excluir-item="${index}">Excluir</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-excluir-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.excluirItem);
      state.draft.produtos.splice(index, 1);
      renderListaProdutos();
    });
  });

  document.querySelectorAll('[data-editar-produto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.editarProduto);
      const atual = state.draft.produtos[index];
      const novaQtd = prompt('Digite a nova quantidade:', atual.qtd);

      if (novaQtd === null) return;
      if (!novaQtd.trim()) return;

      state.draft.produtos[index].qtd = novaQtd.trim();
      renderListaProdutos();
    });
  });
}

function filtrarCadastros() {
  const filtro = filtroMostruario.value;
  const termo = buscaMostruario.value.trim().toLowerCase();

  if (!termo) return state.cadastros;

  return state.cadastros.filter(item => {
    const numero = (item.numero || '').toLowerCase();
    const codigoVend = (item.codigoVendedora || '').toLowerCase();
    const vendedora = (item.vendedora || '').toLowerCase();
    const ultimoAcerto = (item.ultimoAcerto || '').toLowerCase();
    const proximoAcerto = (item.proximoAcerto || '').toLowerCase();

    if (filtro === 'numero') return numero.includes(termo);
    if (filtro === 'codigoVendedora') return codigoVend.includes(termo);
    if (filtro === 'vendedora') return vendedora.includes(termo);
    if (filtro === 'ultimoAcerto') return ultimoAcerto.includes(termo);
    if (filtro === 'proximoAcerto') return proximoAcerto.includes(termo);

    return (
      numero.includes(termo) ||
      codigoVend.includes(termo) ||
      vendedora.includes(termo) ||
      ultimoAcerto.includes(termo) ||
      proximoAcerto.includes(termo)
    );
  });
}

function renderTabelaMostruarios() {
  const cadastrosFiltrados = filtrarCadastros();

  if (!cadastrosFiltrados.length) {
    mostruarioTabelaBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-table">Nenhum mostruário encontrado</td>
      </tr>
    `;
    return;
  }

  mostruarioTabelaBody.innerHTML = cadastrosFiltrados.map((item) => `
    <tr>
      <td>${item.numero || '--'}</td>
      <td>${item.codigoVendedora || '--'}</td>
      <td>${item.vendedora || '--'}</td>
      <td>${item.produtos.length}</td>
      <td>${item.ultimoAcerto || '--'}</td>
      <td>${item.proximoAcerto || '--'}</td>
      <td class="acoes-cell">
        <button class="mini-btn" type="button" data-editar-mostruario="${item.numero}">Editar</button>
        <button class="mini-btn danger" type="button" data-excluir-mostruario="${item.numero}">Excluir</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('[data-editar-mostruario]').forEach(btn => {
    btn.addEventListener('click', () => {
      const numero = btn.dataset.editarMostruario;
      const item = state.cadastros.find(cadastro => cadastro.numero === numero);
      if (!item) return;

      state.editandoNumeroOriginal = item.numero;
      state.draft = {
        numero: item.numero,
        codigoVendedora: item.codigoVendedora,
        vendedora: item.vendedora,
        ultimoAcerto: item.ultimoAcerto || '',
        proximoAcerto: item.proximoAcerto || '',
        produtos: item.produtos.map(prod => ({ ...prod }))
      };

      preencherFormularioMostruario();
      renderListaProdutos();
      activate('mostruario-incluir');
    });
  });

  document.querySelectorAll('[data-excluir-mostruario]').forEach(btn => {
    btn.addEventListener('click', () => {
      const numero = btn.dataset.excluirMostruario;
      const item = state.cadastros.find(cadastro => cadastro.numero === numero);
      if (!item) return;

      const confirmar = confirm('Deseja excluir este mostruário?');
      if (!confirmar) return;

      state.cadastros = state.cadastros.filter(cadastro => cadastro.numero !== numero);

      if (item.codigoVendedora) {
        const vendedora = vendedorasState.lista.find(v => v.codigo === item.codigoVendedora);
        const restante = state.cadastros
          .filter(c => c.codigoVendedora === item.codigoVendedora)
          .slice(-1)[0];

        if (vendedora) {
          vendedora.ultimo = restante?.ultimoAcerto || '--/--/----';
          vendedora.proximo = restante?.proximoAcerto || '--/--/----';
        }
      }

      persistirMostruarios();
      persistirVendedoras();
      renderTabelaMostruarios();
      renderTabelaVendedoras();
    });
  });
}

function filtrarVendedoras() {
  const termo = buscaVendedora.value.trim().toLowerCase();
  const filtro = filtroVendedora.value;

  return vendedorasState.lista.filter(v => {
    const codigo = (v.codigo || '').toLowerCase();
    const nome = (v.nome || '').toLowerCase();
    const ultimo = (v.ultimo || '').toLowerCase();
    const proximo = (v.proximo || '').toLowerCase();

    if (!termo) return true;
    if (filtro === 'codigo') return codigo.includes(termo);
    if (filtro === 'nome') return nome.includes(termo);
    if (filtro === 'ultimo') return ultimo.includes(termo);
    if (filtro === 'proximo') return proximo.includes(termo);

    return (
      codigo.includes(termo) ||
      nome.includes(termo) ||
      ultimo.includes(termo) ||
      proximo.includes(termo)
    );
  });
}

function renderTabelaVendedoras() {
  const lista = filtrarVendedoras();

  if (!lista.length) {
    vendedoraTabelaBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-table">Nenhuma vendedora encontrada</td>
      </tr>
    `;
    return;
  }

  vendedoraTabelaBody.innerHTML = lista.map(v => `
    <tr>
      <td>${v.codigo}</td>
      <td>${v.nome}</td>
      <td>${v.ultimo || '--/--/----'}</td>
      <td>${v.proximo || '--/--/----'}</td>
      <td class="acoes-cell">
        <button class="mini-btn" type="button" data-editar-vendedora="${v.codigo}">Editar</button>
        <button class="mini-btn danger" type="button" data-excluir-vendedora="${v.codigo}">Excluir</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('[data-editar-vendedora]').forEach(btn => {
    btn.addEventListener('click', () => {
      const codigo = btn.dataset.editarVendedora;
      const item = vendedorasState.lista.find(v => v.codigo === codigo);
      if (!item) return;

      vendedorasState.editandoCodigoOriginal = item.codigo;

      vendedoraCodigo.value = item.codigo || '';
      vendedoraNome.value = item.nome || '';
      vendedoraCpf.value = item.cpf || '';
      vendedoraEndereco.value = item.endereco || '';
      vendedoraNumero.value = item.numero || '';
      vendedoraComplemento.value = item.complemento || '';
      vendedoraBairro.value = item.bairro || '';
      vendedoraCelular.value = item.celular || '';
      vendedoraUltimoAcerto.value = item.ultimo || '--/--/----';
      vendedoraProximoAcerto.value = item.proximo || '--/--/----';

      activate('vendedora-cadastro');
      setTimeout(() => vendedoraCodigo.focus(), 50);
    });
  });

  document.querySelectorAll('[data-excluir-vendedora]').forEach(btn => {
    btn.addEventListener('click', () => {
      const codigo = btn.dataset.excluirVendedora;
      const item = vendedorasState.lista.find(v => v.codigo === codigo);
      if (!item) return;

      const vinculada = state.cadastros.some(m => m.codigoVendedora === codigo);

      let confirmar = false;

      if (vinculada) {
        confirmar = confirm(
          `A vendedora "${item.nome}" está vinculada a mostruários.\n\nAo excluir, o vínculo será removido desses mostruários.\n\nDeseja continuar?`
        );
      } else {
        confirmar = confirm(`Deseja excluir a vendedora "${item.nome}"?`);
      }

      if (!confirmar) return;

      vendedorasState.lista = vendedorasState.lista.filter(v => v.codigo !== codigo);

      state.cadastros = state.cadastros.map(m => {
        if (m.codigoVendedora === codigo) {
          return {
            ...m,
            codigoVendedora: '',
            vendedora: ''
          };
        }
        return m;
      });

      persistirVendedoras();
      persistirMostruarios();
      renderTabelaVendedoras();
      renderTabelaMostruarios();
      limparFormularioVendedora();
    });
  });
}

function preencherFormularioMostruario() {
  numeroMostruario.value = state.draft.numero;
  codigoVendedoraMostruario.value = state.draft.codigoVendedora;
  nomeVendedoraMostruario.value = state.draft.vendedora;
  dataUltimoAcertoMostruario.value = state.draft.ultimoAcerto;
  dataProximoAcertoMostruario.value = state.draft.proximoAcerto;
}

function resetDraft() {
  state.editandoNumeroOriginal = null;
  state.draft = {
    numero: '',
    codigoVendedora: '',
    vendedora: '',
    ultimoAcerto: '',
    proximoAcerto: '',
    produtos: []
  };

  preencherFormularioMostruario();
  limparCamposProduto();
  renderListaProdutos();
}

function limparFormularioVendedora() {
  vendedorasState.editandoCodigoOriginal = null;

  vendedoraCodigo.value = '';
  vendedoraNome.value = '';
  vendedoraCpf.value = '';
  vendedoraEndereco.value = '';
  vendedoraNumero.value = '';
  vendedoraComplemento.value = '';
  vendedoraBairro.value = '';
  vendedoraCelular.value = '';
  vendedoraUltimoAcerto.value = '--/--/----';
  vendedoraProximoAcerto.value = '--/--/----';
}

btnNovaVendedora?.addEventListener('click', limparFormularioVendedora);

btnNovoMostruario.addEventListener('click', () => {
  const temConteudo =
    state.draft.numero ||
    state.draft.codigoVendedora ||
    state.draft.vendedora ||
    state.draft.ultimoAcerto ||
    state.draft.proximoAcerto ||
    state.draft.produtos.length;

  if (temConteudo) {
    const confirmar = confirm('Criar um novo mostruário e limpar a lista atual?');
    if (!confirmar) return;
  }

  resetDraft();
  activate('mostruario-incluir');
});

btnAdicionarProduto.addEventListener('click', adicionarProduto);
btnPesquisarMostruario.addEventListener('click', renderTabelaMostruarios);
filtroMostruario.addEventListener('change', renderTabelaMostruarios);
buscaMostruario.addEventListener('input', renderTabelaMostruarios);

btnPesquisarVendedora.addEventListener('click', renderTabelaVendedoras);
filtroVendedora.addEventListener('change', renderTabelaVendedoras);
buscaVendedora.addEventListener('input', renderTabelaVendedoras);

btnSalvarMostruario.addEventListener('click', () => {
  sincronizarDraftCampos();

  if (!state.draft.numero) {
    alert('Informe o número do mostruário.');
    numeroMostruario.focus();
    return;
  }

  if (!state.draft.codigoVendedora || !state.draft.vendedora) {
    alert('Informe um código de vendedora válido.');
    codigoVendedoraMostruario.focus();
    return;
  }

  const cadastro = {
    numero: state.draft.numero,
    codigoVendedora: state.draft.codigoVendedora,
    vendedora: state.draft.vendedora,
    ultimoAcerto: state.draft.ultimoAcerto,
    proximoAcerto: state.draft.proximoAcerto,
    produtos: state.draft.produtos.map(prod => ({ ...prod }))
  };

  const numeroDuplicado = state.cadastros.some(item =>
    item.numero === cadastro.numero &&
    item.numero !== state.editandoNumeroOriginal
  );

  if (numeroDuplicado) {
    alert('Já existe um mostruário com esse número.');
    numeroMostruario.focus();
    return;
  }

  if (state.editandoNumeroOriginal) {
    const indexExistente = state.cadastros.findIndex(
      item => item.numero === state.editandoNumeroOriginal
    );
    if (indexExistente >= 0) {
      state.cadastros[indexExistente] = cadastro;
    }
  } else {
    state.cadastros.push(cadastro);
  }

  const vendedora = vendedorasState.lista.find(v => v.codigo === cadastro.codigoVendedora);
  if (vendedora) {
    vendedora.ultimo = cadastro.ultimoAcerto || '--/--/----';
    vendedora.proximo = cadastro.proximoAcerto || '--/--/----';
  }

  persistirMostruarios();
  persistirVendedoras();
  renderTabelaMostruarios();
  renderTabelaVendedoras();
  resetDraft();
  activate('mostruario');
});

btnSalvarVendedora.addEventListener('click', () => {
  const codigo = vendedoraCodigo.value.trim();
  const nome = vendedoraNome.value.trim();
  const cpf = vendedoraCpf.value.trim();
  const endereco = vendedoraEndereco.value.trim();
  const numero = vendedoraNumero.value.trim();
  const complemento = vendedoraComplemento.value.trim();
  const bairro = vendedoraBairro.value.trim();
  const celular = vendedoraCelular.value.trim();

  if (!codigo) {
    alert('Informe o código da vendedora.');
    vendedoraCodigo.focus();
    return;
  }

  if (!nome) {
    alert('Informe o nome completo.');
    vendedoraNome.focus();
    return;
  }

  const codigoDuplicado = vendedorasState.lista.some(v =>
    v.codigo === codigo &&
    v.codigo !== vendedorasState.editandoCodigoOriginal
  );

  if (codigoDuplicado) {
    alert('Já existe uma vendedora com esse código.');
    vendedoraCodigo.focus();
    return;
  }

  const novaVendedora = {
    codigo,
    nome,
    ultimo: vendedoraUltimoAcerto.value || '--/--/----',
    proximo: vendedoraProximoAcerto.value || '--/--/----',
    cpf,
    endereco,
    numero,
    complemento,
    bairro,
    celular
  };

  if (vendedorasState.editandoCodigoOriginal) {
    const indexExistente = vendedorasState.lista.findIndex(
      v => v.codigo === vendedorasState.editandoCodigoOriginal
    );
    if (indexExistente >= 0) {
      vendedorasState.lista[indexExistente] = novaVendedora;
    }

    state.cadastros = state.cadastros.map(item => {
      if (item.codigoVendedora === vendedorasState.editandoCodigoOriginal) {
        return {
          ...item,
          codigoVendedora: codigo,
          vendedora: nome,
          ultimoAcerto: novaVendedora.ultimo,
          proximoAcerto: novaVendedora.proximo
        };
      }
      return item;
    });

    persistirMostruarios();
  } else {
    vendedorasState.lista.push(novaVendedora);
  }

  persistirVendedoras();
  renderTabelaVendedoras();
  renderTabelaMostruarios();
  limparFormularioVendedora();
  activate('vendedoras');
});

renderListaProdutos();
renderTabelaMostruarios();
renderTabelaVendedoras();
