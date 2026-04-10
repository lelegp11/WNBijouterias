const sections = [...document.querySelectorAll('.screen')];

function activate(id) {
  sections.forEach(s => s.classList.toggle('active', s.id === id));
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.nav-btn');
  if (!btn) return;
  activate(btn.dataset.target);
});

/* STATES */
let produtos = [
  { codigo: 'P001', descricao: 'Anel', preco: 30 },
  { codigo: 'P002', descricao: 'Brinco', preco: 20 }
];

let vendedoras = [];
let mostruarios = [];

/* HELPERS */
function buscarProduto(cod) {
  return produtos.find(p => p.codigo === cod);
}

/* MOSTRUÁRIO */
const listaProdutosContainer = document.getElementById('listaProdutosContainer');
const totalMostruarioValor = document.getElementById('totalMostruarioValor');

let draftProdutos = [];

document.getElementById('codigoProduto').addEventListener('input', e => {
  const p = buscarProduto(e.target.value);
  if (p) {
    descricaoProduto.value = p.descricao;
    precoProdutoMostruario.value = p.preco;
  }
});

document.getElementById('btnAdicionarProduto').onclick = () => {
  const cod = codigoProduto.value;
  const qtd = Number(qtdProduto.value);

  const p = buscarProduto(cod);
  if (!p) return alert("Produto inválido");

  draftProdutos.push({ ...p, qtd });

  renderLista();
};

function renderLista() {
  let total = 0;

  listaProdutosContainer.innerHTML = draftProdutos.map(p => {
    total += p.preco * p.qtd;
    return `<div>${p.descricao} - ${p.qtd}</div>`;
  }).join('');

  totalMostruarioValor.innerText = "R$ " + total;
}

/* SALVAR MOSTRUARIO */
document.getElementById('btnSalvarMostruario').onclick = () => {
  mostruarios.push({
    numero: numeroMostruario.value,
    codigoVendedora: codigoVendedoraMostruario.value,
    produtos: draftProdutos
  });

  alert("Salvo");
  activate('mostruario');
};
