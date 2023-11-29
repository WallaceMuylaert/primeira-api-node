// Importando módulos necessários para testes
import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './server.js';  // Importando o objeto do aplicativo diretamente

const assert = chai.assert;

chai.use(chaiHttp);

// Descrevendo o conjunto de testes para as rotas de integração
describe('Testes de integração para rotas', () => {
  // Teste: Deve criar um novo vídeo
  it('Deve criar um novo vídeo', (done) => {
    // Enviando uma requisição HTTP POST para a rota /videos
    chai.request(app)
      .post('/videos')
      // Enviando dados do vídeo no corpo da requisição
      .send({
        title: 'Novo Vídeo',
        description: 'Descrição do novo vídeo',
        duration: 120,
      })
      // Tratando a resposta da requisição
      .end((err, res) => {
        // Verificando se o status da resposta é 201 (Created)
        assert.equal(res.status, 201);
        // Indicando que o teste está concluído
        done();
      });
  });
});
