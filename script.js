/* ================= NAVEGAÇÃO ================= */
const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('.nav-btn');

function showScreen(targetId){
  screens.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(targetId);
  if(target) target.classList.add('active');
}

navButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = btn.dataset.target;
    if(target) showScreen(target);
  });
});

/* ================= STORAGE ================= */
const STORAGE = {
  produtos: 'wn_produtos',
  vendedoras: 'wn_vendedoras',
  mostruarios: 'wn_mostruarios'
};

function getData(key, fallback=[]){
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setData(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

/* ================= STATES ================= */
let produtos = getData(STORAGE.produtos, []);
let vendedoras = getData(STORAGE.vendedoras, []);
let mostruarios = getData(STORAGE.mostruarios, []);

/* ================= AUTO NEXT ================= */
document.querySelectorAll('[data-auto-next="true"]').forEach(input=>{
  input.addEventListener('input', ()=>{
    const max = input.dataset.nextLength;
    if(max && input.value.length >= max){
      focusNext(input);
    }
  });

  input.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      focusNext(input);
    }
  });
});

function focusNext(el){
  const inputs = [...document.querySelectorAll('[data-auto-next="true"]')];
  const i = inputs.indexOf(el);
  if(inputs[i+1]) inputs[i+1].focus();
}

/* ================= PRODUTOS ================= */
const produtoCodigo = document.getElementById('produtoCodigo');
const produtoDescricao = document.getElementById('produtoDescricao');
const produtoTipo = document.getElementById('produtoTipo');
const produtoPreco = document.getElementById('produtoPreco');
const produtoData = document.getElementById('produtoData');
const btnSalvarProduto = document.getElementById('btnSalvarProduto');
const produtoTabelaBody = document.getElementById('produtoTabelaBody');

function hoje(){
  const d = new Date();
  return d.toLocaleDateString('pt-BR');
}

