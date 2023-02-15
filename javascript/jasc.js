var body;
var enderecos = null;
var enderecosClientes = '{ "clientes": {%add}}';
var enderecosApi = null;

const validarConta = (cliente, confirmeSenha) =>{
    let feedbacks = [];
    
    if(enderecosApi != null){
        console.log(enderecosApi.clientes);
        for(key in enderecosApi.clientes){
            let alvo = enderecosApi.clientes[key]
            console.log('vindo aqui: ' + alvo);
            if(cliente.email == enderecosApi.clientes[key].email){
                feedbacks.push('Email já utilizado');
            }
            if(cliente.senha == enderecosApi.clientes[key].senha){
                feedbacks.push('Senha já utilizada');
            }
        }

        console.log(feedbacks.length);
    }

    

    if(!validarCep(cliente)){
        feedbacks.push('Cep inválido ou inexistente');
    }

    if(cliente.senha != confirmeSenha){
        feedbacks.push('Repita igualmente a senha no confirmar senha');
    }

    return feedbacks;
}

const criarConta = () =>{

    document.getElementById('feedback').innerText = "";
    document.getElementById('feedback').className = "";

    let inputsToClean = [document.getElementById('email'),document.getElementById('senha'),
    document.getElementById('confirmeSenha'),document.getElementById('cep')];

    let nome = document.getElementById('nome').value;
    let sobrenome = document.getElementById('sobrenome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let confirmeSenha = document.getElementById('confirmeSenha').value;
    let cep = document.getElementById('cep').value;
    let numero = document.getElementById('numero').value;

    let cliente = '{"nome" : "'+ nome + '", "sobrenome" : "'+sobrenome+'", "email" : "'+email+'", "senha" : "'+senha+'", "cep" : "'+cep+'", "numero" : "'+numero+'", "endereco":""}'
    cliente = JSON.parse(cliente);
    console.log(cliente);
    let result = validarConta(cliente, confirmeSenha);
    console.log('resultado validação: ' + result.length);

    if(result.length > 0 && result.length != undefined){
        let erroFeed = document.getElementById('feedback');
        erroFeed.className = "erro";


        for(let i = 0; i < result.length;i++){
            erroFeed.append(result[i]);
            erroFeed.append(document.createElement('br'));
        }

        for(let i = 0 ; i < inputsToClean.length;i++){
            inputsToClean[i].value = null;
        }

    }else{
        pesquisarCep(cliente);
        console.log(cliente.endereco);

    }




}

const adicionarClienteSistema = (cliente) => {

    enderecosClientes = enderecosClientes.replace('%add', '"'+cliente.nome+'":'+JSON.stringify(cliente)+', %add');
    enderecosClientesS = enderecosClientes.replace(', %add', '');
    enderecosClientesS = enderecosClientesS.replace('%add', '');
    console.log(enderecosClientes);
    enderecosApi = JSON.parse(enderecosClientesS);
    console.log('sistema' + enderecosApi);
    /*add a select box of a client
    let select = document.getElementById('clientes');
    let option = document.createElement('option');
    option.innerHTML = nome;
    option.value = nome;
    select.appendChild(option);*/
}

//cep

//preencher os inputs com arrow functions
const preencherFormulario = (cliente) => {
    let oldInner = document.getElementsByClassName('loginCadastroBg').innerHTML;
    document.getElementsByClassName('loginCadastroBg').innerHTML = "";
    let mapa = document.getElementById("mapa");
    console.log('sdaaaaaa'+cliente);
    console.log(cliente.endereco);

    let rua = cliente.endereco.logradouro;
    let estado = cliente.endereco.uf;
    let cidade = cliente.endereco.localidade;
    let bairro = cliente.endereco.bairro;

    enderecos = '{"rua" : "' + rua + '", "estado" : "'+estado+'", "cidade" : "'+cidade+'", "bairro" : "'+bairro+'" }';
    const datas = JSON.parse(enderecos);
    console.log(datas);

    estado = estado.replaceAll(" ", "%20");
    rua = rua.replaceAll(" ", "%20");
    cidade = cidade.replaceAll(" ", "%20");
    bairro = bairro.replaceAll(" ", "%20");     
         
    mapa.innerHTML = "<div class="+"mapouter"+"><div class="+"gmap_canvas"+"><iframe width="+"600"+" height="+"500"+" id="+"gmap_canvas"+" src="+"https://maps.google.com/maps?q="+cidade+",%20"+ bairro+ ",%20"+rua+",20%"+estado+"&t=&z=18&ie=UTF8&iwloc=&output=embed"+" frameborder="+"0"+" scrolling="+"no"+" marginheight="+"0"+" marginwidth="+"0"+"></iframe><br><style>.mapouter{position:relative;text-align:right;height:500px;width:600px;}</style><a href="+"https://www.embedgooglemap.net"+ ">embed google maps website</a><style>.gmap_canvas {overflow:hidden;background:none!important;height:500px;width:600px;}</style></div></div>";
    document.getElementById('endereco').innerHTML = '<ol>' + '<li>rua: '+datas.rua+'</li> <li>estado: '+datas.estado+'</li> <li>cidade: '+datas.cidade+'</li> <li>cidade: '+datas.bairro+'</li>'
    + '</ol>'

    console.log("LINK : https://maps.google.com/maps?q="+cidade+",%20"+ bairro+ ",%20"+rua+",20%"+estado+"&t=&z=13&ie=UTF8&iwloc=&output=embed");

    
}
//autopreenchimento
const cepValido = (cep) => {
    if (cep.length = 8) { 
        return true;
    } else {
        return false;
    }
}
//buscar API
//Com async e await podemos trabalhar com código assíncrono em um estilo mais parecido com o bom e velho código síncrono.

const validarCep = async (cliente) =>{

    const url = `http://viacep.com.br/ws/${cliente.cep}/json`;
    const dados = await fetch(url);
    const endereco = await dados.json();

    console.log(endereco);

    if (endereco.erro) {
        console.log('false');
        return false;

    }else if(endereco.logradouro != undefined){
        console.log('true');
        return true;
    }

}

const pesquisarCep = async (cliente) => {

    const url = `http://viacep.com.br/ws/${cliente.cep}/json/`;
    
    if (cepValido(cliente.cep)) {
        
        const dados = await fetch(url);
        const endereco = await dados.json();
        console.log(endereco);
        cliente.endereco = endereco;
        adicionarClienteSistema(cliente);
        preencherFormulario(cliente);
    }
}

const atualizarBaseDeDados = () =>{
    fetch(`https://economia.awesomeapi.com.br/json/last/USD-BRL`).then(response => {
        return response.json()
    }).then(corpo => {

        console.log("api carregada");
        console.log(corpo);
        body = corpo;
    })
}

atualizarBaseDeDados();



const converter = () => {
    atualizarBaseDeDados();
    const inputReais = document.getElementById("reais");
    const inputUsd = document.getElementById("dolar");

    console.log(inputReais);
    inputUsd.value = inputReais.value / body.USDBRL.high;
}


