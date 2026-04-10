const screens = document.querySelectorAll('.screen');
const buttons = document.querySelectorAll('.nav-btn');

buttons.forEach(btn=>{
  btn.onclick=()=>{
    screens.forEach(s=>s.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  }
});

const vendedoras = [];
const produtos = [];
const mostruarios = [];

/* VENDEDORA */
function renderVendedoras(){
  const tbody = document.getElementById('tabelaVendedoras');
  tbody.innerHTML = vendedoras.map(v=>`
    <tr>
      <td>${v.codigo}</td>
      <td>${v.nome}</td>
      <td>${v.ultimo}</td>
      <td>${v.proximo}</td>
      <td><button onclick="excluirVendedora('${v.codigo}')">X</button></td>
    </tr>
  `).join('');
}

function excluirVendedora(codigo){
  const i = vendedoras.findIndex(v=>v.codigo===codigo);
  vendedoras.splice(i,1);
  renderVendedoras();
}

/* PRODUTOS */
function renderProdutos(){
  const tbody = document.getElementById('tabelaProdutos');
  tbody.innerHTML = produtos.map(p=>`
    <tr>
      <td>${p.codigo}</td>
      <td>${p.descricao}</td>
      <td>${p.preco}</td>
      <td>${p.data}</td>
    </tr>
  `).join('');
}

/* ACERTO */
const listaAcerto = [];
const totalAcerto = document.getElementById('totalAcerto');

document.getElementById('acertoCodigoVendedora').oninput = function(){
  const v = vendedoras.find(v=>v.codigo===this.value);
  document.getElementById('acertoNomeVendedora').value = v ? v.nome : '';
}

document.getElementById('acertoCodigoProduto').oninput = function(){
  const p = produtos.find(p=>p.codigo===this.value);
  document.getElementById('acertoDescricaoProduto').value = p ? p.descricao : '';
  document.getElementById('acertoQtdRetirada').value = 10;
}

document.getElementById('acertoQtdDevolvida').onkeydown = function(e){
  if(e.key==="Enter"){
    const codigo = document.getElementById('acertoCodigoProduto').value;
    const devolvida = Number(this.value);
    const retirada = Number(document.getElementById('acertoQtdRetirada').value);

    const p = produtos.find(p=>p.codigo===codigo);
    const vendida = retirada - devolvida;
    const valor = vendida * (p?.preco || 0);

    listaAcerto.push({codigo, vendida, valor});
    renderAcerto();
    this.value='';
  }
}

function renderAcerto(){
  document.getElementById('listaAcerto').innerHTML = listaAcerto.map(i=>`
    <div>${i.codigo} - Vendido: ${i.vendida} - R$ ${i.valor}</div>
  `).join('');

  const total = listaAcerto.reduce((s,i)=>s+i.valor,0);
  totalAcerto.innerText = "R$ "+total.toFixed(2);
}

/* INIT */
renderVendedoras();
renderProdutos();