function renderProdutos(){
  if(!produtoTabelaBody) return;

  if(!produtos.length){
    produtoTabelaBody.innerHTML = `<tr><td colspan="6" class="empty-table">Nenhum produto cadastrado</td></tr>`;
    return;
  }

  produtoTabelaBody.innerHTML = produtos.map((p,i)=>`
    <tr>
      <td>${p.codigo}</td>
      <td>${p.descricao}</td>
      <td>${p.tipo}</td>
      <td>R$ ${p.preco}</td>
      <td>${p.data}</td>
      <td class="acoes-cell">
        <button class="mini-btn" onclick="editarProduto(${i})">Editar</button>
        <button class="mini-btn danger" onclick="excluirProduto(${i})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function editarProduto(i){
  const p = produtos[i];
  produtoCodigo.value = p.codigo;
  produtoDescricao.value = p.descricao;
  produtoTipo.value = p.tipo;
  produtoPreco.value = p.preco;
  produtoData.value = p.data;
  showScreen('produto-cadastro');
}

function excluirProduto(i){
  if(confirm('Excluir produto?')){
    produtos.splice(i,1);
    setData(STORAGE.produtos, produtos);
    renderProdutos();
  }
}

if(btnSalvarProduto){
  btnSalvarProduto.onclick = ()=>{
    const novo = {
      codigo: produtoCodigo.value,
      descricao: produtoDescricao.value,
      tipo: produtoTipo.value,
      preco: produtoPreco.value,
      data: hoje()
    };

    const index = produtos.findIndex(p=>p.codigo === novo.codigo);
    if(index >= 0){
      produtos[index] = novo;
    }else{
      produtos.push(novo);
    }

    setData(STORAGE.produtos, produtos);
    renderProdutos();
    showScreen('estoque');
  };
}

/* ================= VENDEDORAS ================= */
const vendedoraCodigo = document.getElementById('vendedoraCodigo');
const vendedoraNome = document.getElementById('vendedoraNome');
const vendedoraUltimo = document.getElementById('vendedoraUltimoAcerto');
const vendedoraProximo = document.getElementById('vendedoraProximoAcerto');
const vendedoraTabelaBody = document.getElementById('vendedoraTabelaBody');
const btnSalvarVendedora = document.getElementById('btnSalvarVendedora');

function renderVendedoras(){
  if(!vendedoraTabelaBody) return;

  if(!vendedoras.length){
    vendedoraTabelaBody.innerHTML = `<tr><td colspan="5" class="empty-table">Nenhuma vendedora</td></tr>`;
    return;
  }

  vendedoraTabelaBody.innerHTML = vendedoras.map((v,i)=>`
    <tr>
      <td>${v.codigo}</td>
      <td>${v.nome}</td>
      <td>${v.ultimo || '--'}</td>
      <td>${v.proximo || '--'}</td>
      <td class="acoes-cell">
        <button class="mini-btn" onclick="editarVendedora(${i})">Editar</button>
        <button class="mini-btn danger" onclick="excluirVendedora(${i})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function editarVendedora(i){
  const v = vendedoras[i];
  vendedoraCodigo.value = v.codigo;
  vendedoraNome.value = v.nome;
  showScreen('vendedora-cadastro');
}

function excluirVendedora(i){
  if(confirm('Excluir?')){
    vendedoras.splice(i,1);
    setData(STORAGE.vendedoras, vendedoras);
    renderVendedoras();
  }
}

if(btnSalvarVendedora){
  btnSalvarVendedora.onclick = ()=>{
    const novo = {
      codigo: vendedoraCodigo.value,
      nome: vendedoraNome.value,
      ultimo: vendedoraUltimo?.value || '--',
      proximo: vendedoraProximo?.value || '--'
    };

    const index = vendedoras.findIndex(v=>v.codigo === novo.codigo);
    if(index >= 0){
      vendedoras[index] = {...vendedoras[index], ...novo};
    }else{
      vendedoras.push(novo);
    }

    setData(STORAGE.vendedoras, vendedoras);
    renderVendedoras();
    showScreen('vendedoras');
  };
}

/* ================= MOSTRUÁRIO ================= */
const codigoProduto = document.getElementById('codigoProduto');
const descricaoProduto = document.getElementById('descricaoProduto');
const precoProdutoMostruario = document.getElementById('precoProdutoMostruario');
const qtdProduto = document.getElementById('qtdProduto');
const listaProdutosContainer = document.getElementById('listaProdutosContainer');
const totalMostruarioValor = document.getElementById('totalMostruarioValor');
const btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
const btnSalvarMostruario = document.getElementById('btnSalvarMostruario');

let draftProdutos = [];

codigoProduto?.addEventListener('input', ()=>{
  const p = produtos.find(x=>x.codigo === codigoProduto.value);
  if(p){
    descricaoProduto.value = p.descricao;
    precoProdutoMostruario.value = p.preco;
  }
});

function renderLista(){
  if(!listaProdutosContainer) return;

  if(!draftProdutos.length){
    listaProdutosContainer.innerHTML = `<div class="lista-vazia">Nenhum produto</div>`;
    totalMostruarioValor.innerText = 'R$ 0,00';
    return;
  }

  let total = 0;

  listaProdutosContainer.innerHTML = draftProdutos.map((p,i)=>{
    total += p.qtd * p.preco;
    return `
      <div class="lista-item">
        <span>${p.codigo}</span>
        <span>${p.descricao}</span>
        <span>${p.qtd}</span>
        <span>R$ ${p.preco}</span>
        <div class="produto-acoes">
          <button class="mini-btn danger" onclick="removerItem(${i})">Excluir</button>
        </div>
      </div>
    `;
  }).join('');

  totalMostruarioValor.innerText = 'R$ ' + total.toFixed(2);
}

function removerItem(i){
  draftProdutos.splice(i,1);
  renderLista();
}

btnAdicionarProduto?.addEventListener('click', ()=>{
  const p = produtos.find(x=>x.codigo === codigoProduto.value);
  if(!p) return alert('Produto não encontrado');

  draftProdutos.push({
    codigo: p.codigo,
    descricao: p.descricao,
    preco: Number(p.preco),
    qtd: Number(qtdProduto.value)
  });

  codigoProduto.value = '';
  descricaoProduto.value = '';
  qtdProduto.value = '';
  renderLista();
});

btnSalvarMostruario?.addEventListener('click', ()=>{
  const numero = document.getElementById('numeroMostruario').value;
  const codigoVend = document.getElementById('codigoVendedoraMostruario').value;

  const total = draftProdutos.reduce((s,p)=>s+(p.qtd*p.preco),0);

  mostruarios.push({
    numero,
    codigoVend,
    produtos: draftProdutos,
    total
  });

  setData(STORAGE.mostruarios, mostruarios);
  draftProdutos = [];
  renderLista();
  showScreen('mostruario');
});

/* ================= ACERTO ================= */
const acertoNumero = document.getElementById('acertoNumeroMostruario');
const acertoCodigoVend = document.getElementById('acertoCodigoVendedora');
const acertoNomeVend = document.getElementById('acertoNomeVendedora');
const acertoCodigoProd = document.getElementById('acertoCodigoProduto');
const acertoDesc = document.getElementById('acertoDescricaoProduto');
const acertoQtdRetirada = document.getElementById('acertoQtdRetirada');
const acertoQtdDev = document.getElementById('acertoQtdDevolvida');
const acertoListaContainer = document.getElementById('acertoListaContainer');
const acertoTotalPecas = document.getElementById('acertoTotalPecas');
const acertoTotalValor = document.getElementById('acertoTotalValor');

let acertoItens = [];
let mostruarioAtual = null;

acertoNumero?.addEventListener('input', ()=>{
  mostruarioAtual = mostruarios.find(m=>m.numero === acertoNumero.value);

  if(!mostruarioAtual) return;

  const vend = vendedoras.find(v=>v.codigo === mostruarioAtual.codigoVend);

  acertoCodigoVend.value = vend?.codigo || '';
  acertoNomeVend.value = vend?.nome || '';
});

acertoCodigoProd?.addEventListener('input', ()=>{
  if(!mostruarioAtual) return;

  const item = mostruarioAtual.produtos.find(p=>p.codigo === acertoCodigoProd.value);
  if(item){
    acertoDesc.value = item.descricao;
    acertoQtdRetirada.value = item.qtd;
  }
});

acertoQtdDev?.addEventListener('keydown', e=>{
  if(e.key === 'Enter'){
    const retirada = Number(acertoQtdRetirada.value);
    const devolvida = Number(acertoQtdDev.value);
    const vendida = retirada - devolvida;

    const produto = produtos.find(p=>p.codigo === acertoCodigoProd.value);

    acertoItens.push({
      codigo: acertoCodigoProd.value,
      descricao: acertoDesc.value,
      retirada,
      devolvida,
      vendida,
      valor: vendida * Number(produto?.preco || 0)
    });

    renderAcerto();

    acertoCodigoProd.value = '';
    acertoQtdDev.value = '';
  }
});

function renderAcerto(){
  if(!acertoListaContainer) return;

  let totalPecas = 0;
  let totalValor = 0;

  acertoListaContainer.innerHTML = acertoItens.map(i=>{
    totalPecas += i.vendida;
    totalValor += i.valor;

    return `
      <div class="acerto-item">
        <span>${i.codigo}</span>
        <span>${i.descricao}</span>
        <span>${i.retirada}</span>
        <span>${i.devolvida}</span>
        <span>${i.vendida}</span>
        <span>R$ ${i.valor.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  acertoTotalPecas.innerText = totalPecas;
  acertoTotalValor.innerText = 'R$ ' + totalValor.toFixed(2);
}

/* ================= INIT ================= */
renderProdutos();
renderVendedoras();
renderLista();
