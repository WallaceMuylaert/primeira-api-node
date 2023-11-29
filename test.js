import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './server.js';  

const assert = chai.assert;

chai.use(chaiHttp);

describe('Testes de integração para rotas', () => {
  it('Deve criar um novo vídeo', (done) => {
    chai.request(app)
      .post('/videos')
      .send({
        title: 'Novo Vídeo',
        description: 'Descrição do novo vídeo',
        duration: 120,
      })
      .end((err, res) => {
        assert.equal(res.status, 201);
        done();
      });
  });
});
