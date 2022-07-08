import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // importacao do fireStorage
import { async } from '@firebase/util';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private readonly baseUrl: string = 'http://localhost:3000/funcionarios'

  constructor(
    private storage: AngularFireStorage, // objeto responsavel por salvar as imagens no firebase
    private http: HttpClient
  ) { }

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl)
  }

  deleteFuncionario(func: Funcionario): Observable<any> {
    //se nao tiver foto, apenas sera deletado o email e o nome
    if(func.foto.length > 0) {
      // 1- pegar a referencia da imagem do firestorage
      // refFromUrl() pega a referencia do arquivo do starage pelo link de acesso gerado pelo firebase
      this.storage.refFromURL(func.foto).delete().pipe(
        mergeMap(() => {
          //mergeMap tem a funcao de pegar dois ou mais observables e transformar todos em um so
          return this.http.delete<any>(`${this.baseUrl}/${func.id}`)
        })
      )
    }
    return this.http.delete<any>(`${this.baseUrl}/${func.id}`)
  }

  getFuncionarioById(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`)
  }
  //O '?' na frente do parametro faz com que ele seja opcional na hora de executar a funcao
  // RXJS operator: funcoes que manipulam os dados que os observables te retornam
  salvarFuncionario(func: Funcionario, foto?: File) {
    // fazendo requisicao POST para salvar os dados do funcionario
    //@return funcionario que acabou de ser salvo

    // A funcao pipe é utilizada para colocar os operadores do WXJS que manipularao
    // os dados que sao retornados dos observables
    if (foto == undefined) { // se a foto nao existe sera retornado um observable que apenas salva os dados basicos
      return this.http.post<Funcionario>(this.baseUrl, func)
    }
    return this.http.post<Funcionario>(this.baseUrl, func).pipe(
      map(async (func) => {
        // 1- fazer upload da imagem e recuperar o link gerado
        const linkFotoFirebase = await this.uploadImagem(foto)
        //2- atribuir o link gerado ao funcionario criado
        func.foto = linkFotoFirebase        
        //3- atualizar funcionarios com a foto
        return this.atualizarFuncionario(func)
      })
    )
  }

  atualizarFuncionario(func: Funcionario, foto?: File): any {
    // se a foto nao foi passada, atualizar apenas com os daods basicos
    if (foto == undefined) {
    return this.http.put<Funcionario>(`${this.baseUrl}/${func.id}`, func)
    }

    // se ja existir uma foto ligada a esse funcionario, iremos deleta-la para por a nova
    if (func.foto.length > 0){
      const inscricao = this.storage.refFromURL(func.foto).delete().subscribe(
        () => {
          inscricao.unsubscribe()
        }
      )
    }
    return this.http.put<Funcionario>(`${this.baseUrl}/${func.id}`, func).pipe(
      mergeMap(async (funcionarioAtualizado) => {
        const linkFotoFirebase = await this.uploadImagem(foto)

        funcionarioAtualizado.foto = linkFotoFirebase

        return this.atualizarFuncionario(funcionarioAtualizado)
      })
    )
  }

  // 1º pegar a imagem
  // 2º fazer o upload da imagem
  // 3º Gerar o link de download e retorna-lo
  private async uploadImagem(foto: File): Promise<string> { // a palavra async informa que a funcao vai trabalhar com codigo assincrono , ou seja, codigos que demoram para serem executados, sempre vem com Promise.
    const nomeDoArquivo = Date.now() // retorna a data atual em milissegundos

    // faz o upload do arquivo para o firebase
    // 1 parametro: nome do arquivo
    // 2 parametro: o arquivo deve ser enviado
    const dados = await this.storage.upload(`${nomeDoArquivo}`, foto)

    // a propriedade REF é a referencia do arquivo no firebase
    const downloadURL = await dados.ref.getDownloadURL() // retorna um link pro acesso da imagem

    return downloadURL
  }
}
