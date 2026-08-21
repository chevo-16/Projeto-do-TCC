function validarCadastro(event) {
  event.preventDefault();

  const senha = document.getElementById('cad-senha').value;
  const confirmarSenha = document.getElementById('cad-confirmar-senha').value;
  const msgErro = document.getElementById('msg-erro');

  if (senha !== confirmarSenha) {
    msgErro.textContent = 'As senhas não coincidem! Verifique e tente novamente.';
    msgErro.style.display = 'block';
    return false;
  }

  msgErro.style.display = 'none';
 
  window.location.href = 'index02.html'; 
}